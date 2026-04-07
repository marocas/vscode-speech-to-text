# Setup Guide

This guide is for contributors running the project from source.

For end-user app installation, use [INSTALL.md](INSTALL.md).

## Scope

- Development runtime: Electron main + React renderer
- Primary development platform: macOS (Apple Silicon)
- Dictation backend: native Swift agent + whisper.cpp
- Optional post-processing: Ollama

## Prerequisites

- Node.js 20+
- pnpm 10+
- Xcode Command Line Tools (macOS):
  - xcode-select --install
- whisper.cpp CLI installed and available in PATH:
  - brew install whisper-cpp
- Ollama installed (optional, for LLM refine/translation):
  - https://ollama.com
  - Example model pull: ollama pull translategemma:4b

## Environment

Create a .env file in the project root with at least:

- DATABASE_URL: PostgreSQL connection string used by Prisma

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/smart_transcription_daemon
```

## Install Dependencies

```bash
pnpm install
```

Notes:

- postinstall runs Prisma client generation and electron-builder app deps.
- If Prisma schema validation fails, confirm your .env contains a valid DATABASE_URL.

## Database Setup (Prisma)

Run migrations against your development database:

```bash
pnpm exec prisma migrate dev --name init
```

Optional seed scripts available in [../prisma](../prisma).

## Native Agent

Build the macOS native agent binary:

```bash
cd native-agent
swift build -c release
cd ..
```

The app expects the binary at:

- native-agent/.build/release/STDAgent (development)

## Development Workflow

Start the full app in development mode:

```bash
pnpm dev
```

Useful commands:

```bash
pnpm type-check
pnpm lint
pnpm build
pnpm start
```

## Packaging

Package unsigned test build:

```bash
pnpm pack
```

Build distribution artifact:

```bash
pnpm dist
```

## Troubleshooting

### pnpm not found in CI or shell

- Ensure Node is installed and pnpm is installed globally or via Corepack.
- Local check: pnpm -v

### Prisma errors during install

- Verify DATABASE_URL is set and reachable.
- Re-run: pnpm exec prisma generate

### Native agent not starting

- Confirm binary exists at native-agent/.build/release/STDAgent.
- Rebuild native agent: swift build -c release.

### whisper-cli not found

- Install via Homebrew: brew install whisper-cpp
- Validate path: which whisper-cli

## Related Docs

- [INSTALL.md](INSTALL.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [../README.md](../README.md)
