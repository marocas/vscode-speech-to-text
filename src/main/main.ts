import dotenv from 'dotenv';
import { app, BrowserWindow, clipboard, ipcMain, Menu, nativeImage, Tray } from 'electron';
import Store from 'electron-store';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
import path from 'path';
import { APP_STORE_CWD } from '../shared/constants';
import type { AuthUser } from '../shared/types';
import { registerSettingsIpcHandlers } from './ipc/settings-handlers';
import { hashPassword, verifyPassword } from './services/auth-utils';
import { BubbleWindowManager } from './services/bubble-window';
import { DatabaseService } from './services/database';
import { GlobalHotkeyManager } from './services/global-hotkey';
import { NotificationService } from './services/notification-service';
import {
  DEFAULT_LLM_SETTINGS,
  DEFAULT_MACHINE_SETTINGS,
  getMachineSettings,
} from './services/settings-store';
import { SpeechToTextService } from './services/speech-to-text';

// Load .env from resources directory in production, or from project root in development
dotenv.config({
  path: app.isPackaged ? path.join(process.resourcesPath, '.env') : path.resolve('.env'),
});

let mainWindow: BrowserWindow | null = null;
let speechService: SpeechToTextService;
let dbService: DatabaseService;
let hotkeyManager: GlobalHotkeyManager;
let notificationService: NotificationService;
let bubbleManager: BubbleWindowManager;
let tray: Tray | null = null;
let currentAuthenticatedUserId: string | null = null;
let lastExternalTargetAppName: string | null = null;
const sessionStore = new Store<{ currentUserId: string | null }>({
  name: 'session',
  cwd: APP_STORE_CWD,
  defaults: {
    currentUserId: null,
  },
});
const execFileAsync = promisify(execFile);

async function setAuthenticatedUser(user: AuthUser | null) {
  currentAuthenticatedUserId = user?.id ?? null;
  sessionStore.set('currentUserId', currentAuthenticatedUserId);
  await speechService?.setCurrentUser(currentAuthenticatedUserId);

  if (!speechService) {
    return;
  }

  if (!currentAuthenticatedUserId) {
    speechService.updateLlmSettings(DEFAULT_LLM_SETTINGS);
    return;
  }

  const llmSettings = await dbService.getUserLlmSettings(currentAuthenticatedUserId);
  speechService.updateLlmSettings(llmSettings);
}

async function restoreAuthenticatedUserSession() {
  const persistedUserId = sessionStore.get('currentUserId');
  if (!persistedUserId) {
    await setAuthenticatedUser(null);
    return;
  }

  const user = await dbService.getUserById(persistedUserId);
  if (!user) {
    await setAuthenticatedUser(null);
    return;
  }

  await setAuthenticatedUser(user);
}

async function runAppleScript(lines: string[]): Promise<string> {
  const args = lines.flatMap((line) => ['-e', line]);
  const { stdout } = await execFileAsync('osascript', args);
  return stdout.trim();
}

async function getFrontAppNameOnMac(): Promise<string | null> {
  try {
    const appName = await runAppleScript([
      'tell application "System Events"',
      '  set frontApp to first application process whose frontmost is true',
      '  return name of frontApp',
      'end tell',
    ]);

    return appName || null;
  } catch {
    return null;
  }
}

function isOwnAppName(appName: string | null): boolean {
  if (!appName) {
    return false;
  }

  const normalized = appName.trim().toLowerCase();
  const ownNames = new Set([
    app.getName().trim().toLowerCase(),
    'smart transcription daemon',
    'smart-transcription-daemon',
    'electron',
  ]);

  return ownNames.has(normalized);
}

async function rememberExternalFrontAppOnMac(): Promise<void> {
  const frontAppName = await getFrontAppNameOnMac();
  if (frontAppName && !isOwnAppName(frontAppName)) {
    lastExternalTargetAppName = frontAppName;
  }
}

async function hasFocusedEditableFieldOnMac(): Promise<boolean> {
  try {
    const result = await runAppleScript([
      'tell application "System Events"',
      '  set frontApp to first application process whose frontmost is true',
      '  try',
      '    set focusedElement to value of attribute "AXFocusedUIElement" of frontApp',
      '    set roleName to value of attribute "AXRole" of focusedElement',
      '    set editableValue to false',
      '    try',
      '      set editableValue to value of attribute "AXEditable" of focusedElement',
      '    end try',
      '    if roleName is in {"AXTextField", "AXTextArea", "AXComboBox", "AXSearchField", "AXTextView", "AXWebArea"} then return "true"',
      '    if editableValue is true then return "true"',
      '    return "false"',
      '  on error',
      '    return "false"',
      '  end try',
      'end tell',
    ]);

    return result === 'true';
  } catch {
    return false;
  }
}

async function hasFocusedEditableFieldInAppOnMac(appName: string): Promise<boolean> {
  try {
    const result = await runAppleScript([
      'tell application "System Events"',
      `  set theApp to first application process whose name is "${appName.replace(/"/g, '\\"')}"`,
      '  try',
      '    set focusedElement to value of attribute "AXFocusedUIElement" of theApp',
      '    set roleName to value of attribute "AXRole" of focusedElement',
      '    set editableValue to false',
      '    try',
      '      set editableValue to value of attribute "AXEditable" of focusedElement',
      '    end try',
      '    if roleName is in {"AXTextField", "AXTextArea", "AXComboBox", "AXSearchField", "AXTextView", "AXWebArea"} then return "true"',
      '    if editableValue is true then return "true"',
      '    return "false"',
      '  on error',
      '    return "false"',
      '  end try',
      'end tell',
    ]);

    return result === 'true';
  } catch {
    return false;
  }
}

async function isFrontAppVSCodeOnMac(): Promise<boolean> {
  try {
    const result = await runAppleScript([
      'tell application "System Events"',
      '  set frontApp to first application process whose frontmost is true',
      '  set appName to name of frontApp',
      '  if appName is "Visual Studio Code" or appName is "Code" then return "true"',
      '  return "false"',
      'end tell',
    ]);

    return result === 'true';
  } catch {
    return false;
  }
}

async function pasteIntoFocusedAppOnMac(): Promise<boolean> {
  try {
    await runAppleScript([
      'tell application "System Events"',
      '  keystroke "v" using command down',
      'end tell',
    ]);
    return true;
  } catch {
    return false;
  }
}

async function pasteIntoAppOnMac(appName: string): Promise<boolean> {
  try {
    await runAppleScript([
      `tell application "${appName.replace(/"/g, '\\"')}" to activate`,
      'delay 0.08',
      'tell application "System Events"',
      '  keystroke "v" using command down',
      'end tell',
    ]);
    return true;
  } catch {
    return false;
  }
}

function createWindow() {
  const isDevelopment = !app.isPackaged;
  const shouldOpenDevTools = process.env.ELECTRON_OPEN_DEVTOOLS === '1';

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDevelopment) {
    const urlFile = path.join(__dirname, '../.dev-server-url');
    const rendererUrl = fs.readFileSync(urlFile, 'utf-8').trim();
    mainWindow.loadURL(rendererUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  if (isDevelopment && shouldOpenDevTools) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // macOS: hide instead of close so the renderer stays alive for hotkey dictation
  if (process.platform === 'darwin') {
    let isQuitting = false;
    app.on('before-quit', () => {
      isQuitting = true;
    });
    mainWindow.on('close', (e) => {
      if (!isQuitting) {
        e.preventDefault();
        mainWindow?.hide();
      }
    });
  }
}

async function initializeServices() {
  try {
    dbService = new DatabaseService();
    await dbService.initialize();

    notificationService = new NotificationService();
    bubbleManager = new BubbleWindowManager();

    speechService = new SpeechToTextService(dbService);
    await speechService.initialize();
    const machineSettings = getMachineSettings();
    speechService.updateMachineSettings({
      whisperCommand: machineSettings.whisperCommand,
      whisperModelPath: machineSettings.whisperModelPath,
      sourceLanguage: machineSettings.sourceLanguage,
    });
    speechService.updateLlmSettings(DEFAULT_LLM_SETTINGS);
    await speechService.setCurrentUser(null);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Failed to initialize services:', errorMsg);
    throw new Error(`Application initialization failed: ${errorMsg}`);
  }
}

function setupGlobalHotkey() {
  const initialHotkey = getMachineSettings().globalDictationHotkey;
  hotkeyManager = new GlobalHotkeyManager(initialHotkey, (type: 'pressed' | 'released') => {
    mainWindow?.webContents.send(`global-dictation-hotkey-${type}`);
  });

  const registered = hotkeyManager.register(initialHotkey);
  if (!registered) {
    hotkeyManager.register(DEFAULT_MACHINE_SETTINGS.globalDictationHotkey);
  }
}

app.on('ready', async () => {
  try {
    await initializeServices();
  } catch (error) {
    console.error('Exiting due to initialization failure:', error);
    app.quit();
    return;
  }
  await restoreAuthenticatedUserSession();
  createWindow();
  setupGlobalHotkey();
  if (getMachineSettings().bubbleEnabled) {
    bubbleManager.init();
  }
  registerSettingsIpcHandlers({
    dbService,
    getCurrentUserId: () => currentAuthenticatedUserId,
    speechService,
    hotkeyManager,
    bubbleManager,
  });
  setupMenu();
  setupTray();
});

app.on('will-quit', () => {
  hotkeyManager?.unregisterAll();
  bubbleManager?.destroy();
  tray?.destroy();
  tray = null;
});

app.on('window-all-closed', () => {
  void dbService?.close();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// Catch uncaught exceptions to prevent silent failures
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  app.quit();
});

// IPC Handlers
ipcMain.handle('start-dictation', async (_event, options: { targetLanguage: string }) => {
  try {
    if (!speechService) {
      throw new Error('Speech service not initialized. Please restart the application.');
    }
    if (process.platform === 'darwin') {
      await rememberExternalFrontAppOnMac();
    }
    return await speechService.startDictation(options.targetLanguage);
  } catch (error) {
    console.error('Dictation error:', error);
    throw error;
  }
});

ipcMain.handle('stop-dictation', async () => {
  try {
    if (!speechService) {
      throw new Error('Speech service not initialized. Please restart the application.');
    }
    return await speechService.stopDictation();
  } catch (error) {
    console.error('Error stopping dictation:', error);
    throw error;
  }
});

ipcMain.handle('save-dictation', async (_event, text: string) => {
  try {
    return await speechService.stopDictation(text);
  } catch (error) {
    console.error('Error saving dictation:', error);
    throw error;
  }
});

ipcMain.handle(
  'process-dictation-text',
  async (
    _event,
    payload: { text: string; targetLanguage?: string; sourceLanguage?: string } | string
  ) => {
    try {
      const text = typeof payload === 'string' ? payload : payload.text;
      const targetLanguage = typeof payload === 'string' ? undefined : payload.targetLanguage;
      const sourceLanguage = typeof payload === 'string' ? undefined : payload.sourceLanguage;
      return await speechService.processDictationResult(text, targetLanguage, sourceLanguage);
    } catch (error) {
      console.error('Error processing dictation text:', error);
      throw error;
    }
  }
);

ipcMain.handle(
  'transcribe-audio',
  async (_event, payload: { audioBuffer: ArrayBuffer; language: string }) => {
    if (
      !payload?.audioBuffer ||
      !(payload.audioBuffer instanceof ArrayBuffer || Buffer.isBuffer(payload.audioBuffer))
    ) {
      throw new Error('Invalid audio payload: missing or malformed audio buffer.');
    }
    const audioBytes = Buffer.from(payload.audioBuffer);
    if (audioBytes.length === 0) {
      throw new Error('Audio buffer is empty.');
    }
    // Reject payloads over 50 MB to prevent abuse
    const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
    if (audioBytes.length > MAX_AUDIO_SIZE) {
      throw new Error(
        `Audio buffer too large (${(audioBytes.length / 1024 / 1024).toFixed(1)} MB). Max is 50 MB.`
      );
    }
    try {
      return await speechService.transcribeWavAudio(audioBytes, payload.language);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
);

// Bubble state — driven by the renderer so it stays in sync with the UI
ipcMain.handle('set-bubble-state', (_event, state: string) => {
  if (getMachineSettings().bubbleEnabled === false) return;
  const validStates = new Set(['idle', 'recording', 'processing']);
  if (validStates.has(state)) {
    bubbleManager.setState(state as 'idle' | 'recording' | 'processing');
  }
});

ipcMain.handle('get-dictations', async (_event, limit?: number) => {
  return speechService.getDictations(limit ?? 50);
});

ipcMain.handle('delete-dictation', async (_event, id: string) => {
  return speechService.deleteDictation(id);
});

ipcMain.handle('clear-dictation-history', async () => {
  return speechService.clearDictationHistory();
});

ipcMain.handle(
  'register-user',
  async (_event, payload: { email?: string; username?: string; password?: string }) => {
    const email = payload?.email?.trim() || '';
    const username = payload?.username?.trim() || '';
    const password = payload?.password || '';

    if (!email || !username || !password) {
      return { success: false, message: 'Email, username and password are required.' };
    }

    try {
      const user = await dbService.createUser(email, username, hashPassword(password));
      await setAuthenticatedUser(user);
      return { success: true, message: 'Account created successfully.', user };
    } catch (error) {
      return { success: false, message: (error as Error).message || 'Failed to create account.' };
    }
  }
);

ipcMain.handle(
  'authenticate-user',
  async (_event, payload: { identifier?: string; password?: string }) => {
    const identifier = payload?.identifier?.trim() || '';
    const password = payload?.password || '';

    if (!identifier || !password) {
      return { success: false, message: 'Email/username and password are required.' };
    }

    const user = await dbService.findUserByIdentifier(identifier);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { success: false, message: 'Invalid email/username or password.' };
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    await setAuthenticatedUser(safeUser);
    return { success: true, message: 'Login successful.', user: safeUser };
  }
);

ipcMain.handle(
  'change-password',
  async (
    _event,
    payload: { identifier?: string; currentPassword?: string; newPassword?: string }
  ): Promise<{ success: boolean; message: string }> => {
    const identifier = payload?.identifier?.trim() || '';
    const currentPassword = payload?.currentPassword || '';
    const newPassword = payload?.newPassword || '';

    if (!identifier || !currentPassword || !newPassword) {
      return {
        success: false,
        message: 'Username/email, current password and new password are required.',
      };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'New password must have at least 8 characters.',
      };
    }

    const user = await dbService.findUserByIdentifier(identifier);
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return {
        success: false,
        message: 'Invalid username/email or current password.',
      };
    }

    await dbService.updateUserPassword(user.id, hashPassword(newPassword));
    return { success: true, message: 'Password updated successfully. Please sign in again.' };
  }
);

ipcMain.handle('logout-user', async () => {
  await setAuthenticatedUser(null);
  return { success: true };
});

ipcMain.handle('get-current-user', async () => {
  if (!currentAuthenticatedUserId) {
    return null;
  }
  return dbService.getUserById(currentAuthenticatedUserId);
});

ipcMain.handle('send-to-vscode', async (_event, text: string) => {
  if (!text || !text.trim()) {
    return { success: false, message: 'No text to send.' };
  }

  const frontAppName = process.platform === 'darwin' ? await getFrontAppNameOnMac() : null;
  if (process.platform === 'darwin' && frontAppName && !isOwnAppName(frontAppName)) {
    lastExternalTargetAppName = frontAppName;
  }
  clipboard.writeText(text);

  if (process.platform === 'darwin' && getMachineSettings().autoPasteEnabled) {
    const isOwnFrontApp = isOwnAppName(frontAppName);
    const targetAppName = isOwnFrontApp ? lastExternalTargetAppName : frontAppName;

    let hasFocusedEditableField: boolean;
    if (isOwnFrontApp && targetAppName) {
      // Check if fallback app has editable field (conservative approach)
      hasFocusedEditableField = await hasFocusedEditableFieldInAppOnMac(targetAppName);
    } else if (!isOwnFrontApp) {
      // Check current app if it's external
      hasFocusedEditableField = await hasFocusedEditableFieldOnMac();
    } else {
      // No external app to paste into
      hasFocusedEditableField = false;
    }

    const isFrontVSCode = !isOwnFrontApp && (await isFrontAppVSCodeOnMac());

    // Copilot chat input in VS Code can expose accessibility roles that are not plain text fields.
    if (hasFocusedEditableField || isFrontVSCode || (!isOwnFrontApp && Boolean(targetAppName))) {
      const pasted =
        false && targetAppName
          ? await pasteIntoAppOnMac(targetAppName as string)
          : await pasteIntoFocusedAppOnMac();
      if (pasted) {
        return {
          success: true,
          message: `Text pasted into ${targetAppName ?? frontAppName ?? 'the focused app'}.`,
        };
      }

      return {
        success: true,
        message:
          'Text copied to clipboard. Auto-paste was attempted but failed (check macOS Accessibility permissions).',
      };
    }
  }

  return {
    success: true,
    message: 'Text copied to clipboard. No focused text field detected.',
  };
});

ipcMain.handle('add-to-dictionary', (_event, word: string, category: string) => {
  if (!currentAuthenticatedUserId) throw new Error('You must be logged in.');
  const trimmedWord = (word ?? '').trim();
  const trimmedCategory = (category ?? '').trim();
  if (!trimmedWord) {
    throw new Error('Word cannot be empty.');
  }
  if (trimmedWord.length > 200) {
    throw new Error('Word is too long (max 200 characters).');
  }
  return dbService.addToDictionary(
    trimmedWord,
    trimmedCategory || 'custom',
    currentAuthenticatedUserId
  );
});

ipcMain.handle('get-dictionary', async () => {
  if (!currentAuthenticatedUserId) throw new Error('You must be logged in.');
  return dbService.getDictionary(currentAuthenticatedUserId);
});

ipcMain.handle(
  'add-snippet',
  async (_event, trigger: string, replacement: string, category: string) => {
    if (!currentAuthenticatedUserId) throw new Error('You must be logged in.');
    const trimmedTrigger = (trigger ?? '').trim();
    const trimmedReplacement = (replacement ?? '').trim();
    const trimmedCategory = (category ?? '').trim();
    if (!trimmedTrigger) {
      throw new Error('Snippet trigger cannot be empty.');
    }
    if (!trimmedReplacement) {
      throw new Error('Snippet replacement cannot be empty.');
    }
    if (trimmedTrigger.length > 200) {
      throw new Error('Trigger is too long (max 200 characters).');
    }
    if (trimmedReplacement.length > 5000) {
      throw new Error('Replacement text is too long (max 5000 characters).');
    }
    return dbService.addSnippet(
      trimmedTrigger,
      trimmedReplacement,
      trimmedCategory || 'general',
      currentAuthenticatedUserId
    );
  }
);

ipcMain.handle('get-snippets', async () => {
  if (!currentAuthenticatedUserId) throw new Error('You must be logged in.');
  return dbService.getSnippets(currentAuthenticatedUserId);
});

ipcMain.handle('delete-snippet', async (_event, id: string) => {
  if (!currentAuthenticatedUserId) throw new Error('You must be logged in.');
  return dbService.deleteSnippet(id, currentAuthenticatedUserId);
});

ipcMain.handle('add-notification', (_event, message: string, type?: string) => {
  const notificationType = (type as 'error' | 'warning' | 'info' | 'success') || 'error';
  const notification = notificationService.addNotification(message, notificationType);
  return { success: true, message: 'Notification added.', notification };
});

ipcMain.handle('get-notifications', () => {
  const notifications = notificationService.getNotifications();
  const unreadCount = notificationService.getUnreadCount();
  return { success: true, notifications, unreadCount };
});

ipcMain.handle('get-notification-unread-count', () => {
  return notificationService.getUnreadCount();
});

ipcMain.handle('mark-notification-as-read', (_event, notificationId: string) => {
  const notification = notificationService.markAsRead(notificationId);
  if (notification) {
    return { success: true, message: 'Notification marked as read.', notification };
  }

  return { success: false, message: 'Notification not found.' };
});

ipcMain.handle('delete-notification', (_event, notificationId: string) => {
  const deleted = notificationService.deleteNotification(notificationId);
  if (deleted) {
    return { success: true, message: 'Notification deleted.' };
  }

  return { success: false, message: 'Notification not found.' };
});

ipcMain.handle('clear-all-notifications', () => {
  const count = notificationService.clearAllNotifications();
  return { success: true, message: `Cleared ${count} notifications.` };
});

function setupTray() {
  // Load template image from file — macOS auto-adapts to light/dark menu bar
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'image', 'trayTemplate.png')
    : path.join(__dirname, '..', '..', 'public', 'image', 'trayTemplate.png');
  const icon = nativeImage.createFromPath(iconPath);
  icon.setTemplateImage(true);

  tray = new Tray(icon);
  tray.setToolTip('Smart Transcription Daemon');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open STD',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    {
      label: 'Settings...',
      accelerator: 'CmdOrCtrl+,',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
        mainWindow?.webContents.send('navigate', 'settings');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit STD',
      accelerator: 'CmdOrCtrl+Q',
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);
}

function setupMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [{ role: 'toggleDevTools' }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
