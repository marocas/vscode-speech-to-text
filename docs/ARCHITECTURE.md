# Smart Transcription Daemon - Architecture & Design

## Overview

Smart Transcription Daemon is a cross-platform Electron application that provides voice-to-text transcription optimized for developers. It uses a local **whisper.cpp** subprocess for offline transcription and an optional **Ollama** LLM for post-processing and translation.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                    │
│  (Node.js) - File system, IPC, OS Integration               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  whisper.cpp     │  │  PostgreSQL DB   │                 │
│  │  (subprocess)    │  │  (Prisma ORM)    │                 │
│  │  - Transcription │  │  - Users         │                 │
│  │  - Local/offline │  │  - Dictations    │                 │
│  └──────────────────┘  └──────────────────┘                 │
│          ↑                       ↑                          │
│  ┌──────────────────┐            │                          │
│  │  Ollama (HTTP)   │            │                          │
│  │  - LLM refine    │            │                          │
│  │  - Translation   │            │                          │
│  └──────────────────┘            │                          │
│          ↑                       │                          │
│          └───────────────────────┴──────────────────┐       │
│                                                     │       │
│                    ┌─────────────────────┐          │       │
│                    │  IPC Bridge         │──────────┘       │
│                    │  (preload.ts)       │                  │
│                    └─────────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                  Electron Renderer (Browser)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React UI (Vite HMR)                     │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                  │   │
│  │  │ Dictation    │  │ Settings     │                  │   │
│  │  │ Page         │  │ Page         │                  │   │
│  │  │              │  │              │                  │   │
│  │  │ - Recording  │  │ - Engine     │                  │   │
│  │  │ - Display    │  │ - Hotkeys    │                  │   │
│  │  └──────────────┘  └──────────────┘                  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  Audio Input (Web Audio API / MediaRecorder) │    │   │
│  │  │  - Microphone access                         │    │   │
│  │  │  - WAV encoding (16-bit PCM mono)            │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Module Organization

### Main Process (`src/main/`)

#### `main.ts` - Application Entry Point

- Initializes Electron app
- Creates BrowserWindow
- Manages app lifecycle
- Sets up all IPC handlers
- Coordinates service initialization
- Persists session (current user) via `electron-store`

**Key Responsibilities:**

- Window creation and management
- IPC endpoint registration
- Global hotkey feedback (fires `global-dictation-hotkey` events to renderer)
- Graceful shutdown with error handling

#### `preload.ts` - IPC Bridge

- Exposes a typed API surface to the renderer via `contextBridge`
- Implements context isolation (no direct Node.js access from React)
- Prevents privilege escalation / XSS

**APIs Exposed:**

```typescript
window.api = {
  // Dictation
  startDictation(options)
  stopDictation()
  saveDictation(text)
  processDictationText(text, targetLanguage?)

  // History
  getDictations(limit?)
  deleteDictation(id)
  clearDictationHistory()

  // Settings (machine + LLM)
  getMachineSettings()
  updateMachineSettings(updates)
  getLlmSettings()
  updateLlmSettings(updates)
  resetMachineSettings()

  // Auth
  login(email, password)
  register(email, username, password)
  logout()
  changePassword(currentPassword, newPassword)
  getCurrentUser()

  // Whisper helpers
  getWhisperModelCandidates()
  getSttReadiness()
  requestMicrophonePermission()

  // Notifications
  getNotifications()
  addNotification(...)
  markNotificationRead(id)
  deleteNotification(id)
}
```

#### `services/speech-to-text.ts` - Transcription & Post-Processing

- Spawns `whisper-cli` subprocess with a temp WAV file
- Parses the `.txt` output from whisper.cpp
- Optionally calls Ollama HTTP API for LLM refinement / translation
- Applies custom dictionary corrections
- Manages dictation history (save / delete / clear) via `DatabaseService`

**Audio Pipeline (batch — current):**

```
Renderer: MediaRecorder → blob chunks → blobToMonoWav (16-bit PCM mono WAV)
  → WAV bytes sent over IPC →
Main: writes temp file → spawns whisper-cli → parses .txt output
  → (optional) POST to Ollama /api/generate →
  sanitize Ollama response → return final text to renderer
```

**Whisper command resolution:** tries configured path, then several common
install locations (`/opt/homebrew/bin/whisper-cli`, `~/.local/bin/whisper-cli`,
etc.) to cope with restricted `PATH` in packaged builds.

#### `services/database.ts` - PostgreSQL Storage (Prisma)

- Prisma ORM over PostgreSQL (`DATABASE_URL` from `.env`)
- Manages users, dictation history, and per-user LLM settings

**Schema tables:**

- `users`: id, email, username, passwordHash
- `dictations`: id, userId, text, language, format, createdAt
- `user_llm_settings`: per-user Ollama URL/model/prompt overrides

#### `services/settings-store.ts` - Machine Settings (electron-store)

- Persists machine-level settings to disk via `electron-store` (JSON)
- Stored under `~/Library/Application Support/smart-transcription-daemon/settings.json`
- Fields: `globalDictationHotkey`, `whisperCommand`, `whisperModelPath`, `defaultDictationLanguage`, `sourceLanguage`

#### `services/notification-service.ts` - In-App Notifications (electron-store)

- Persists notifications to disk via `electron-store`
- 3-day expiry, mark-as-read, delete support

#### `services/global-hotkey.ts` - Global Hotkey Manager

- Uses `uiohook-napi` for native low-level key hooks
- Supports any key combination (including `fn`, media keys, etc.)
- Debounces key-up to prevent double-firing
- Fires `global-dictation-hotkey-pressed` / `released` events to renderer

#### `services/app-context.ts` - Context Detection

- Detects the frontmost application name via AppleScript (`osascript`)
- Used to label dictation entries with the target app context

#### `ipc/settings-handlers.ts` - Settings IPC Handlers

- Handles all settings-related IPC messages
- Delegates to `settings-store` and `DatabaseService`

### Renderer Process (`src/renderer/`)

#### `App.tsx` - Root Component

- Page navigation (tabs)
- Global header with DictationButton and hotkey display
- Handles global hotkey events from main process

#### Pages

- `DictationPage.tsx`: Main dictation interface
  - Mic permission preflight
  - MediaRecorder start/stop
  - WAV encoding and IPC dispatch
  - `[BLANK_AUDIO]` detection
  - Save / copy / send-to-VS-Code results
- `SettingsPage.tsx`: Settings container

#### Components

- `EngineSettingsPanel.tsx`: Whisper command/model path, language pair (source + output), translation status, mic/accessibility permission toggles
- `HotkeysPanel.tsx`: Global hotkey recorder
- `LLMPromptManager.tsx`: Ollama URL/model/prompt config
- `DictionaryManager.tsx`: Custom word dictionary
- `DictationHistoryPanel.tsx`: Saved dictation history
- `LocalSettingsPanel.tsx`: Local machine overrides
- `LoginPanel.tsx`: Auth (login / register / change password)

#### `utils/audio.ts`

- `MediaRecorder` MIME-type detection
- `blobToMonoWav`: resamples and encodes audio blob to 16-bit PCM mono WAV
- Stop-bell sound on recording end

### Shared Code (`src/shared/`)

#### `constants.ts` - App-Wide Constants

- `APP_NAME`, `APP_STORE_CWD` — identity constants
- `SUPPORTED_LANGUAGES` — language picker options
- `DEFAULT_*` — default values for hotkey, whisper command, Ollama settings, etc.

#### `types.ts` - Type Definitions

- IPC message types
- Data models (`DictationResult`, `DictationHistoryEntry`, `AuthUser`, etc.)
- Configuration interfaces (`AppMachineSettings`, `AppLlmSettings`)

#### `developer-utils.ts` - Language Processing

- Case conversion (`camelCase`, `snake_case`, `PascalCase`)
- Developer term detection and acronym handling
- `applyDeveloperCorrections()` applied to transcription output

## Data Flow

### Dictation Flow

```
1. User triggers hotkey or clicks DictationButton
   ↓
2. Renderer requests mic permission (preflight on macOS)
   ↓
3. MediaRecorder starts capturing audio
   ↓
4. User releases hotkey / clicks stop
   ↓
5. Renderer encodes blob → 16-bit PCM mono WAV
   ↓
6. WAV bytes sent to main via IPC (start-dictation)
   ↓
7. Main writes temp WAV → spawns whisper-cli subprocess
   ↓
8. whisper.cpp writes transcript .txt → main reads it
   ↓
9. (Optional) POST to Ollama for LLM refinement / translation
   ↓
10. Apply developer corrections (applyDeveloperCorrections)
    ↓
11. Return DictationResult to renderer
    ↓
12. Renderer displays result, sends text to VS Code extension via IPC
```

### Settings Flow

```
1. User changes a setting in EngineSettingsPanel / HotkeysPanel
   ↓
2. IPC call: updateMachineSettings(updates)
   ↓
3. Main: normalizes + validates updates
   ↓
4. Saves to electron-store (settings.json on disk)
   ↓
5. Pushes live updates to SpeechToTextService & GlobalHotkeyManager
   ↓
6. Returns updated settings to renderer
```

## Key Design Decisions

### 1. Local-Only STT (whisper.cpp)

- No cloud dependency — fully offline after model download
- `whisper-cli` subprocess spawned per recording (batch, not streaming)
- Model path and command are user-configurable

### 2. Optional LLM Post-Processing (Ollama)

- Ollama runs locally on the user's machine
- Used for punctuation cleanup, terminology correction, and translation
- Disabled automatically when the target language matches the source language
- Sanitization logic rejects hallucinated/assistant-reply responses

### 3. Context Isolation

- Renderer and main processes are fully isolated
- `contextBridge` in `preload.ts` is the only communication surface
- No direct Node.js access from React

### 4. Electron-Store for Settings

- Machine settings and notifications stored as JSON on disk
- No PostgreSQL dependency for local preferences
- PostgreSQL (Prisma) used only for user accounts and dictation history

### 5. Global Hotkey via uiohook-napi

- Low-level native key hook (no Electron globalShortcut)
- Supports any key, including `fn` and media keys
- Works even when the app window is not focused

### 6. IPC Safety

- `preload.ts` exposes an explicit, typed API — no eval() or dynamic dispatch
- Input validated at IPC boundary before reaching services

## Technology Stack

| Component      | Technology                    | Why                                       |
| -------------- | ----------------------------- | ----------------------------------------- |
| Desktop        | Electron 27                   | Cross-platform (macOS, Windows, Linux)    |
| Main Process   | TypeScript + Node.js          | Type safety, OS access                    |
| UI             | React 18 + MUI v7             | Component-based, large ecosystem          |
| STT            | whisper.cpp (subprocess)      | Local, offline, no API key required       |
| LLM            | Ollama (HTTP API)             | Local LLM for refinement / translation    |
| Database       | PostgreSQL + Prisma ORM       | Relational, supports multi-user history   |
| Settings/Store | electron-store (JSON)         | Lightweight, no DB needed for preferences |
| Key Hooks      | uiohook-napi                  | Native global hotkeys including fn key    |
| Audio          | MediaRecorder + Web Audio API | WAV encoding in renderer                  |
| Build          | Vite + tsc                    | Fast builds, HMR in dev                   |
| Packaging      | electron-builder              | DMG / EXE / AppImage, code signing        |

## Security Considerations

### 1. IPC Communication

- No `eval()` or `Function()` constructors
- Typed, explicit API surface via `contextBridge`
- Input validation before processing in main process

### 2. Audio Data

- Users must explicitly grant microphone permission
- Audio is processed locally by whisper.cpp — never sent to a cloud API
- Ollama also runs locally; no audio leaves the machine

### 3. Credentials Management

- `DATABASE_URL` loaded from `.env` (packaged to `resources/.env`)
- Not hardcoded anywhere in source

### 4. Authentication

- Passwords hashed with bcrypt before storage (`auth-utils.ts`)
- Session stored as a user ID in `electron-store`, not as a token

## Performance Notes

### Current Bottlenecks

- **Subprocess spawn overhead**: ~200–400 ms per recording start
- **Batch-only pipeline**: entire clip must finish recording before transcription starts
- **Ollama refinement**: adds 1–5 s on modest hardware

### Path to Lower Latency

| Improvement                            | Impact | Effort |
| -------------------------------------- | ------ | ------ |
| Native whisper binding (no subprocess) | High   | High   |
| Streaming / windowed transcription     | High   | High   |
| Async / non-blocking Ollama refinement | Medium | Low    |
| Voice Activity Detection (auto stop)   | High   | Medium |
