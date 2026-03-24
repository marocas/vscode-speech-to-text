import { contextBridge, ipcRenderer } from 'electron';
import type {
  AppLlmSettings,
  AppMachineSettings,
  AuthActionResult,
  DictationHistoryEntry,
  DictationRequest,
  LoginResult,
  NotificationResult,
  NotificationsListResult,
  OllamaModelDownloadResult,
  PermissionActionResult,
  SttReadinessStatus,
  UpdateLlmSettingsResult,
  UpdateMachineSettingsResult,
  WhisperModelCandidate,
} from '../shared/types';

const api = {
  // Dictation APIs
  startDictation: (options: DictationRequest) => ipcRenderer.invoke('start-dictation', options),
  stopDictation: () => ipcRenderer.invoke('stop-dictation'),
  saveDictation: (text: string): Promise<DictationHistoryEntry | null> =>
    ipcRenderer.invoke('save-dictation', text),
  processDictationText: (
    text: string,
    targetLanguage?: string,
    sourceLanguage?: string
  ): Promise<{ text: string; confidence: number; isFinal: boolean }> =>
    ipcRenderer.invoke('process-dictation-text', { text, targetLanguage, sourceLanguage }),
  onGlobalDictationHotkey: (callback: () => void): (() => void) => {
    const listener = () => callback();
    ipcRenderer.on('global-dictation-hotkey', listener);
    return () => ipcRenderer.removeListener('global-dictation-hotkey', listener);
  },
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
  transcribeAudio: (audioBuffer: ArrayBuffer, language: string): Promise<string> =>
    ipcRenderer.invoke('transcribe-audio', { audioBuffer, language }),
  getDictations: (limit = 50): Promise<DictationHistoryEntry[]> =>
    ipcRenderer.invoke('get-dictations', limit),
  deleteDictation: (id: string): Promise<boolean> => ipcRenderer.invoke('delete-dictation', id),
  clearDictationHistory: (): Promise<number> => ipcRenderer.invoke('clear-dictation-history'),
  sendToVSCode: (text: string): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('send-to-vscode', text),
  getMachineSettings: (): Promise<AppMachineSettings> => ipcRenderer.invoke('get-machine-settings'),
  getLlmSettings: (): Promise<AppLlmSettings> => ipcRenderer.invoke('get-llm-settings'),
  getOllamaModels: (baseUrl?: string): Promise<string[]> =>
    ipcRenderer.invoke('get-ollama-models', baseUrl),
  downloadOllamaModel: (model: string, baseUrl?: string): Promise<OllamaModelDownloadResult> =>
    ipcRenderer.invoke('download-ollama-model', { model, baseUrl }),
  pickWhisperModelPath: (): Promise<string | null> => ipcRenderer.invoke('pick-whisper-model-path'),
  findWhisperModelPaths: (): Promise<WhisperModelCandidate[]> =>
    ipcRenderer.invoke('find-whisper-model-paths'),
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

  // Bubble state
  setBubbleState: (state: 'idle' | 'recording' | 'processing') =>
    ipcRenderer.invoke('set-bubble-state', state),

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
