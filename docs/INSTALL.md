# Installing Smart Transcription Daemon (macOS)

## Prerequisites

- **Ollama** — Install from [ollama.com](https://ollama.com) and pull a model:
  ```bash
  ollama pull translategemma:4b
  ```
- **Whisper** — Install whisper-cpp via Homebrew:
  ```bash
  brew install whisper-cpp
  ```
  Verify: `which whisper-cli` or `which whisper-cpp`

## Install

1. Download the latest `.dmg` from the releases
2. Open the `.dmg` and drag **Smart Transcription Daemon** to `/Applications`
3. **Important** — Before opening, run this in Terminal to remove the quarantine flag:
   ```bash
   xattr -cr /Applications/Smart\ Transcription\ Daemon.app
   ```
4. Open the app from `/Applications`

## Why is step 3 needed?

The app is ad-hoc signed (not notarized with Apple). macOS Gatekeeper blocks apps that aren't signed with an Apple Developer ID. The `xattr -cr` command removes the quarantine attribute so macOS allows it to run.

This is a one-time step — you won't need to do it again unless you reinstall.

## Permissions

On first launch, macOS will ask for:

- **Microphone** — Required for voice dictation
- **Accessibility** — Required for global hotkeys and text insertion

Grant both in **System Settings → Privacy & Security**.

## Updating

When installing a new version, repeat steps 1–3.
