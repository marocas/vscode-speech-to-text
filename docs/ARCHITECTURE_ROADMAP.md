# Architecture Roadmap

## Current Latency Bottlenecks

- Subprocess spawn overhead: ~200–400ms per request
- No streaming: entire clip must be recorded before transcription starts
- Ollama refinement adds 1–5s on modest hardware
- `MediaRecorder` in Chromium adds encoding/buffering overhead

## Improvement Roadmap

| Gap                                          | Impact      | Effort     |
| -------------------------------------------- | ----------- | ---------- |
| Streaming/windowed Whisper                   | Very high   | High       |
| Native whisper binding (no subprocess spawn) | High        | High       |
| Voice Activity Detection (auto start/stop)   | High (feel) | Medium     |
| Make Ollama refinement non-blocking/async    | Medium      | Low–Medium |
| Native audio capture (replace MediaRecorder) | Medium      | Medium     |

## Quick Win

Native whisper binding + async Ollama = ~80% of perceived speed gain.

Full parity = significant architectural rewrite of the recording pipeline.

---

## Hybrid Architecture (Recommended Path)

Keep the Electron app for UI/settings/history. Add a lightweight **platform-specific native agent** for OS-level integration that Electron can't do well.

### Why Hybrid?

- **Text insertion** is the biggest gap — Electron is limited to clipboard paste simulation. Native code can use OS APIs for seamless insertion into the active app.
- **Memory/battery** — Electron idles at ~100–200MB vs ~10–20MB for a native agent.
- **OS integration** — global hotkeys, tray, floating overlays are all better natively.

### Architecture

```
Electron App (UI, settings, history, LLM config, Prisma DB)
    ↕ JSON IPC (stdin/stdout, Unix socket, or named pipe)
Native Agent (platform-specific binary)
    → global hotkey listener
    → audio capture + Whisper
    → text insertion into active app
    → floating bubble window
    → tray icon
```

### Platform-Specific Agents

| Platform | Language         | Text Insertion                  | Global Hotkey       |
| -------- | ---------------- | ------------------------------- | ------------------- |
| macOS    | Swift (or Obj-C) | `CGEvent` / Accessibility API   | `CGEvent.tapCreate` |
| Windows  | C# (.NET) / Rust | `SendInput` / UI Automation     | `RegisterHotKey`    |
| Linux    | Rust / C         | `xdotool` / `ydotool` (Wayland) | `XGrabKey` / D-Bus  |

### Single-Codebase Option: Rust

Rust compiles to all three platforms and has good libraries for OS-level input (`enigo`, `rdev`). Core logic is shared, with platform modules behind `#[cfg(target_os)]`. Binary size is ~2–5MB.

### Reference Apps Using This Pattern

- **1Password** — Electron UI + native agent for autofill
- **Raycast** — native core + web-tech extensions
- **Wispr Flow** — fully native (Swift) for maximum OS integration
