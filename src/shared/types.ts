// Types for IPC communication between main and renderer
export interface DictationRequest {
  targetLanguage: string;
  timeout?: number;
}

export interface DictationResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface DictationHistoryEntry {
  id: string;
  text: string;
  language: string;
  charCount: number;
  createdAt: Date;
}

export interface SnippetEntry {
  id: string;
  trigger: string;
  replacement: string;
  category: string;
  createdAt: Date;
}

export interface DictionaryEntry {
  word: string;
  frequency: number;
  category: string; // 'dev-terms', 'custom', 'acronym'
  addedAt: Date;
}

export interface AppContext {
  windowTitle: string;
  appName: string;
}

export interface TranscriptionSettings {
  language: string;
  enableDeveloperMode: boolean;
  enableAutoCapture: boolean;
  autoCaptureTimeout: number;
}

export interface AppMachineSettings {
  globalDictationHotkey: string;
  defaultDictationLanguage: string;
  sourceLanguage: string;
  whisperCommand: string;
  whisperModelPath: string;
  bubbleEnabled: boolean;
  autoPasteEnabled: boolean;
}

export interface AppLlmSettings {
  ollamaBaseUrl: string;
  ollamaModel: string;
  ollamaTranslationModel: string;
  ollamaPrompt: string;
}

export interface UpdateMachineSettingsResult {
  success: boolean;
  message: string;
  settings: AppMachineSettings;
}

export interface UpdateLlmSettingsResult {
  success: boolean;
  message: string;
  settings: AppLlmSettings;
}

export interface OllamaModelDownloadResult {
  success: boolean;
  message: string;
}

export interface WhisperModelCandidate {
  path: string;
  fileName: string;
  source: string;
}

export type MicrophonePermissionStatus =
  | 'granted'
  | 'denied'
  | 'restricted'
  | 'not-determined'
  | 'unknown';

export interface SttReadinessStatus {
  isReady: boolean;
  platform: NodeJS.Platform;
  microphonePermission: MicrophonePermissionStatus;
  accessibilityGranted: boolean | null;
  whisperCommandConfigured: boolean;
  whisperCommandReachable: boolean;
  whisperModelConfigured: boolean;
  whisperModelReadable: boolean;
  issues: string[];
  checkedAt: number;
}

export interface PermissionActionResult {
  success: boolean;
  message: string;
  status: MicrophonePermissionStatus;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export interface AuthActionResult {
  success: boolean;
  message: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  isRead: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface NotificationResult {
  success: boolean;
  message: string;
  notification?: Notification;
}

export interface NotificationsListResult {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
}
