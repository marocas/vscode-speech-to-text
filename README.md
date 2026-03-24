# Smart Transcription Daemon

> Smart voice-to-text transcription daemon for developers.

## Features

### 🎤 Core Features

- **Real-time Transcription**: Stream audio to Google Cloud Speech-to-Text API
- **Developer-Smart**: Recognizes camelCase, snake_case, developer terms (MongoDB, Vercel, etc.), and acronyms
- **Personal Dictionary**: Learn custom words and improve transcription accuracy
- **Voice Snippets**: Create voice shortcuts for frequently used phrases/templates
- **App Context Aware**: Adjusts tone and formatting based on active application
- **Multi-language**: Support for 100+ languages with auto-detection

### 🛡️ Privacy & Security

- Local-first database (SQLite)
- Optional end-to-end encryption for cloud calls
- No telemetry without explicit consent
- Air-gap mode for offline usage

### 🖥️ Cross-Platform

- macOS
- Windows
- Linux

## Tech Stack

- **Desktop**: Electron + TypeScript
- **UI**: React + TailwindCSS
- **Audio Processing**: Web Audio API + MediaRecorder
- **Speech-to-Text**: Google Cloud Speech-to-Text (streaming)
- **Database**: SQLite (better-sqlite3) + Electron Store
- **Build**: Vite + TypeScript

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Google Cloud credentials (for Speech-to-Text API)

### Installation

```bash
# Install dependencies
npm install

# Set up Google Cloud credentials
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Seed the app SQLite database used by Prisma Studio
pnpm prisma:seed

# Open Prisma Studio against the same runtime database
pnpm prisma:studio
```

### Building

```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run build  # Just build, don't package
npm run pack   # Test package without signing
```

## Project Structure

```
smart-transcription-daemon/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # App entry point
│   │   ├── preload.ts       # IPC bridge
│   │   └── services/
│   │       ├── speech-to-text.ts    # Google Cloud integration
│   │       ├── database.ts          # SQLite storage
│   │       └── app-context.ts       # Window context detection
│   ├── renderer/            # React UI
│   │   ├── App.tsx
│   │   ├── main.tsx         # React entry
│   │   ├── pages/           # Page components
│   │   └── components/      # UI components
│   └── shared/              # Shared types & utilities
│       ├── types.ts
│       └── developer-utils.ts
├── public/
├── dist/                    # Build output
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## Configuration

### Google Cloud Speech-to-Text Setup

1. Create a Google Cloud project
2. Enable the Speech-to-Text API
3. Create a service account and download credentials JSON
4. Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable

```bash
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/credentials.json
```

### Building for Distribution

The app uses electron-builder for packaging. Configuration is in `package.json`:

```json
{
  "build": {
    "appId": "com.smart-transcription-daemon.app",
    "productName": "Smart Transcription Daemon"
  }
}
```

## Usage

### Dictation Workflow

1. **Start Recording**: Click the microphone button or press hotkey
2. **Speak Your Code**: Developer terms are automatically recognized
3. **View Results**: See interim and final transcriptions in real-time
4. **Copy/Insert**: Copy to clipboard or insert directly into active window

### Personal Dictionary

Add custom terms for your domain:

```
- Company names (YourStartup, Acme Corp)
- Internal APIs (MyServiceAPI, FastendAPI)
- Acronyms (YAML, CORS, DAG)
- Naming conventions (PascalCase, snake_case)
```

### Voice Snippets

Create shortcuts for common phrases:

```
Trigger: "changelog"
Replacement: "## Changelog\n\n### Added\n- \n\n### Fixed\n- "
```

## API Reference

### Main Process IPC Handlers

```typescript
// Dictation
window.api.startDictation({ language: 'en-US' });
window.api.stopDictation();
window.api.onDictationResult(callback);

// Dictionary
window.api.addToDictionary(word, category);
window.api.getDictionary();

// Snippets
window.api.addSnippet(trigger, replacement, category);
window.api.getSnippets();
window.api.deleteSnippet(id);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap

- [ ] Real-time audio streaming to Google Cloud
- [ ] Custom hotkey configuration
- [ ] Integration with popular editors (VSCode, Cursor, Windsurf)
- [ ] Snippet templates for common code patterns
- [ ] Team-shared dictionaries
- [ ] Voice commands for formatting
- [ ] Integration with GitHub/GitLab for PR descriptions
- [ ] Mobile companion app

## License

MIT © 2024 Smart Transcription Daemon

## Inspiration

Built with inspiration from [Wispr Flow](https://wisprflow.ai/developers) - dictation built for developers.

## Support

For issues, questions, or feature requests:

- GitHub Issues: [Create an issue](https://github.com/yourusername/smart-transcription-daemon/issues)
- Email: support@smart-transcription-daemon.app

---

**Made with ❤️ for developers**
