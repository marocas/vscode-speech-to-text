import {
  APP_STORE_CWD,
  DEFAULT_LLM_SETTINGS,
  DEFAULT_MACHINE_SETTINGS,
} from '../../shared/constants';
import type { AppMachineSettings } from '../../shared/types';
import { getStoreClass } from './esm-compat';

export { DEFAULT_LLM_SETTINGS, DEFAULT_MACHINE_SETTINGS };

let settingsStore: any = null;

export async function initSettingsStore(): Promise<void> {
  const Store = await getStoreClass();
  settingsStore = new Store({
    name: 'settings',
    cwd: APP_STORE_CWD,
    defaults: DEFAULT_MACHINE_SETTINGS,
  });
}

function getStore() {
  if (!settingsStore)
    throw new Error('Settings store not initialized. Call initSettingsStore() first.');
  return settingsStore;
}

export function getMachineSettings(): AppMachineSettings {
  const store = getStore();
  return {
    globalDictationHotkey: store.get('globalDictationHotkey'),
    defaultDictationLanguage: store.get('defaultDictationLanguage'),
    sourceLanguage: store.get('sourceLanguage'),
    whisperCommand: store.get('whisperCommand'),
    whisperModelPath: store.get('whisperModelPath'),
    whisperModelsDir: store.get('whisperModelsDir'),
    bubbleEnabled: store.get('bubbleEnabled'),
    autoPasteEnabled: store.get('autoPasteEnabled'),
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
    whisperModelsDir:
      typeof updates.whisperModelsDir === 'string'
        ? updates.whisperModelsDir.trim()
        : current.whisperModelsDir,
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
  getStore().set(next);
}

export function resetMachineSettings(): AppMachineSettings {
  getStore().set(DEFAULT_MACHINE_SETTINGS);
  return getMachineSettings();
}
