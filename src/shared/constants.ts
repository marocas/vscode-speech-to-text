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
  whisperModelsDir: '',
  bubbleEnabled: true,
  autoPasteEnabled: true,
};

// ─── Cancelled Dictation ─────────────────────────────────────────────────────

export const CANCELLED_PREFIX = '[CANCELLED] ';

// ─── App Detection ───────────────────────────────────────────────────────────

/** Maps known macOS bundle IDs to friendly display names. */
export const APP_LABELS: Record<string, string> = {
  'com.microsoft.VSCode': 'VS Code',
  'com.microsoft.VSCodeInsiders': 'VS Code Insiders',
  'com.apple.Terminal': 'Terminal',
  'com.googlecode.iterm2': 'iTerm2',
  'com.tinyspeck.slackmacgap': 'Slack',
  'com.apple.mail': 'Mail',
  'com.apple.Safari': 'Safari',
  'com.google.Chrome': 'Chrome',
  'com.microsoft.edgemac': 'Edge',
  'company.thebrowser.Browser': 'Arc',
  'com.brave.Browser': 'Brave',
  'com.apple.Notes': 'Notes',
  'com.apple.Pages': 'Pages',
  'com.microsoft.Word': 'Word',
  'com.microsoft.Outlook': 'Outlook',
  'com.microsoft.teams2': 'Teams',
  'com.jetbrains.intellij': 'IntelliJ',
  'com.sublimetext.4': 'Sublime Text',
  'dev.warp.Warp-Stable': 'Warp',
  'net.kovidgoyal.kitty': 'Kitty',
  'com.github.atom': 'Atom',
};

/** Patterns to detect web-app context from browser tab URLs. */
export const URL_CONTEXT: { pattern: RegExp; label: string }[] = [
  { pattern: /mail\.google\.com/, label: 'Gmail' },
  { pattern: /outlook\.(live|office)\.com/, label: 'Outlook' },
  { pattern: /slack\.com/, label: 'Slack' },
  { pattern: /teams\.microsoft\.com/, label: 'Teams' },
  { pattern: /github\.com/, label: 'GitHub' },
  { pattern: /docs\.google\.com\/document/, label: 'Google Docs' },
  { pattern: /docs\.google\.com\/spreadsheets/, label: 'Google Sheets' },
  { pattern: /notion\.so/, label: 'Notion' },
  { pattern: /chat\.openai\.com|chatgpt\.com/, label: 'ChatGPT' },
  { pattern: /claude\.ai/, label: 'Claude' },
  { pattern: /linear\.app/, label: 'Linear' },
  { pattern: /jira\.atlassian/, label: 'Jira' },
  { pattern: /figma\.com/, label: 'Figma' },
];

/** Resolve a detected app to a user-friendly label, checking URL context first for browsers. */
export function resolveSourceAppLabel(info: {
  appName: string;
  bundleId: string;
  url?: string;
}): string {
  if (info.url) {
    for (const { pattern, label } of URL_CONTEXT) {
      if (pattern.test(info.url)) return label;
    }
  }
  return APP_LABELS[info.bundleId] || info.appName;
}

// ─── AppleScript Browser URL Detection ───────────────────────────────────────

export const APPLESCRIPT_TIMEOUT_MS = 2000;

/** AppleScript commands to retrieve the active tab URL for each supported browser. */
export const BROWSER_URL_SCRIPTS: Record<string, string> = {
  'Google Chrome': 'tell application "Google Chrome" to return URL of active tab of front window',
  'Microsoft Edge': 'tell application "Microsoft Edge" to return URL of active tab of front window',
  'Brave Browser': 'tell application "Brave Browser" to return URL of active tab of front window',
  Safari: 'tell application "Safari" to return URL of front document',
  Arc: `tell application "Arc"
    set theURL to URL of active tab of front window
    return theURL
  end tell`,
};

/** Maps browser bundle IDs to the app name keys used in BROWSER_URL_SCRIPTS. */
export const BROWSER_BUNDLE_TO_NAME: Record<string, string> = {
  'com.google.Chrome': 'Google Chrome',
  'com.microsoft.edgemac': 'Microsoft Edge',
  'com.apple.Safari': 'Safari',
  'company.thebrowser.Browser': 'Arc',
  'com.brave.Browser': 'Brave Browser',
};

// ─── Audio Detection ─────────────────────────────────────────────────────────

/** RMS threshold below which audio is considered silence (tuned for built-in mics). */
export const SILENCE_THRESHOLD = 0.005;

/** Abort recording if no sound detected within this duration (ms). */
export const INITIAL_SILENCE_MS = 2500;

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
