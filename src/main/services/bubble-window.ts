import { app, BrowserWindow, screen } from 'electron';
import fs from 'node:fs';
import path from 'path';

export type BubbleState = 'idle' | 'recording' | 'processing';

const BUBBLE_SIZE = 64;
const MARGIN = 20;

export class BubbleWindowManager {
  private window: BrowserWindow | null = null;
  private idleTimeout: ReturnType<typeof setTimeout> | null = null;
  private displayInterval: ReturnType<typeof setInterval> | null = null;
  private lastDisplayId: number | null = null;

  /** Create the bubble window (call once at startup). */
  init() {
    if (!this.window || this.window.isDestroyed()) {
      this.createWindow();
    }
    this.startDisplayTracking();
  }

  /** Show a specific state (creates window if needed). */
  show(state: BubbleState = 'recording') {
    this.cancelIdleTimeout();
    this.init();
    this.sendState(state);
  }

  /** Update the bubble's visual state. */
  setState(state: BubbleState) {
    this.sendState(state);
  }

  /** Return to idle after an optional delay (bubble stays visible). */
  hide(delayMs = 600) {
    this.cancelIdleTimeout();

    if (delayMs <= 0) {
      this.sendState('idle');
      return;
    }

    this.idleTimeout = setTimeout(() => {
      this.sendState('idle');
    }, delayMs);
  }

  /** Immediately destroy the bubble window. */
  destroy() {
    this.cancelIdleTimeout();
    this.stopDisplayTracking();
    if (this.window && !this.window.isDestroyed()) {
      this.window.destroy();
    }
    this.window = null;
  }

  private createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenW, height: screenH } = primaryDisplay.workAreaSize;
    this.lastDisplayId = primaryDisplay.id;

    this.window = new BrowserWindow({
      width: BUBBLE_SIZE,
      height: BUBBLE_SIZE,
      x: Math.round((screenW - BUBBLE_SIZE) / 2),
      y: screenH - BUBBLE_SIZE - MARGIN,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      hasShadow: false,
      focusable: false,
      roundedCorners: true,
      webPreferences: {
        preload: path.join(__dirname, '../bubble-preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // On macOS, set window level above normal but below modal windows
    if (process.platform === 'darwin') {
      this.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      // Ensure the app stays in the Dock and Cmd+Tab after creating a non-focusable window
      app.dock?.show();
    }

    const isDevelopment = !app.isPackaged;
    if (isDevelopment) {
      const urlFile = path.join(__dirname, '../../.dev-server-url');
      const rendererUrl = fs.readFileSync(urlFile, 'utf-8').trim();
      this.window.loadURL(`${rendererUrl}#bubble`);
    } else {
      this.window.loadFile(path.join(__dirname, '../../renderer/index.html'), { hash: 'bubble' });
    }

    this.window.on('closed', () => {
      this.window = null;
    });
  }

  private sendState(state: BubbleState) {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('bubble-state', state);
    }
  }

  /** Move bubble to bottom-center of the display where the cursor is, only when display changes. */
  private moveToCursorDisplay() {
    if (!this.window || this.window.isDestroyed()) return;

    const cursorPoint = screen.getCursorScreenPoint();
    const activeDisplay = screen.getDisplayNearestPoint(cursorPoint);

    // Only reposition when the cursor moves to a different display
    if (activeDisplay.id === this.lastDisplayId) return;
    this.lastDisplayId = activeDisplay.id;

    const { x: dx, y: dy, width: dw, height: dh } = activeDisplay.workArea;
    const targetX = Math.round(dx + (dw - BUBBLE_SIZE) / 2);
    const targetY = dy + dh - BUBBLE_SIZE - MARGIN;
    this.window.setPosition(targetX, targetY, false);
  }

  private startDisplayTracking() {
    this.stopDisplayTracking();
    // Check every 1s if the cursor moved to a different display
    this.displayInterval = setInterval(() => this.moveToCursorDisplay(), 1000);
  }

  private stopDisplayTracking() {
    if (this.displayInterval) {
      clearInterval(this.displayInterval);
      this.displayInterval = null;
    }
  }

  private cancelIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  }
}
