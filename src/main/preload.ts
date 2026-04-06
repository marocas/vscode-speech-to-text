import { contextBridge, ipcRenderer } from 'electron';
import type {
  AppLlmSettings,
  AppMachineSettings,
  AuthActionResult,
  DictationHistoryEntry,
  LoginResult,
  NotificationResult,
  NotificationsListResult,
  OllamaModelDownloadResult,
  PermissionActionResult,
  SttReadinessStatus,
  UpdateLlmSettingsResult,
  UpdateMachineSettingsResult,
  WhisperModelCandidate,
  WhisperModelDownloadProgress,
  WhisperModelDownloadResult,
  WhisperModelInfo,
} from '../shared/types';

const api = {
  // Dictation APIs (history & text processing — pipeline runs in native agent)
  saveDictation: (text: string, sourceApp?: string): Promise<DictationHistoryEntry | null> =>
    ipcRenderer.invoke('save-dictation', text, sourceApp),
  processDictationText: (
    text: string,
    targetLanguage?: string,
    sourceLanguage?: string
  ): Promise<{ text: string; confidence: number; isFinal: boolean }> =>
    ipcRenderer.invoke('process-dictation-text', { text, targetLanguage, sourceLanguage }),
  sendToVSCode: (text: string): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('send-to-vscode', text),
  onGlobalDictationHotkeyPressed: (callback: () => void): (() => void) => {
    const listener = () => callback();
    ipcRenderer.on('global-dictation-hotkey-pressed', listener);
    return () => ipcRenderer.removeListener('global-dictation-hotkey-pressed', listener);
  },
  onGlobalDictationHotkeyReleased: (callback: () => void): (() => void) => {
    const listener = () => callback();
    ipcRenderer.on('global-dictation-hotkey-released', listener);
    return () => ipcRenderer.removeListener('global-dictation-hotkey-released', listener);
  },
  // Native agent events
  onAgentStateChanged: (
    callback: (payload: { state: string; previousState: string }) => void
  ): (() => void) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      payload: { state: string; previousState: string }
    ) => callback(payload);
    ipcRenderer.on('agent-state-changed', listener);
    return () => ipcRenderer.removeListener('agent-state-changed', listener);
  },
  onAgentPipelineResult: (
    callback: (payload: {
      text: string;
      rawText: string;
      ollamaText?: string;
      language: string;
      sourceApp?: string;
      audioPath?: string;
    }) => void
  ): (() => void) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      payload: {
        text: string;
        rawText: string;
        ollamaText?: string;
        language: string;
        sourceApp?: string;
        audioPath?: string;
      }
    ) => callback(payload);
    ipcRenderer.on('agent-pipeline-result', listener);
    return () => ipcRenderer.removeListener('agent-pipeline-result', listener);
  },
  onAgentError: (callback: (payload: { code: string; message: string }) => void): (() => void) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      payload: { code: string; message: string }
    ) => callback(payload);
    ipcRenderer.on('agent-error', listener);
    return () => ipcRenderer.removeListener('agent-error', listener);
  },
  getDictations: (limit = 50): Promise<DictationHistoryEntry[]> =>
    ipcRenderer.invoke('get-dictations', limit),
  getAudioData: (audioPath: string): Promise<string | null> =>
    ipcRenderer.invoke('get-audio-data', audioPath),
  deleteDictation: (id: string): Promise<boolean> => ipcRenderer.invoke('delete-dictation', id),
  clearDictationHistory: (): Promise<number> => ipcRenderer.invoke('clear-dictation-history'),
  getMachineSettings: (): Promise<AppMachineSettings> => ipcRenderer.invoke('get-machine-settings'),
  getLlmSettings: (): Promise<AppLlmSettings> => ipcRenderer.invoke('get-llm-settings'),
  getOllamaModels: (baseUrl?: string): Promise<string[]> =>
    ipcRenderer.invoke('get-ollama-models', baseUrl),
  downloadOllamaModel: (model: string, baseUrl?: string): Promise<OllamaModelDownloadResult> =>
    ipcRenderer.invoke('download-ollama-model', { model, baseUrl }),
  deleteOllamaModel: (
    model: string,
    baseUrl?: string
  ): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('delete-ollama-model', { model, baseUrl }),
  pickWhisperModelPath: (): Promise<string | null> => ipcRenderer.invoke('pick-whisper-model-path'),
  pickWhisperModelsDir: (): Promise<string | null> => ipcRenderer.invoke('pick-whisper-models-dir'),
  findWhisperModelPaths: (): Promise<WhisperModelCandidate[]> =>
    ipcRenderer.invoke('find-whisper-model-paths'),
  getWhisperAvailableModels: (): Promise<(WhisperModelInfo & { downloaded: boolean })[]> =>
    ipcRenderer.invoke('get-whisper-available-models'),
  downloadWhisperModel: (fileName: string): Promise<WhisperModelDownloadResult> =>
    ipcRenderer.invoke('download-whisper-model', { fileName }),
  cancelWhisperModelDownload: (): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('cancel-whisper-model-download'),
  deleteWhisperModel: (fileName: string): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('delete-whisper-model', { fileName }),
  useWhisperModel: (
    fileName: string
  ): Promise<{ success: boolean; message: string; modelPath?: string }> =>
    ipcRenderer.invoke('use-whisper-model', { fileName }),
  onWhisperModelDownloadProgress: (
    callback: (progress: WhisperModelDownloadProgress) => void
  ): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, progress: WhisperModelDownloadProgress) =>
      callback(progress);
    ipcRenderer.on('whisper-model-download-progress', listener);
    return () => ipcRenderer.removeListener('whisper-model-download-progress', listener);
  },
  getSttReadiness: (): Promise<SttReadinessStatus> => ipcRenderer.invoke('get-stt-readiness'),
  requestMicrophonePermission: (): Promise<PermissionActionResult> =>
    ipcRenderer.invoke('request-microphone-permission'),
  openMicrophonePrivacySettings: (): Promise<PermissionActionResult> =>
    ipcRenderer.invoke('open-microphone-privacy-settings'),
  openAccessibilitySettings: (): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('open-accessibility-settings'),
  openWhisperInstallGuide: (): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('open-whisper-install-guide'),
  openWhisperModelsPage: (): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('open-whisper-models-page'),
  updateMachineSettings: (
    updates: Partial<AppMachineSettings>
  ): Promise<UpdateMachineSettingsResult> => ipcRenderer.invoke('update-machine-settings', updates),
  resetMachineSettings: (): Promise<UpdateMachineSettingsResult> =>
    ipcRenderer.invoke('reset-machine-settings'),
  updateLlmSettings: (updates: AppLlmSettings): Promise<UpdateLlmSettingsResult> =>
    ipcRenderer.invoke('update-llm-settings', updates),
  resetLlmSettings: (): Promise<UpdateLlmSettingsResult> =>
    ipcRenderer.invoke('reset-llm-settings'),
  authenticateUser: (identifier: string, password: string): Promise<LoginResult> =>
    ipcRenderer.invoke('authenticate-user', { identifier, password }),
  registerUser: (email: string, username: string, password: string): Promise<LoginResult> =>
    ipcRenderer.invoke('register-user', { email, username, password }),
  changePassword: (
    identifier: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthActionResult> =>
    ipcRenderer.invoke('change-password', { identifier, currentPassword, newPassword }),
  getCurrentUser: (): Promise<LoginResult['user'] | null> => ipcRenderer.invoke('get-current-user'),
  logoutUser: (): Promise<{ success: boolean }> => ipcRenderer.invoke('logout-user'),

  // Navigation (from tray menu)
  onNavigate: (callback: (page: string) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, page: string) => callback(page);
    ipcRenderer.on('navigate', listener);
    return () => ipcRenderer.removeListener('navigate', listener);
  },

  // Dictionary APIs
  addToDictionary: (word: string, category: string) =>
    ipcRenderer.invoke('add-to-dictionary', word, category),
  getDictionary: () => ipcRenderer.invoke('get-dictionary'),

  // Snippet APIs
  addSnippet: (trigger: string, replacement: string, category: string) =>
    ipcRenderer.invoke('add-snippet', trigger, replacement, category),
  getSnippets: () => ipcRenderer.invoke('get-snippets'),
  deleteSnippet: (id: string) => ipcRenderer.invoke('delete-snippet', id),

  // Notification APIs
  addNotification: (
    message: string,
    type?: 'error' | 'warning' | 'info' | 'success'
  ): Promise<NotificationResult> => ipcRenderer.invoke('add-notification', message, type),
  getNotifications: (): Promise<NotificationsListResult> => ipcRenderer.invoke('get-notifications'),
  getNotificationUnreadCount: (): Promise<number> =>
    ipcRenderer.invoke('get-notification-unread-count'),
  markNotificationAsRead: (notificationId: string): Promise<NotificationResult> =>
    ipcRenderer.invoke('mark-notification-as-read', notificationId),
  deleteNotification: (notificationId: string): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('delete-notification', notificationId),
  clearAllNotifications: (): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('clear-all-notifications'),
};

contextBridge.exposeInMainWorld('api', api);

declare global {
  interface Window {
    api: typeof api;
  }
}
