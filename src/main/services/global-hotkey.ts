import type { UiohookKeyboardEvent } from 'uiohook-napi';

/** Extended keyboard event — uiohook-napi may include fnKey on some platforms. */
interface NativeKeyEvent extends UiohookKeyboardEvent {
  fnKey?: boolean;
}

type UiohookInstance = typeof import('uiohook-napi').uIOhook;

let uIOhook: UiohookInstance | null = null;
let uIOhookKeys: Record<string, number> = {};

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const uiohookModule = require('uiohook-napi');
  uIOhook = uiohookModule.uIOhook;

  const enumValues = uiohookModule.UiohookKey ?? {};
  for (const [name, value] of Object.entries(enumValues)) {
    if (/^\d+$/.test(name)) {
      continue;
    }
    if (typeof value !== 'number') {
      continue;
    }

    uIOhookKeys[name.toLowerCase()] = value;
  }
} catch (err) {
  console.warn('uiohook-napi not available, falling back to globalShortcut', err);
}

import { globalShortcut } from 'electron';

export class GlobalHotkeyManager {
  private activeHotkey: string;
  private hotkeyKeyDown = false;
  private pressedKeyCodes = new Set<number>();
  private fallbackReleaseTimer: NodeJS.Timeout | null = null;
  private useNativeHooks: boolean = !!uIOhook;
  private isListening = false;

  constructor(
    initialHotkey: string,
    private readonly onTrigger: (type: 'pressed' | 'released') => void
  ) {
    this.activeHotkey = initialHotkey;
  }

  private isModifierPart(part: string): boolean {
    return (
      part === 'ctrl' ||
      part === 'control' ||
      part === 'commandorcontrol' ||
      part === 'cmd' ||
      part === 'meta' ||
      part === 'super' ||
      part === 'shift' ||
      part === 'alt' ||
      part === 'option' ||
      part === 'fn'
    );
  }

  private matchesNativeEvent(event: NativeKeyEvent): boolean {
    const hotkeyParts = this.activeHotkey
      .toLowerCase()
      .split('+')
      .map((part) => part.trim());

    const wantsCtrl = hotkeyParts.some((p) => p === 'ctrl' || p === 'control');
    const wantsMeta = hotkeyParts.some((p) => p === 'cmd' || p === 'meta' || p === 'super');
    const wantsCommandOrControl = hotkeyParts.includes('commandorcontrol');
    const wantsShift = hotkeyParts.includes('shift');
    const wantsAlt = hotkeyParts.some((p) => p === 'alt' || p === 'option');
    const wantsFn = hotkeyParts.includes('fn');

    // Special case: hotkey is ONLY 'fn' key
    if (hotkeyParts.length === 1 && wantsFn) {
      return Boolean(event.fnKey);
    }

    if (wantsCommandOrControl) {
      if (!(event.ctrlKey || event.metaKey)) return false;
    } else {
      if (wantsCtrl && !event.ctrlKey) return false;
      if (wantsMeta && !event.metaKey) return false;
      if (!wantsCtrl && event.ctrlKey) return false;
      if (!wantsMeta && event.metaKey) return false;
    }
    if (wantsShift !== Boolean(event.shiftKey)) return false;
    if (wantsAlt !== Boolean(event.altKey)) return false;
    if (wantsFn !== Boolean(event.fnKey)) return false;

    const nonModifierParts = hotkeyParts.filter((part) => !this.isModifierPart(part));

    // Disallow modifier-only combinations (except fn-only), which are too broad and easy to trigger.
    if (nonModifierParts.length === 0) {
      return hotkeyParts.length === 1 && wantsFn;
    }

    const expectedKeyCodes: number[] = [];
    for (const part of nonModifierParts) {
      const keyCode = this.resolveNativeKeyCode(part);
      if (keyCode !== null) expectedKeyCodes.push(keyCode);
    }

    // If a non-modifier key is configured but none can be resolved, do not match
    if (nonModifierParts.length > 0 && expectedKeyCodes.length === 0) {
      return false;
    }

    const isKeyMatch = expectedKeyCodes.some((keyCode) => this.pressedKeyCodes.has(keyCode));
    return isKeyMatch;
  }

  private resolveNativeKeyCode(acceleratorPart: string): number | null {
    // No hardcoded aliases - use all available keys from uIOhookKeys
    const normalized = acceleratorPart.trim().toLowerCase();
    const keyCode = uIOhookKeys[normalized];
    return typeof keyCode === 'number' ? keyCode : null;
  }

  private initNativeHooks(): void {
    if (!uIOhook || this.isListening || !this.useNativeHooks) {
      return;
    }

    try {
      uIOhook.on('keydown', (event: NativeKeyEvent) => {
        if (typeof event.keycode === 'number') {
          this.pressedKeyCodes.add(event.keycode);
        }

        const isMatch = this.matchesNativeEvent(event);

        if (isMatch && !this.hotkeyKeyDown) {
          this.hotkeyKeyDown = true;
          this.onTrigger('pressed');
        }
      });

      uIOhook.on('keyup', (event: NativeKeyEvent) => {
        if (typeof event.keycode === 'number') {
          this.pressedKeyCodes.delete(event.keycode);
        }

        const isMatch = this.matchesNativeEvent(event);
        if (!isMatch && this.hotkeyKeyDown) {
          this.hotkeyKeyDown = false;
          this.onTrigger('released');
        }
      });

      uIOhook.start();
      this.isListening = true;
      console.log('Native key hooks initialized');
    } catch (err) {
      console.error('Failed to initialize native hooks:', err);
      this.useNativeHooks = false;
    }
  }

  getActiveHotkey(): string {
    return this.activeHotkey;
  }

  register(hotkey: string): boolean {
    const normalizedHotkey = hotkey.trim();
    if (!normalizedHotkey) {
      return false;
    }

    const previousHotkey = this.activeHotkey;
    this.activeHotkey = normalizedHotkey;
    this.hotkeyKeyDown = false;
    this.pressedKeyCodes.clear();

    // Tentar usar native hooks primeiro
    if (this.useNativeHooks) {
      this.initNativeHooks();
      return true;
    }

    // Fallback para globalShortcut
    if (previousHotkey && globalShortcut.isRegistered(previousHotkey)) {
      globalShortcut.unregister(previousHotkey);
    }
    if (globalShortcut.isRegistered(normalizedHotkey)) {
      globalShortcut.unregister(normalizedHotkey);
    }

    const registered = globalShortcut.register(normalizedHotkey, () => {
      if (!this.hotkeyKeyDown) {
        this.hotkeyKeyDown = true;
        this.onTrigger('pressed');

        if (this.fallbackReleaseTimer) {
          clearTimeout(this.fallbackReleaseTimer);
        }

        // globalShortcut has no keyup event. Simulate a short hold so recording never gets stuck.
        this.fallbackReleaseTimer = setTimeout(() => {
          if (this.hotkeyKeyDown) {
            this.hotkeyKeyDown = false;
            this.onTrigger('released');
          }
        }, 220);
      }
    });

    if (!registered) {
      console.error(`Failed to register hotkey: ${normalizedHotkey}`);
      return false;
    }

    return true;
  }

  unregisterAll(): void {
    if (this.fallbackReleaseTimer) {
      clearTimeout(this.fallbackReleaseTimer);
      this.fallbackReleaseTimer = null;
    }
    try {
      globalShortcut.unregisterAll();
    } catch (err) {
      console.error('Failed to unregister shortcuts:', err);
    }
    try {
      if (uIOhook) {
        uIOhook.stop();
      }
    } catch (err) {
      console.error('Failed to stop native hooks:', err);
    }
    this.isListening = false;
    this.hotkeyKeyDown = false;
    this.pressedKeyCodes.clear();
  }
}
