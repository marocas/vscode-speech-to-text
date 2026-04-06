import dotenv from 'dotenv';
import { app, BrowserWindow, clipboard, ipcMain, Menu } from 'electron';
import Store from 'electron-store';
import fs from 'node:fs';
import os from 'node:os';
import path from 'path';
import { APP_STORE_CWD } from '../shared/constants';
import type { AuthUser } from '../shared/types';
import { registerSettingsIpcHandlers } from './ipc/settings-handlers';
import { hashPassword, verifyPassword } from './services/auth-utils';
import { DatabaseService } from './services/database';
import type {
  AgentError,
  AgentPipelineResult,
  AgentStateChanged,
} from './services/native-agent-client';
import { NativeAgentClient } from './services/native-agent-client';
import { NotificationService } from './services/notification-service';
import { DEFAULT_LLM_SETTINGS, getMachineSettings } from './services/settings-store';
import { SpeechToTextService } from './services/speech-to-text';

// Load .env from resources directory in production, or from project root in development
dotenv.config({
  path: app.isPackaged ? path.join(process.resourcesPath, '.env') : path.resolve('.env'),
});

let mainWindow: BrowserWindow | null = null;
let speechService: SpeechToTextService;
let dbService: DatabaseService;
let notificationService: NotificationService;
let nativeAgent: NativeAgentClient | null = null;
let currentAuthenticatedUserId: string | null = null;
const sessionStore = new Store<{ currentUserId: string | null }>({
  name: 'session',
  cwd: APP_STORE_CWD,
  defaults: {
    currentUserId: null,
  },
});

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

    speechService = new SpeechToTextService(dbService);
    await speechService.initialize();
    const machineSettings = getMachineSettings();
    speechService.updateMachineSettings({
      sourceLanguage: machineSettings.sourceLanguage,
    });

    // Sync custom whisper models directory from settings
    const { setWhisperModelsDir } = await import('./services/whisper-models');
    setWhisperModelsDir(machineSettings.whisperModelsDir || null);

    speechService.updateLlmSettings(DEFAULT_LLM_SETTINGS);
    await speechService.setCurrentUser(null);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Failed to initialize services:', errorMsg);
    throw new Error(`Application initialization failed: ${errorMsg}`);
  }
}

async function startNativeAgent() {
  if (process.platform !== 'darwin') return;

  const agentPath = app.isPackaged
    ? path.join(process.resourcesPath, 'bin', 'STDAgent')
    : path.join(__dirname, '..', '..', 'native-agent', '.build', 'release', 'STDAgent');

  if (!fs.existsSync(agentPath)) {
    console.warn(`[NativeAgent] Binary not found at ${agentPath}. Skipping agent startup.`);
    console.warn('[NativeAgent] Build with: cd native-agent && swift build -c release');
    return;
  }

  nativeAgent = new NativeAgentClient();

  // Bridge agent events to renderer
  nativeAgent.on('hotkey-pressed', () => {
    mainWindow?.webContents.send('global-dictation-hotkey-pressed');
  });
  nativeAgent.on('hotkey-released', () => {
    mainWindow?.webContents.send('global-dictation-hotkey-released');
  });
  nativeAgent.on('state-changed', (payload: AgentStateChanged) => {
    mainWindow?.webContents.send('agent-state-changed', payload);
  });
  nativeAgent.on('pipeline-result', (payload: AgentPipelineResult) => {
    mainWindow?.webContents.send('agent-pipeline-result', payload);
    // Save to DB in background — renderer handles optimistic update
    if (payload.text && currentAuthenticatedUserId) {
      speechService
        ?.stopDictation(
          payload.text,
          payload.sourceApp,
          payload.rawText,
          payload.ollamaText,
          payload.audioPath
        )
        .catch((err) => {
          console.error('[NativeAgent] Failed to save dictation:', err);
        });
    }
  });
  nativeAgent.on('error', (payload: AgentError) => {
    console.error(`[NativeAgent] Error [${payload.code}]: ${payload.message}`);
    mainWindow?.webContents.send('agent-error', payload);
  });
  nativeAgent.on('open-settings', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
    mainWindow?.webContents.send('navigate', 'settings');
  });

  // Send configuration once connected
  nativeAgent.on('connected', async () => {
    console.log('[NativeAgent] Connected — sending configuration');
    const machineSettings = getMachineSettings();
    let llmSettings = DEFAULT_LLM_SETTINGS;
    if (currentAuthenticatedUserId) {
      llmSettings = await dbService.getUserLlmSettings(currentAuthenticatedUserId);
    }
    // Build dictionary map
    const dictionary: Record<string, string> = {};
    if (currentAuthenticatedUserId) {
      const entries = await dbService.getDictionary(currentAuthenticatedUserId);
      for (const entry of entries) {
        dictionary[entry.word] = entry.word;
      }
    }
    nativeAgent!.sendConfigure(machineSettings, llmSettings, dictionary);
  });

  try {
    await nativeAgent.start(agentPath);
    console.log('[NativeAgent] Started successfully');
  } catch (error) {
    console.error('[NativeAgent] Failed to start:', error);
    nativeAgent = null;
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
  registerSettingsIpcHandlers({
    dbService,
    getCurrentUserId: () => currentAuthenticatedUserId,
    speechService,
  });
  setupMenu();

  // Start native macOS agent (handles hotkey, audio, whisper, bubble, paste natively)
  await startNativeAgent();
});

app.on('will-quit', () => {
  nativeAgent?.stop().catch(() => {});
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

ipcMain.handle('save-dictation', async (_event, text: string, sourceApp?: string) => {
  try {
    return await speechService.stopDictation(text, sourceApp);
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

ipcMain.handle('get-dictations', async (_event, limit?: number) => {
  return speechService.getDictations(limit ?? 50);
});

ipcMain.handle('get-audio-data', async (_event, audioPath: string) => {
  try {
    const normalizedPath = path.resolve(audioPath);
    const debugDir = path.join(os.homedir(), '.std-agent-debug');
    if (!normalizedPath.startsWith(debugDir)) {
      console.error('[get-audio-data] Path outside debug dir:', normalizedPath);
      return null;
    }
    if (!fs.existsSync(normalizedPath)) {
      console.error('[get-audio-data] File not found:', normalizedPath);
      return null;
    }
    const data = fs.readFileSync(normalizedPath);
    console.log('[get-audio-data] Loaded', data.length, 'bytes from', normalizedPath);
    return `data:audio/wav;base64,${data.toString('base64')}`;
  } catch (err) {
    console.error('[get-audio-data] Error:', err);
    return null;
  }
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

  // Native agent handles text insertion via CGEvent paste.
  // This handler just copies to clipboard as a fallback for manual paste.
  clipboard.writeText(text);

  return {
    success: true,
    message: 'Text copied to clipboard.',
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
