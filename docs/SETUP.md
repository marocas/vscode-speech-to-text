# SETUP GUIDE: Smart Transcription Daemon

## Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Python**: v3.7+ (required by node-gyp for native modules)
- **Build Tools**:
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Windows: Visual Studio Build Tools
  - Linux: BUILD ESSENTIAL (`sudo apt-get install build-essential`)

## Step 1: Google Cloud Setup

Smart Transcription Daemon uses Google Cloud Speech-to-Text API. You need to set up credentials:

### 1a. Create a Google Cloud Project

```bash
# Go to https://console.cloud.google.com/
# Create a new project named "Smart Transcription Daemon"
```

### 1b. Enable the Speech-to-Text API

```bash
# In Google Cloud Console:
# 1. Go to APIs & Services > Library
# 2. Search for "Speech-to-Text API"
# 3. Click "Enable"
```

### 1c. Create Service Account Credentials

```bash
# In Google Cloud Console:
# 1. Go to APIs & Services > Credentials
# 2. Click "Create Credentials" > "Service Account"
# 3. Fill in the form:
#    - Service account name: "smart-transcription-daemon-app"
#    - Grant roles: "Editor" (for development)
# 4. Create a key (JSON format)
# 5. Save the JSON file securely
```

### 1d. Set Environment Variable

```bash
# Copy the JSON file to a secure location
cp ~/Downloads/credentials.json ~/.config/gcloud/smart-transcription-daemon-credentials.json

# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/smart-transcription-daemon-credentials.json

# Verify it's set
echo $GOOGLE_APPLICATION_CREDENTIALS
```

## Step 2: Install Dependencies

```bash
# Clone or navigate to the project directory
cd smart-transcription-daemon

# Install npm dependencies
npm install

# This will also rebuild native modules (better-sqlite3, etc.)
# If you encounter build errors, ensure you have build tools installed
```

## Step 3: Verify Setup

```bash
# Type check the project
npm run type-check

# Run linting
npm run lint

# If both pass, you're ready to develop!
```

## Step 4: Development

### Start Development Server

```bash
# This will start both the Vite dev server and Electron in one command
npm run dev

# The app should open automatically with DevTools enabled
```

### Structure Overview

```
src/
├── main/                 # Electron main process (Node.js)
│   ├── main.ts          # App entry point
│   ├── preload.ts       # IPC bridge (security)
│   └── services/        # Backend services
│       ├── speech-to-text.ts    # Google Cloud STT integration
│       ├── database.ts          # SQLite storage
│       └── app-context.ts       # Window detection
├── renderer/            # React UI (Browser)
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages/           # Page components
│   └── components/      # UI components
└── shared/              # Shared types & utilities
    ├── types.ts
    └── developer-utils.ts
```

### Hot Reload

- **UI Changes**: Automatically refresh in dev server (HMR via Vite)
- **Main Process Changes**: Requires manual restart (Ctrl+C then `npm run dev`)

## Step 5: Building for Distribution

### macOS

```bash
npm run dist
# Creates: dist/Smart Transcription Daemon-0.1.0.dmg
```

### Windows

```bash
npm run dist
# Creates: dist/Smart Transcription Daemon Setup 0.1.0.exe
```

### Linux

```bash
npm run dist
# Creates: dist/smart-transcription-daemon-0.1.0.AppImage
#          dist/smart-transcription-daemon_0.1.0_amd64.deb
```

## Troubleshooting

### Build Errors with better-sqlite3

```bash
# If you get errors about better-sqlite3:
npm rebuild better-sqlite3

# On M1/M2 Mac, you might need:
npm run build
npm exec electron-rebuild -- --arch=arm64
```

### Google Cloud Authentication Error

```bash
# Check that credentials file exists
ls -la ~/.config/gcloud/

# Verify environment variable is set
echo $GOOGLE_APPLICATION_CREDENTIALS

# Try rebuilding with credentials set
GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/smart-transcription-daemon-credentials.json npm run dev
```

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
kill -9 $(lsof -t -i :3000)

# Or use a different port
# (Update vite.config.ts server.port if needed)
```

### Type Errors

```bash
# Ensure TypeScript is up to date
npm install -D typescript@latest

# Run type check
npm run type-check

# Check for missing type definitions
npm install -D @types/node @types/react @types/react-dom
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
VITE_APP_NAME=Smart Transcription Daemon
```

## Development Workflow

1. **Make Changes**: Edit TypeScript, React, or shared code
2. **Type Check**: Run `npm run type-check` frequently
3. **Test**: Manually test in dev app or write tests
4. **Commit**: Follow conventional commits

## Next Steps

- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md) (create if needed)
- [ ] Check the [README.md](./README.md) for API documentation
- [ ] Add Google Cloud credentials to your environment
- [ ] Run `npm run dev` to start developing
- [ ] Check [GitHub Issues](./docs/ROADMAP.md) for tasks

## Support

For setup assistance:

1. Check this guide's troubleshooting section
2. Review [GitHub Issues](https://github.com/yourname/smart-transcription-daemon/issues)
3. Create a new issue with your error message and environment info

---

Happy coding! 🎤✨
