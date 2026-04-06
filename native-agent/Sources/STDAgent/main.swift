import AppKit
import Foundation

/// Main application controller — wires IPC, hotkey, audio, transcription, and UI.
@main
final class STDAgentApp {
    static let shared = STDAgentApp()

    let ipcServer = IPCServer()
    let hotkeyManager = HotkeyManager()
    let audioCapture = AudioCaptureManager()
    let transcriber = WhisperTranscriber()
    let ollamaClient = OllamaClient()
    let textInserter = TextInserter()
    let bubbleWindow = BubbleWindowManager()
    let trayManager = TrayManager()
    let dictionaryCorrector = DictionaryCorrector()

    private var state: AgentState = .idle
    private var config: ConfigurePayload?
    private var targetLanguage: String?
    private var sourceLanguage: String?
    private var frontAppBeforeRecording: (name: String, bundleId: String)?

    static func main() {
        let app = NSApplication.shared
        app.setActivationPolicy(.accessory)  // No dock icon

        let agent = STDAgentApp.shared
        agent.setup()

        app.run()
    }

    func setup() {
        setupIPC()
        setupHotkey()
        setupAudioCallbacks()
        setupBubble()
        setupTray()

        do {
            try ipcServer.start()
        } catch {
            Log.error("Failed to start IPC server: \(error)")
        }

        Log.info("STDAgent started. Waiting for Electron connection...")

        // Check accessibility permission
        let trusted = AXIsProcessTrustedWithOptions(
            [kAXTrustedCheckOptionPrompt.takeUnretainedValue(): true] as CFDictionary
        )
        if !trusted {
            Log.info("Accessibility permission not yet granted. Hotkey may not work until granted.")
        }
    }

    // MARK: - State Machine

    private func transition(to newState: AgentState) {
        let previous = state
        state = newState
        Log.info("State: \(previous.rawValue) → \(newState.rawValue)")

        trayManager.updateState(newState)

        if config?.bubbleEnabled ?? true {
            switch newState {
            case .idle:
                bubbleWindow.hide()
            case .recording:
                bubbleWindow.show(state: .recording)
            case .processing:
                bubbleWindow.setState(.processing)
            }
        }

        ipcServer.send(type: "state-changed", payload: StateChangedPayload(
            state: newState.rawValue,
            previousState: previous.rawValue
        ))
    }

    // MARK: - Dictation Pipeline

    func startDictation(targetLanguage: String? = nil) {
        guard state == .idle else {
            Log.info("Cannot start dictation: state is \(state.rawValue)")
            return
        }

        self.targetLanguage = targetLanguage ?? config?.defaultDictationLanguage
        self.sourceLanguage = config?.sourceLanguage

        // Capture frontmost app BEFORE we potentially steal focus
        frontAppBeforeRecording = textInserter.getFrontmostApp()

        guard audioCapture.startCapture() else {
            ipcServer.send(type: "error", payload: ErrorPayload(
                code: "AUDIO_CAPTURE_FAILED",
                message: "Failed to start audio capture. Check microphone permission."
            ))
            return
        }

        transition(to: .recording)
        ipcServer.send(type: "hotkey-pressed", payload: HotkeyEventPayload(
            hotkey: config?.hotkey ?? ""
        ))
    }

    func stopDictation() {
        guard state == .recording else { return }

        transition(to: .processing)

        guard let wavData = audioCapture.stopCapture() else {
            ipcServer.send(type: "error", payload: ErrorPayload(
                code: "NO_AUDIO",
                message: "No audio was captured"
            ))
            transition(to: .idle)
            return
        }

        let language = sourceLanguage ?? "en"
        let targetLang = targetLanguage
        let sourceLang = sourceLanguage
        let sourceApp = frontAppBeforeRecording

        // Save audio for debugging
        let audioPath = saveDebugAudio(wavData)

        Task {
            do {
                // Step 1: Transcribe
                let rawText = try await transcriber.transcribe(wavData: wavData, language: language)
                Log.info("[Pipeline] STT original: \(rawText)")

                ipcServer.send(type: "transcription-result", payload: TranscriptionResultPayload(
                    text: rawText,
                    language: language
                ))

                // Step 2: Dictionary corrections
                var text = dictionaryCorrector.apply(to: rawText)
                if text != rawText {
                    Log.info("[Pipeline] Dictionary corrected: \(text)")
                }

                // Step 3: Ollama refinement/translation
                var ollamaText: String? = nil
                do {
                    let enhanced = try await ollamaClient.enhance(
                        text: text,
                        targetLanguage: targetLang,
                        sourceLanguage: sourceLang
                    )
                    let needsTranslation = targetLang != nil && sourceLang != nil && targetLang != sourceLang
                    if needsTranslation {
                        Log.info("[Pipeline] Ollama translation (\(sourceLang ?? "?") → \(targetLang ?? "?")): \(enhanced)")
                    } else {
                        Log.info("[Pipeline] Ollama refinement: \(enhanced)")
                    }
                    ollamaText = enhanced
                    text = enhanced
                } catch {
                    Log.error("[Pipeline] Ollama failed (using raw text): \(error)")
                }

                Log.info("[Pipeline] Final text: \(text)")

                // Step 4: Insert text
                let inserted = textInserter.insertText(text)
                if !inserted {
                    Log.error("[Pipeline] Text insertion failed")
                }

                // Step 5: Send result to Electron
                ipcServer.send(type: "pipeline-result", payload: PipelineResultPayload(
                    text: text,
                    rawText: rawText,
                    ollamaText: ollamaText,
                    language: targetLang ?? language,
                    sourceApp: sourceApp?.name,
                    audioPath: audioPath
                ))

                await MainActor.run {
                    transition(to: .idle)
                }
            } catch {
                Log.error("Pipeline error: \(error)")
                ipcServer.send(type: "error", payload: ErrorPayload(
                    code: "PIPELINE_ERROR",
                    message: error.localizedDescription
                ))
                await MainActor.run {
                    transition(to: .idle)
                }
            }
        }
    }

    func cancelDictation() {
        switch state {
        case .recording:
            audioCapture.cancelCapture()
        case .processing:
            transcriber.cancel()
            ollamaClient.cancel()
        case .idle:
            return
        }
        transition(to: .idle)
    }

    // MARK: - Setup

    private func setupIPC() {
        ipcServer.onMessage = { [weak self] type, data in
            DispatchQueue.main.async {
                self?.handleIPCMessage(type: type, data: data)
            }
        }
    }

    private func handleIPCMessage(type: String, data: Data) {
        let decoder = JSONDecoder()

        switch type {
        case "configure":
            guard let payload = try? decoder.decode(ConfigurePayload.self, from: data) else {
                Log.error("Invalid configure payload")
                return
            }
            applyConfiguration(payload)

        case "start-listening":
            let payload = try? decoder.decode(StartListeningPayload.self, from: data)
            startDictation(targetLanguage: payload?.targetLanguage)

        case "stop-listening":
            let payload = try? decoder.decode(StopListeningPayload.self, from: data)
            if let lang = payload?.targetLanguage { targetLanguage = lang }
            if let lang = payload?.sourceLanguage { sourceLanguage = lang }
            stopDictation()

        case "cancel":
            cancelDictation()

        case "set-bubble-state":
            if let payload = try? decoder.decode(SetBubbleStatePayload.self, from: data),
               let agentState = AgentState(rawValue: payload.state) {
                bubbleWindow.setState(agentState)
            }

        case "quit":
            Log.info("Quit requested via IPC")
            cleanup()
            NSApplication.shared.terminate(nil)

        default:
            Log.info("Unknown IPC message type: \(type)")
        }
    }

    private func applyConfiguration(_ payload: ConfigurePayload) {
        config = payload

        // Hotkey
        if !payload.hotkey.isEmpty {
            _ = hotkeyManager.register(hotkey: payload.hotkey)
        }

        // Whisper
        transcriber.configure(command: payload.whisperCommand, modelPath: payload.whisperModelPath)

        // Ollama
        ollamaClient.configure(
            baseUrl: payload.ollamaBaseUrl,
            model: payload.ollamaModel,
            translationModel: payload.ollamaTranslationModel,
            prompt: payload.ollamaPrompt
        )

        // Text inserter
        textInserter.configure(autoPasteEnabled: payload.autoPasteEnabled)

        // Dictionary
        dictionaryCorrector.configure(dictionary: payload.dictionary)

        Log.info("Configuration applied. Hotkey: \(payload.hotkey), Model: \(payload.whisperModelPath)")
    }

    private func setupHotkey() {
        hotkeyManager.onHotkeyPressed = { [weak self] in
            self?.startDictation()
        }
        hotkeyManager.onHotkeyReleased = { [weak self] in
            self?.stopDictation()
        }
    }

    private func setupAudioCallbacks() {
        audioCapture.onAudioLevel = { [weak self] rms, peak in
            self?.ipcServer.send(type: "audio-level", payload: AudioLevelPayload(rms: rms, peak: peak))
            self?.bubbleWindow.updateAudioLevel(rms: rms)
        }
        audioCapture.onSilenceTimeout = { [weak self] in
            Log.info("Silence timeout — stopping dictation")
            self?.stopDictation()
        }
    }

    private func setupBubble() {
        bubbleWindow.createWindow()
        bubbleWindow.onCancel = { [weak self] in
            self?.cancelDictation()
        }
    }

    private func setupTray() {
        trayManager.setup()
        trayManager.onToggleDictation = { [weak self] in
            guard let self = self else { return }
            switch self.state {
            case .idle:
                self.startDictation()
            case .recording:
                self.stopDictation()
            case .processing:
                self.cancelDictation()
            }
        }
        trayManager.onOpenSettings = { [weak self] in
            // Send IPC message to Electron to show settings window
            self?.ipcServer.send(type: "open-settings")
        }
        trayManager.onQuit = {
            STDAgentApp.shared.cleanup()
            NSApplication.shared.terminate(nil)
        }
    }

    func cleanup() {
        hotkeyManager.unregister()
        audioCapture.cancelCapture()
        bubbleWindow.destroy()
        ipcServer.stop()
    }

    // MARK: - Debug Audio

    private func saveDebugAudio(_ wavData: Data) -> String? {
        let debugDir = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent(".std-agent-debug")
        do {
            try FileManager.default.createDirectory(at: debugDir, withIntermediateDirectories: true)
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd_HH-mm-ss"
            let filename = "dictation_\(formatter.string(from: Date())).wav"
            let filePath = debugDir.appendingPathComponent(filename)
            try wavData.write(to: filePath)
            Log.info("[Debug] Audio saved: \(filePath.path) (\(wavData.count / 1024)KB)")

            // Keep only the last 20 files
            let files = try FileManager.default.contentsOfDirectory(at: debugDir, includingPropertiesForKeys: [.creationDateKey])
                .filter { $0.pathExtension == "wav" }
                .sorted { (a, b) in
                    let dateA = (try? a.resourceValues(forKeys: [.creationDateKey]).creationDate) ?? Date.distantPast
                    let dateB = (try? b.resourceValues(forKeys: [.creationDateKey]).creationDate) ?? Date.distantPast
                    return dateA < dateB
                }
            if files.count > 20 {
                for file in files.prefix(files.count - 20) {
                    try? FileManager.default.removeItem(at: file)
                }
            }
            return filePath.path
        } catch {
            Log.error("[Debug] Failed to save audio: \(error)")
            return nil
        }
    }
}
