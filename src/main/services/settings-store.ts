import Store from 'electron-store';
import {
  APP_STORE_CWD,
  DEFAULT_LLM_SETTINGS,
  DEFAULT_MACHINE_SETTINGS,
} from '../../shared/constants';
import type { AppMachineSettings } from '../../shared/types';

export { DEFAULT_LLM_SETTINGS, DEFAULT_MACHINE_SETTINGS };

const settingsStore = new Store<AppMachineSettings>({
  name: 'settings',
  cwd: APP_STORE_CWD,
  defaults: DEFAULT_MACHINE_SETTINGS,
});

export function getMachineSettings(): AppMachineSettings {
  return {
    globalDictationHotkey: settingsStore.get('globalDictationHotkey'),
    defaultDictationLanguage: settingsStore.get('defaultDictationLanguage'),
    sourceLanguage: settingsStore.get('sourceLanguage'),
    whisperCommand: settingsStore.get('whisperCommand'),
    whisperModelPath: settingsStore.get('whisperModelPath'),
    bubbleEnabled: settingsStore.get('bubbleEnabled'),
    autoPasteEnabled: settingsStore.get('autoPasteEnabled'),
  };
}

export function normalizeMachineSettingsUpdate(
  current: AppMachineSettings,
  updates: Partial<AppMachineSettings>
): AppMachineSettings {
  return {
    ...current,
    ...updates,
    globalDictationHotkey:
      typeof updates.globalDictationHotkey === 'string'
        ? updates.globalDictationHotkey.trim()
        : current.globalDictationHotkey,
    defaultDictationLanguage:
      typeof updates.defaultDictationLanguage === 'string'
        ? updates.defaultDictationLanguage.trim()
        : current.defaultDictationLanguage,
    sourceLanguage:
      typeof updates.sourceLanguage === 'string'
        ? updates.sourceLanguage.trim()
        : current.sourceLanguage,
    whisperCommand:
      typeof updates.whisperCommand === 'string'
        ? updates.whisperCommand.trim()
        : current.whisperCommand,
    whisperModelPath:
      typeof updates.whisperModelPath === 'string'
        ? updates.whisperModelPath.trim()
        : current.whisperModelPath,
    bubbleEnabled:
      typeof updates.bubbleEnabled === 'boolean'
        ? updates.bubbleEnabled
        : (current.bubbleEnabled ?? true),
    autoPasteEnabled:
      typeof updates.autoPasteEnabled === 'boolean'
        ? updates.autoPasteEnabled
        : (current.autoPasteEnabled ?? true),
  };
}

export function saveMachineSettings(next: AppMachineSettings): void {
  settingsStore.set(next);
}

export function resetMachineSettings(): AppMachineSettings {
  settingsStore.set(DEFAULT_MACHINE_SETTINGS);
  return getMachineSettings();
}
