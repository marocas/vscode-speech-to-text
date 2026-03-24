import {
  BrowserWindow,
  app,
  dialog,
  ipcMain,
  shell,
  systemPreferences,
  type OpenDialogOptions,
} from 'electron';
import { promises as fs, constants as fsConstants } from 'node:fs';
import path from 'node:path';
import type {
  AppLlmSettings,
  AppMachineSettings,
  MicrophonePermissionStatus,
  OllamaModelDownloadResult,
  PermissionActionResult,
  SttReadinessStatus,
  UpdateLlmSettingsResult,
  UpdateMachineSettingsResult,
  WhisperModelCandidate,
} from '../../shared/types';
import type { BubbleWindowManager } from '../services/bubble-window';
import type { DatabaseService } from '../services/database';
import { GlobalHotkeyManager } from '../services/global-hotkey';
import { downloadOllamaModel, getOllamaModelNames } from '../services/ollama';
import {
  DEFAULT_LLM_SETTINGS,
  DEFAULT_MACHINE_SETTINGS,
  getMachineSettings,
  normalizeMachineSettingsUpdate,
  resetMachineSettings,
  saveMachineSettings,
} from '../services/settings-store';
import type { SpeechToTextService } from '../services/speech-to-text';

type SettingsHandlerDeps = {
  dbService: DatabaseService;
  getCurrentUserId: () => string | null;
  speechService: SpeechToTextService;
  hotkeyManager: GlobalHotkeyManager;
  bubbleManager: BubbleWindowManager;
};

const WHISPER_MODEL_EXTENSIONS = new Set(['.bin', '.ggml', '.gguf']);
const MAX_DISCOVERED_MODELS = 12;
const MAX_SCAN_DEPTH = 2;

function isSupportedWhisperModelPath(filePath: string): boolean {
  return WHISPER_MODEL_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function validateWhisperModelPath(modelPath: string): Promise<string | null> {
  const trimmedPath = modelPath.trim();
  if (!trimmedPath) {
    return null;
  }

  if (!path.isAbsolute(trimmedPath)) {
    return 'Whisper model path must be an absolute file path.';
  }

  if (!isSupportedWhisperModelPath(trimmedPath)) {
    return 'That file does not look like a Whisper model. Choose a .bin, .ggml, or .gguf file.';
  }

  try {
    const stats = await fs.stat(trimmedPath);
    if (!stats.isFile()) {
      return 'The selected Whisper model path is not a file.';
    }
  } catch {
    return 'The selected Whisper model file was not found.';
  }

  return null;
}

async function collectWhisperModelsFromDirectory(
  directoryPath: string,
  source: string,
  maxDepth: number,
  results: WhisperModelCandidate[],
  seenPaths: Set<string>
): Promise<void> {
  if (results.length >= MAX_DISCOVERED_MODELS) {
    return;
  }

  let entries;
  try {
    entries = await fs.readdir(directoryPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (results.length >= MAX_DISCOVERED_MODELS) {
      return;
    }

    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isFile()) {
      if (!isSupportedWhisperModelPath(entryPath) || seenPaths.has(entryPath)) {
        continue;
      }

      seenPaths.add(entryPath);
      results.push({
        path: entryPath,
        fileName: path.basename(entryPath),
        source,
      });
      continue;
    }

    if (!entry.isDirectory() || maxDepth <= 0) {
      continue;
    }

    if (entry.name === 'node_modules') {
      continue;
    }

    await collectWhisperModelsFromDirectory(entryPath, source, maxDepth - 1, results, seenPaths);
  }
}

async function findWhisperModelCandidates(): Promise<WhisperModelCandidate[]> {
  const homeDir = app.getPath('home');
  const roots = [
    { path: app.getPath('downloads'), source: 'Downloads' },
    { path: path.join(homeDir, 'Models'), source: 'Home Models' },
    { path: path.join(homeDir, 'models'), source: 'Home models' },
    { path: path.join(homeDir, '.cache', 'whisper.cpp'), source: 'whisper.cpp cache' },
    { path: path.join(homeDir, '.cache', 'whisper'), source: 'whisper cache' },
    {
      path: path.join(homeDir, 'Library', 'Application Support', 'whisper.cpp'),
      source: 'Application Support whisper.cpp',
    },
  ];

  const results: WhisperModelCandidate[] = [];
  const seenPaths = new Set<string>();

  for (const root of roots) {
    await collectWhisperModelsFromDirectory(
      root.path,
      root.source,
      MAX_SCAN_DEPTH,
      results,
      seenPaths
    );
  }

  return results.sort((left, right) => left.fileName.localeCompare(right.fileName));
}

function applySpeechRuntimeSettings(
  speechService: SpeechToTextService,
  settings: AppMachineSettings
) {
  speechService.updateMachineSettings({
    whisperCommand: settings.whisperCommand,
    whisperModelPath: settings.whisperModelPath,
    sourceLanguage: settings.sourceLanguage,
  });
}

function normalizeMicrophonePermissionStatus(status: string): MicrophonePermissionStatus {
  if (
    status === 'granted' ||
    status === 'denied' ||
    status === 'restricted' ||
    status === 'not-determined'
  ) {
    return status;
  }
  return 'unknown';
}

async function getSttReadinessStatus(): Promise<SttReadinessStatus> {
  const settings = getMachineSettings();
  const platform = process.platform;

  const microphonePermission =
    platform === 'darwin'
      ? normalizeMicrophonePermissionStatus(systemPreferences.getMediaAccessStatus('microphone'))
      : 'unknown';

  const whisperCommandConfigured = Boolean(settings.whisperCommand.trim());
  let whisperCommandReachable = whisperCommandConfigured;

  const whisperCommand = settings.whisperCommand.trim();
  if (whisperCommandConfigured && path.isAbsolute(whisperCommand)) {
    try {
      await fs.access(whisperCommand, fsConstants.X_OK);
      whisperCommandReachable = true;
    } catch {
      whisperCommandReachable = false;
    }
  }

  const whisperModelPath = settings.whisperModelPath.trim();
  const whisperModelConfigured = Boolean(whisperModelPath);
  let whisperModelReadable = false;

  if (whisperModelConfigured) {
    try {
      const stats = await fs.stat(whisperModelPath);
      if (stats.isFile()) {
        await fs.access(whisperModelPath, fsConstants.R_OK);
        whisperModelReadable = true;
      }
    } catch {
      whisperModelReadable = false;
    }
  }

  const accessibilityGranted: boolean | null =
    platform === 'darwin' ? systemPreferences.isTrustedAccessibilityClient(false) : null;

  const issues: string[] = [];

  if (platform === 'darwin' && microphonePermission !== 'granted') {
    issues.push(
      'Microphone access is not granted. Enable it in System Settings > Privacy & Security > Microphone.'
    );
  }

  if (platform === 'darwin' && accessibilityGranted === false) {
    issues.push(
      'Accessibility access is not granted. This is required to paste transcribed text into VS Code. Enable it in System Settings > Privacy & Security > Accessibility.'
    );
  }

  if (!whisperCommandConfigured) {
    issues.push('Whisper command is empty. Configure whisper-cli in Local Runtime Settings.');
  } else if (!whisperCommandReachable) {
    issues.push('Configured Whisper command path is not executable or cannot be accessed.');
  }

  if (!whisperModelConfigured) {
    issues.push('Whisper model file is not selected. Choose a local model (.bin/.ggml/.gguf).');
  } else if (!whisperModelReadable) {
    issues.push('Selected Whisper model file cannot be read. Check folder/file permissions.');
  }

  return {
    isReady: issues.length === 0,
    platform,
    microphonePermission,
    accessibilityGranted,
    whisperCommandConfigured,
    whisperCommandReachable,
    whisperModelConfigured,
    whisperModelReadable,
    issues,
    checkedAt: Date.now(),
  };
}

export function registerSettingsIpcHandlers({
  dbService,
  getCurrentUserId,
  speechService,
  hotkeyManager,
  bubbleManager,
}: SettingsHandlerDeps): void {
  ipcMain.handle('get-machine-settings', async () => {
    return getMachineSettings();
  });

  ipcMain.handle('get-llm-settings', async () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      return DEFAULT_LLM_SETTINGS;
    }

    return dbService.getUserLlmSettings(currentUserId);
  });

  ipcMain.handle('get-ollama-models', async (_event, baseUrl?: string) => {
    const currentUserId = getCurrentUserId();
    const fallbackBaseUrl = currentUserId
      ? (await dbService.getUserLlmSettings(currentUserId)).ollamaBaseUrl
      : DEFAULT_LLM_SETTINGS.ollamaBaseUrl;
    const url = typeof baseUrl === 'string' && baseUrl.trim() ? baseUrl : fallbackBaseUrl;
    return getOllamaModelNames(url);
  });

  ipcMain.handle(
    'download-ollama-model',
    async (_event, payload: { baseUrl?: string; model?: string }) => {
      const currentUserId = getCurrentUserId();
      const fallbackBaseUrl = currentUserId
        ? (await dbService.getUserLlmSettings(currentUserId)).ollamaBaseUrl
        : DEFAULT_LLM_SETTINGS.ollamaBaseUrl;
      const baseUrl =
        typeof payload?.baseUrl === 'string' && payload.baseUrl.trim()
          ? payload.baseUrl.trim()
          : fallbackBaseUrl;
      const model = payload?.model?.trim() || '';

      if (!model) {
        const result: OllamaModelDownloadResult = {
          success: false,
          message: 'Model name is required.',
        };
        return result;
      }

      try {
        await downloadOllamaModel(baseUrl, model);
        const result: OllamaModelDownloadResult = {
          success: true,
          message: `Model ${model} downloaded successfully.`,
        };
        return result;
      } catch (error) {
        const result: OllamaModelDownloadResult = {
          success: false,
          message: (error as Error).message || `Failed to download model ${model}.`,
        };
        return result;
      }
    }
  );

  ipcMain.handle('pick-whisper-model-path', async () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const dialogOptions: OpenDialogOptions = {
      title: 'Select Whisper model file',
      properties: ['openFile'],
      filters: [
        {
          name: 'Whisper model files',
          extensions: ['bin', 'gguf', 'ggml'],
        },
        {
          name: 'All files',
          extensions: ['*'],
        },
      ],
    };
    const result = focusedWindow
      ? await dialog.showOpenDialog(focusedWindow, dialogOptions)
      : await dialog.showOpenDialog(dialogOptions);

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const selectedPath = result.filePaths[0] ?? null;
    if (!selectedPath) {
      return null;
    }

    const validationError = await validateWhisperModelPath(selectedPath);
    if (validationError) {
      throw new Error(validationError);
    }

    return selectedPath;
  });

  ipcMain.handle('find-whisper-model-paths', async () => {
    return findWhisperModelCandidates();
  });

  ipcMain.handle('get-stt-readiness', async () => {
    return getSttReadinessStatus();
  });

  ipcMain.handle('request-microphone-permission', async () => {
    if (process.platform !== 'darwin') {
      const result: PermissionActionResult = {
        success: false,
        message: 'Microphone permission request shortcut is currently supported on macOS only.',
        status: 'unknown',
      };
      return result;
    }

    const currentStatus = normalizeMicrophonePermissionStatus(
      systemPreferences.getMediaAccessStatus('microphone')
    );
    if (currentStatus === 'granted') {
      const result: PermissionActionResult = {
        success: true,
        message: 'Microphone access is already granted.',
        status: currentStatus,
      };
      return result;
    }

    const granted = await systemPreferences.askForMediaAccess('microphone');
    const nextStatus = normalizeMicrophonePermissionStatus(
      systemPreferences.getMediaAccessStatus('microphone')
    );

    const result: PermissionActionResult = {
      success: granted,
      message: granted
        ? 'Microphone access granted.'
        : 'Microphone access was not granted. Enable it in System Settings > Privacy & Security > Microphone.',
      status: nextStatus,
    };
    return result;
  });

  ipcMain.handle('open-accessibility-settings', async () => {
    if (process.platform !== 'darwin') {
      return { success: false, message: 'Only supported on macOS.' };
    }
    try {
      // Prompt the user with the native Accessibility permission dialog
      const trusted = systemPreferences.isTrustedAccessibilityClient(true);
      if (trusted) {
        return {
          success: true,
          message: 'Accessibility access is already granted.',
        };
      }
      await shell.openExternal(
        'x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility'
      );
      return {
        success: true,
        message: 'Opened System Settings > Privacy & Security > Accessibility.',
      };
    } catch {
      return { success: false, message: 'Could not open System Settings automatically.' };
    }
  });

  ipcMain.handle('open-microphone-privacy-settings', async () => {
    if (process.platform !== 'darwin') {
      const result: PermissionActionResult = {
        success: false,
        message: 'Opening Privacy > Microphone shortcut is currently supported on macOS only.',
        status: 'unknown',
      };
      return result;
    }

    try {
      await shell.openExternal(
        'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone'
      );

      const result: PermissionActionResult = {
        success: true,
        message: 'Opened System Settings > Privacy & Security > Microphone.',
        status: normalizeMicrophonePermissionStatus(
          systemPreferences.getMediaAccessStatus('microphone')
        ),
      };
      return result;
    } catch {
      const result: PermissionActionResult = {
        success: false,
        message:
          'Could not open System Settings automatically. Open it manually and allow microphone access.',
        status: normalizeMicrophonePermissionStatus(
          systemPreferences.getMediaAccessStatus('microphone')
        ),
      };
      return result;
    }
  });

  ipcMain.handle('open-whisper-install-guide', async () => {
    try {
      await shell.openExternal('https://formulae.brew.sh/formula/whisper-cpp');
      return { success: true, message: 'Opened Whisper install guide in your browser.' };
    } catch {
      return { success: false, message: 'Could not open Whisper install guide automatically.' };
    }
  });

  ipcMain.handle('open-whisper-models-page', async () => {
    try {
      await shell.openExternal('https://huggingface.co/ggerganov/whisper.cpp/tree/main');
      return { success: true, message: 'Opened Whisper models page in your browser.' };
    } catch {
      return { success: false, message: 'Could not open Whisper models page automatically.' };
    }
  });

  ipcMain.handle(
    'update-machine-settings',
    async (_event, updates: Partial<AppMachineSettings>) => {
      const current = getMachineSettings();
      const next = normalizeMachineSettingsUpdate(current, updates);

      if (!next.globalDictationHotkey) {
        const result: UpdateMachineSettingsResult = {
          success: false,
          message: 'Hotkey cannot be empty.',
          settings: current,
        };
        return result;
      }

      if (!next.defaultDictationLanguage) {
        const result: UpdateMachineSettingsResult = {
          success: false,
          message: 'Default dictation language cannot be empty.',
          settings: current,
        };
        return result;
      }

      const whisperModelPathError = await validateWhisperModelPath(next.whisperModelPath);
      if (whisperModelPathError) {
        const result: UpdateMachineSettingsResult = {
          success: false,
          message: whisperModelPathError,
          settings: current,
        };
        return result;
      }

      const previousHotkey = hotkeyManager.getActiveHotkey();
      if (next.globalDictationHotkey !== previousHotkey) {
        const registered = hotkeyManager.register(next.globalDictationHotkey);
        if (!registered) {
          if (previousHotkey) {
            hotkeyManager.register(previousHotkey);
          }

          const result: UpdateMachineSettingsResult = {
            success: false,
            message: `Could not register hotkey: ${next.globalDictationHotkey}`,
            settings: current,
          };
          return result;
        }
      }

      saveMachineSettings(next);
      applySpeechRuntimeSettings(speechService, next);

      // Handle bubble enable/disable toggle
      if (next.bubbleEnabled !== current.bubbleEnabled) {
        if (next.bubbleEnabled) {
          bubbleManager.init();
        } else {
          bubbleManager.destroy();
        }
      }

      const result: UpdateMachineSettingsResult = {
        success: true,
        message: 'Machine settings saved.',
        settings: getMachineSettings(),
      };
      return result;
    }
  );

  ipcMain.handle('update-llm-settings', async (_event, updates: AppLlmSettings) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      const result: UpdateLlmSettingsResult = {
        success: false,
        message: 'You must be logged in to update LLM settings.',
        settings: DEFAULT_LLM_SETTINGS,
      };
      return result;
    }

    const nextSettings: AppLlmSettings = {
      ollamaBaseUrl: updates.ollamaBaseUrl.trim() || DEFAULT_LLM_SETTINGS.ollamaBaseUrl,
      ollamaModel: updates.ollamaModel.trim() || DEFAULT_LLM_SETTINGS.ollamaModel,
      ollamaTranslationModel:
        updates.ollamaTranslationModel.trim() || DEFAULT_LLM_SETTINGS.ollamaTranslationModel,
      ollamaPrompt: updates.ollamaPrompt,
    };

    const saved = await dbService.updateUserLlmSettings(currentUserId, nextSettings);
    speechService.updateLlmSettings(saved);

    const result: UpdateLlmSettingsResult = {
      success: true,
      message: 'LLM settings saved.',
      settings: saved,
    };
    return result;
  });

  ipcMain.handle('reset-machine-settings', async () => {
    const resetSettings = resetMachineSettings();

    const registered = hotkeyManager.register(DEFAULT_MACHINE_SETTINGS.globalDictationHotkey);
    if (!registered) {
      const activeHotkey = hotkeyManager.getActiveHotkey();
      if (activeHotkey) {
        hotkeyManager.register(activeHotkey);
      }
    }

    applySpeechRuntimeSettings(speechService, resetSettings);

    const result: UpdateMachineSettingsResult = {
      success: true,
      message: 'Machine settings reset to defaults.',
      settings: getMachineSettings(),
    };
    return result;
  });

  ipcMain.handle('reset-llm-settings', async () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      const result: UpdateLlmSettingsResult = {
        success: false,
        message: 'You must be logged in to reset LLM settings.',
        settings: DEFAULT_LLM_SETTINGS,
      };
      return result;
    }

    const resetSettings = await dbService.updateUserLlmSettings(
      currentUserId,
      DEFAULT_LLM_SETTINGS
    );
    speechService.updateLlmSettings(resetSettings);

    const result: UpdateLlmSettingsResult = {
      success: true,
      message: 'LLM settings reset to defaults.',
      settings: resetSettings,
    };
    return result;
  });
}
