import Foundation

/// Transcribes audio WAV data using whisper-cli subprocess.
/// Future: replace with direct whisper.cpp C binding for zero-overhead.
final class WhisperTranscriber {
    private var whisperCommand: String = "whisper-cli"
    private var modelPath: String = ""
    private var currentProcess: Process?

    func configure(command: String, modelPath: String) {
        self.whisperCommand = command.isEmpty ? "whisper-cli" : command
        self.modelPath = modelPath
    }

    /// Transcribe WAV audio data. Returns the transcription text.
    func transcribe(wavData: Data, language: String) async throws -> String {
        guard !modelPath.isEmpty else {
            throw TranscriberError.noModel
        }

        let tempDir = FileManager.default.temporaryDirectory
        let wavPath = tempDir.appendingPathComponent("std-agent-\(UUID().uuidString).wav")
        let outputPrefix = tempDir.appendingPathComponent("std-agent-\(UUID().uuidString)")
        let outputTxtPath = URL(fileURLWithPath: outputPrefix.path + ".txt")

        defer {
            try? FileManager.default.removeItem(at: wavPath)
            try? FileManager.default.removeItem(at: outputTxtPath)
        }

        // Write WAV to temp file
        try wavData.write(to: wavPath)

        // Resolve whisper command
        let command = resolveCommand(whisperCommand)
        guard FileManager.default.isExecutableFile(atPath: command) else {
            throw TranscriberError.commandNotFound(command)
        }

        // Run whisper-cli
        let process = Process()
        currentProcess = process
        process.executableURL = URL(fileURLWithPath: command)
        process.arguments = [
            "-m", modelPath,
            "-f", wavPath.path,
            "-l", language.prefix(2).lowercased(),  // whisper uses 2-letter codes
            "--output-txt",
            "--output-file", outputPrefix.path
        ]

        let stderrPipe = Pipe()
        process.standardError = stderrPipe
        process.standardOutput = Pipe()  // suppress stdout

        Log.info("Running: \(command) -m \(modelPath) -f \(wavPath.path) -l \(language.prefix(2))")

        return try await withCheckedThrowingContinuation { continuation in
            process.terminationHandler = { [weak self] proc in
                self?.currentProcess = nil

                if proc.terminationStatus != 0 {
                    let stderrData = stderrPipe.fileHandleForReading.readDataToEndOfFile()
                    let stderr = String(data: stderrData, encoding: .utf8) ?? ""
                    continuation.resume(throwing: TranscriberError.processFailed(Int(proc.terminationStatus), stderr))
                    return
                }

                do {
                    let text = try String(contentsOf: outputTxtPath, encoding: .utf8)
                        .trimmingCharacters(in: .whitespacesAndNewlines)
                    if text.isEmpty {
                        continuation.resume(throwing: TranscriberError.emptyResult)
                    } else {
                        continuation.resume(returning: text)
                    }
                } catch {
                    continuation.resume(throwing: TranscriberError.outputReadFailed(error))
                }
            }

            do {
                try process.run()
            } catch {
                continuation.resume(throwing: TranscriberError.launchFailed(error))
            }
        }
    }

    func cancel() {
        currentProcess?.terminate()
        currentProcess = nil
    }

    // MARK: - Private

    private func resolveCommand(_ command: String) -> String {
        if command.hasPrefix("/") {
            return command
        }
        // Try common locations
        let candidates = [
            "/opt/homebrew/bin/\(command)",
            "/usr/local/bin/\(command)",
            "\(FileManager.default.homeDirectoryForCurrentUser.path)/.local/bin/\(command)",
            "/usr/bin/\(command)"
        ]
        for candidate in candidates {
            if FileManager.default.isExecutableFile(atPath: candidate) {
                return candidate
            }
        }
        return command
    }
}

enum TranscriberError: LocalizedError {
    case noModel
    case commandNotFound(String)
    case processFailed(Int, String)
    case emptyResult
    case outputReadFailed(Error)
    case launchFailed(Error)

    var errorDescription: String? {
        switch self {
        case .noModel:
            return "No whisper model configured"
        case .commandNotFound(let cmd):
            return "Whisper command not found: \(cmd)"
        case .processFailed(let code, let stderr):
            return "Whisper process exited with code \(code): \(stderr)"
        case .emptyResult:
            return "Whisper produced empty transcription"
        case .outputReadFailed(let error):
            return "Failed to read whisper output: \(error)"
        case .launchFailed(let error):
            return "Failed to launch whisper: \(error)"
        }
    }
}
