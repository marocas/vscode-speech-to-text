// ─── App Identity ────────────────────────────────────────────────────────────

export const APP_NAME = 'Smart Transcription Daemon';
export const APP_STORE_CWD = 'smart-transcription-daemon';

// ─── Supported Languages ────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'tl-PH', name: 'Pilipinas (Philippines)' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// ─── Default Language Settings ───────────────────────────────────────────────

export const DEFAULT_DICTATION_LANGUAGE = 'pt-PT';
export const DEFAULT_SOURCE_LANGUAGE = 'pt-PT';

// ─── Default Machine Settings ────────────────────────────────────────────────

export const DEFAULT_HOTKEY = 'CommandOrControl+Shift+D';
export const DEFAULT_WHISPER_COMMAND = 'whisper-cli';

// ─── Default LLM Settings ────────────────────────────────────────────────────

export const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
export const DEFAULT_OLLAMA_MODEL = 'llama3.2:latest';
export const DEFAULT_OLLAMA_TRANSLATION_MODEL = 'translategemma:4b';
export const DEFAULT_OLLAMA_PROMPT =
  'You are a helpful assistant. Format your responses clearly and concisely.';

// ─── Composite Default Settings ──────────────────────────────────────────────

import type { AppLlmSettings, AppMachineSettings } from './types';

export const DEFAULT_LLM_SETTINGS: AppLlmSettings = {
  ollamaBaseUrl: DEFAULT_OLLAMA_BASE_URL,
  ollamaModel: DEFAULT_OLLAMA_MODEL,
  ollamaTranslationModel: DEFAULT_OLLAMA_TRANSLATION_MODEL,
  ollamaPrompt: DEFAULT_OLLAMA_PROMPT,
};

export const DEFAULT_MACHINE_SETTINGS: AppMachineSettings = {
  globalDictationHotkey: DEFAULT_HOTKEY,
  defaultDictationLanguage: DEFAULT_DICTATION_LANGUAGE,
  sourceLanguage: DEFAULT_SOURCE_LANGUAGE,
  whisperCommand: DEFAULT_WHISPER_COMMAND,
  whisperModelPath: '',
  bubbleEnabled: true,
  autoPasteEnabled: true,
};

// ─── Language Utilities ──────────────────────────────────────────────────────

/** Resolve a language code to a human-readable name using SUPPORTED_LANGUAGES first, then Intl. */
export function getLanguageName(code: string): string {
  const exact = SUPPORTED_LANGUAGES.find((item) => item.code === code);
  if (exact) return exact.name;

  const base = code.split('-')[0];
  const byBase = SUPPORTED_LANGUAGES.find((item) => item.code.split('-')[0] === base);
  if (byBase) return byBase.name;

  try {
    return (
      new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ??
      new Intl.DisplayNames(['en'], { type: 'language' }).of(base) ??
      code
    );
  } catch {
    return code;
  }
}
