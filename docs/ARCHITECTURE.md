# Architecture

## Overview

Smart Transcription Daemon is an Electron desktop app with a React renderer and a Node.js main process. On macOS, dictation capture and hotkey lifecycle are coordinated through a native Swift agent.

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Smart Transcription Daemon                  │
├─────────────────────────────────────────────────────────────────────┤
│ Renderer (React)                                                   │
│ - Dictation, Settings, History, Dictionary, Snippets, Notifications│
│ - Calls window.api (typed bridge)                                  │
└───────────────┬─────────────────────────────────────────────────────┘
    │ IPC via contextBridge/ipcRenderer
┌───────────────▼─────────────────────────────────────────────────────┐
│ Main Process (Electron + Node.js)                                  │
│ - app lifecycle, window management, IPC handlers                   │
│ - service orchestration, session restore                           │
│ - forwards agent events to renderer                                │
└───────┬───────────────────────────────┬─────────────────────────────┘
  │                               │
  │                               │
┌───────▼───────────────────┐   ┌───────▼────────────────────────────┐
│ Native Agent Client       │   │ Persistence Layer                   │
│ (main/services)           │   │ - Prisma + PostgreSQL              │
│ - spawns STDAgent         │   │ - electron-store (machine/session) │
│ - Unix socket JSON IPC    │   │ - notification local state         │
└───────┬───────────────────┘   └────────────────────────────────────┘
  │
┌───────▼─────────────────────────────────────────────────────────────┐
│ STDAgent (Swift, macOS)                                             │
│ - global hotkey lifecycle                                            │
│ - recording/processing state events                                  │
│ - pipeline result/error events                                       │
└───────┬──────────────────────────────────────────────────────────────┘
  │
┌───────▼─────────────────────┐      ┌────────────────────────────────┐
│ whisper.cpp (local STT)     │      │ Ollama (optional HTTP refine) │
│ - local transcription        │      │ - punctuation/translation     │
└──────────────────────────────┘      └────────────────────────────────┘
```

Core processing layers:

- Renderer UI: user interactions and state presentation
- Electron main process: IPC, persistence orchestration, OS integrations
- Native Swift agent: hotkey, capture pipeline events, state transitions
- Local speech pipeline: whisper.cpp execution and optional Ollama refinement
- Persistence: Prisma/PostgreSQL plus electron-store for machine/session data

## Runtime Components

### Renderer

Location: [../src/renderer](../src/renderer)

Responsibilities:

- Renders Dictation, Settings, and Help flows
- Calls typed bridge methods on window.api
- Subscribes to agent and navigation events
- Displays dictation history, dictionary, snippets, notifications, and settings

### Preload Bridge

Location: [../src/main/preload.ts](../src/main/preload.ts)

Responsibilities:

- Exposes a controlled, typed API to renderer via contextBridge
- Maps UI calls to ipcRenderer.invoke and ipcRenderer.on
- Preserves context isolation by preventing direct Node access in renderer

### Main Process

Location: [../src/main/main.ts](../src/main/main.ts)

Responsibilities:

- App lifecycle and BrowserWindow management
- Registers IPC handlers for dictation, auth, history, notifications, and settings
- Initializes services and restores authenticated session
- Starts native agent on macOS and bridges agent events to renderer

### Settings IPC Module

Location: [../src/main/ipc/settings-handlers.ts](../src/main/ipc/settings-handlers.ts)

Responsibilities:

- Centralized machine/LLM settings handlers
- Permissions and readiness checks
- Whisper model discovery and management
- Ollama model operations

### Native Agent Client

Location: [../src/main/services/native-agent-client.ts](../src/main/services/native-agent-client.ts)

Responsibilities:

- Spawns and monitors STDAgent process
- Connects over Unix socket using newline-delimited JSON
- Sends configure/start/stop/cancel commands
- Emits state, result, and error events to main process

### Persistence

- Prisma + PostgreSQL:
  - [../prisma/schema.prisma](../prisma/schema.prisma)
  - users, dictations, dictionary, snippets, user_llm_settings
- electron-store:
  - machine settings and session state
  - local notification persistence

## Data Flow

### Dictation Flow (macOS)

1. User triggers dictation from UI or global hotkey.
2. Renderer invokes bridge methods via window.api.
3. Main process forwards control to native agent client.
4. Native agent runs capture/transcription pipeline and emits events.
5. Main process forwards state/result events to renderer.
6. Main process persists final dictation via service/database layer.
7. Renderer updates history and UI state.

### Settings Flow

1. Renderer submits settings update through window.api.
2. Main settings handlers validate and normalize input.
3. Machine settings persist through electron-store.
4. User-level LLM settings persist through Prisma.
5. Runtime services are updated in-process.

## Security Model

- contextIsolation enabled in BrowserWindow.
- preload is the only renderer bridge to privileged APIs.
- IPC routes are explicit and typed.
- Renderer has no direct Node.js API access.

## Platform Focus

Current development and packaging flow prioritize macOS Apple Silicon.
Cross-platform support remains possible via Electron, but native-agent-driven dictation behavior is currently optimized around macOS runtime constraints.

## Related Docs

- [INSTALL.md](INSTALL.md)
- [SETUP.md](SETUP.md)
- [../README.md](../README.md)
