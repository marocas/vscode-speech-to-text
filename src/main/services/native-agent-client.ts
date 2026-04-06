import type { AppLlmSettings, AppMachineSettings } from '@shared/types';
import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';

// IPC message types from the Swift agent
export interface AgentHotkeyEvent {
  hotkey: string;
}
export interface AgentTranscriptionResult {
  text: string;
  language: string;
}
export interface AgentPipelineResult {
  text: string;
  rawText: string;
  ollamaText?: string;
  language: string;
  sourceApp?: string;
  audioPath?: string;
}
export interface AgentAudioLevel {
  rms: number;
  peak: number;
}
export interface AgentError {
  code: string;
  message: string;
}
export interface AgentStateChanged {
  state: 'idle' | 'recording' | 'processing';
  previousState: string;
}

/**
 * Client for the native Swift STDAgent process.
 * Communicates over a Unix domain socket using newline-delimited JSON.
 */
export class NativeAgentClient extends EventEmitter {
  private socketPath: string;
  private socket: net.Socket | null = null;
  private agentProcess: ChildProcess | null = null;
  private buffer = '';
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private isShuttingDown = false;

  constructor() {
    super();
    this.socketPath = path.join(os.homedir(), '.std-agent.sock');
  }

  /**
   * Spawn the native agent binary and connect to its IPC socket.
   */
  async start(agentBinaryPath: string): Promise<void> {
    this.isShuttingDown = false;

    // Remove stale socket so waitForSocket doesn't find an old one
    const fs = await import('fs');
    try {
      fs.unlinkSync(this.socketPath);
    } catch {
      /* not found — fine */
    }

    // Spawn the agent process
    this.agentProcess = spawn(agentBinaryPath, [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false,
    });

    this.agentProcess.stdout?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        console.log(`[STDAgent] ${line}`);
      }
    });

    this.agentProcess.stderr?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        console.error(`[STDAgent] ${line}`);
      }
    });

    this.agentProcess.on('exit', (code, signal) => {
      console.log(`[STDAgent] Process exited: code=${code}, signal=${signal}`);
      this.socket?.destroy();
      this.socket = null;
      if (!this.isShuttingDown) {
        this.scheduleReconnect();
      }
    });

    // Wait for the socket to become available, then connect
    await this.waitForSocket(5000);
    this.connect();
  }

  /**
   * Connect to the agent's Unix domain socket.
   */
  private connect(): void {
    if (this.isShuttingDown) return;

    const socket = net.createConnection({ path: this.socketPath });
    this.socket = socket;

    socket.on('connect', () => {
      console.log('[STDAgent] IPC connected');
      this.reconnectDelay = 1000;
      this.emit('connected');
    });

    socket.on('data', (data: Buffer) => {
      this.buffer += data.toString();
      this.processBuffer();
    });

    socket.on('error', (err) => {
      console.error(`[STDAgent] IPC error: ${err.message}`);
    });

    socket.on('close', () => {
      console.log('[STDAgent] IPC disconnected');
      this.socket = null;
      this.emit('disconnected');
      if (!this.isShuttingDown) {
        this.scheduleReconnect();
      }
    });
  }

  /**
   * Send the full configuration to the agent.
   */
  sendConfigure(
    machineSettings: AppMachineSettings,
    llmSettings: AppLlmSettings,
    dictionary: Record<string, string>
  ): void {
    this.send('configure', {
      hotkey: machineSettings.globalDictationHotkey,
      whisperCommand: machineSettings.whisperCommand,
      whisperModelPath: machineSettings.whisperModelPath,
      sourceLanguage: machineSettings.sourceLanguage,
      defaultDictationLanguage: machineSettings.defaultDictationLanguage,
      ollamaBaseUrl: llmSettings.ollamaBaseUrl,
      ollamaModel: llmSettings.ollamaModel,
      ollamaTranslationModel: llmSettings.ollamaTranslationModel,
      ollamaPrompt: llmSettings.ollamaPrompt,
      bubbleEnabled: machineSettings.bubbleEnabled,
      autoPasteEnabled: machineSettings.autoPasteEnabled,
      dictionary,
    });
  }

  sendStartListening(targetLanguage?: string): void {
    this.send('start-listening', { targetLanguage });
  }

  sendStopListening(targetLanguage?: string, sourceLanguage?: string): void {
    this.send('stop-listening', { targetLanguage, sourceLanguage });
  }

  sendCancel(): void {
    this.send('cancel');
  }

  sendSetBubbleState(state: 'idle' | 'recording' | 'processing'): void {
    this.send('set-bubble-state', { state });
  }

  /**
   * Gracefully shut down the agent.
   */
  async stop(): Promise<void> {
    this.isShuttingDown = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.send('quit');
    // Give the agent time to shut down gracefully
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
    this.socket?.destroy();
    this.socket = null;
    if (this.agentProcess && !this.agentProcess.killed) {
      this.agentProcess.kill('SIGTERM');
    }
    this.agentProcess = null;
  }

  // MARK: - Private

  private send(type: string, payload?: Record<string, unknown>): void {
    if (!this.socket || this.socket.destroyed) return;
    const message = JSON.stringify({ type, payload: payload ?? null });
    this.socket.write(message + '\n');
  }

  private processBuffer(): void {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line) as { type: string; payload?: unknown };
        this.emit('message', msg.type, msg.payload);
        this.emit(msg.type, msg.payload);
      } catch {
        console.error(`[STDAgent] Failed to parse IPC message: ${line.substring(0, 200)}`);
      }
    }
  }

  private async waitForSocket(timeoutMs: number): Promise<void> {
    const start = Date.now();
    const fs = await import('fs/promises');
    while (Date.now() - start < timeoutMs) {
      try {
        await fs.access(this.socketPath);
        return;
      } catch {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
    // Timeout — try connecting anyway
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    console.log(`[STDAgent] Reconnecting in ${this.reconnectDelay}ms...`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
      if (this.agentProcess && !this.agentProcess.killed) {
        this.connect();
      }
    }, this.reconnectDelay);
  }
}
