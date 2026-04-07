# Smart Transcription Daemon

Smart voice-to-text dictation app for developers, built with Electron + React.

## Current Status

- Primary target: macOS (Apple Silicon) packaging and runtime flow.
- Dictation pipeline runs via native macOS agent + whisper.cpp.
- Optional Ollama post-processing is supported for refinement/translation.
- App data is managed with Prisma and PostgreSQL, plus electron-store for machine/session settings.

## Release Status

- Status: Active development (internal/beta quality).
- Distribution: macOS package flow is the primary supported release target today.
- CI: currently optimized for macOS Apple Silicon validation.

## What Is Implemented

- Global hotkey dictation on macOS through the native agent.
- Dictation history with save/delete/clear operations.
- User authentication and session restore.
- Machine settings and per-user LLM settings.
- Whisper model discovery/download/use flows.
- Dictionary and snippet management.
- In-app notifications and unread counters.

## Tech Stack

- Desktop: Electron + TypeScript
- UI: React + MUI
- Build: Vite + TypeScript
- STT: whisper.cpp (local)
- LLM: Ollama (optional)
- Data: Prisma + PostgreSQL
- Local config/state: electron-store

## Documentation

- Installation guide: [docs/INSTALL.md](docs/INSTALL.md)
- Architecture details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Setup notes: [docs/SETUP.md](docs/SETUP.md)

## Getting Started (Development)

### Prerequisites

- Node.js 20+
- pnpm 10+
- macOS environment for native agent development/testing

### Install

1. Install dependencies:
   - pnpm install
2. Ensure your local environment variables are configured (for example DATABASE_URL in .env).
3. Follow platform/runtime dependencies in [docs/INSTALL.md](docs/INSTALL.md).

### Run

- Development: pnpm dev
- Type check: pnpm type-check
- Lint: pnpm lint
- Build app (no package): pnpm build
- Package test build: pnpm pack
- Distribution build: pnpm dist
- Start built app: pnpm start

## Project Structure

- [src/main](src/main): Electron main process, IPC handlers, services
- [src/main/ipc/settings-handlers.ts](src/main/ipc/settings-handlers.ts): settings and permissions IPC handlers
- [src/main/preload.ts](src/main/preload.ts): typed bridge exposed as window.api
- [src/renderer](src/renderer): React renderer app
- [src/shared](src/shared): shared types/constants/utilities
- [native-agent](native-agent): Swift native macOS agent
- [prisma](prisma): schema and seed scripts

## Notes

- IPC handlers are actively used and split between main process modules.
- CI is currently focused on macOS Apple Silicon pipelines.

## Contributing

Contributions are welcome via pull requests.

## License

MIT
