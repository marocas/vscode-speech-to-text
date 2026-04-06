import AVFoundation
import Accelerate

/// Captures audio from the default input device using AVAudioEngine.
/// Provides raw PCM Float32 samples, RMS levels, and silence detection.
final class AudioCaptureManager {
    private let engine = AVAudioEngine()
    private var pcmBuffer = Data()
    private var silenceTimer: DispatchSourceTimer?
    private var lastSoundTime: Date = Date()
    private let silenceTimeoutSeconds: TimeInterval = 2.5
    private let silenceRMSThreshold: Float = 0.01

    var onAudioLevel: ((Float, Float) -> Void)?   // (rms, peak)
    var onSilenceTimeout: (() -> Void)?

    /// Start capturing audio from the microphone.
    /// Returns true if capture started successfully.
    func startCapture() -> Bool {
        pcmBuffer = Data()
        lastSoundTime = Date()

        let inputNode = engine.inputNode
        let format = inputNode.outputFormat(forBus: 0)

        guard format.sampleRate > 0 else {
            Log.error("No audio input device available")
            return false
        }

        Log.info("Audio capture starting: \(format.sampleRate)Hz, \(format.channelCount)ch")

        inputNode.installTap(onBus: 0, bufferSize: 4096, format: format) { [weak self] buffer, _ in
            self?.processAudioBuffer(buffer)
        }

        do {
            try engine.start()
            startSilenceDetection()
            return true
        } catch {
            Log.error("Failed to start audio engine: \(error)")
            return false
        }
    }

    /// Stop capturing and return the recorded audio as 16-bit mono WAV data.
    func stopCapture() -> Data? {
        stopSilenceDetection()
        engine.inputNode.removeTap(onBus: 0)
        engine.stop()

        guard !pcmBuffer.isEmpty else {
            Log.error("No audio captured")
            return nil
        }

        let sampleRate = engine.inputNode.outputFormat(forBus: 0).sampleRate
        return encodeAsWAV(pcmData: pcmBuffer, sampleRate: sampleRate > 0 ? sampleRate : 16000)
    }

    func cancelCapture() {
        stopSilenceDetection()
        engine.inputNode.removeTap(onBus: 0)
        engine.stop()
        pcmBuffer = Data()
    }

    // MARK: - Private

    private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
        guard let channelData = buffer.floatChannelData else { return }
        let frameCount = Int(buffer.frameLength)
        let channelCount = Int(buffer.format.channelCount)

        // Compute RMS and peak from first channel
        let samples = channelData[0]
        var rms: Float = 0
        var peak: Float = 0
        vDSP_rmsqv(samples, 1, &rms, vDSP_Length(frameCount))
        vDSP_maxmgv(samples, 1, &peak, vDSP_Length(frameCount))

        // Notify audio level
        DispatchQueue.main.async { [weak self] in
            self?.onAudioLevel?(rms, peak)
        }

        // Track silence
        if rms > silenceRMSThreshold {
            lastSoundTime = Date()
        }

        // Convert to mono 16-bit PCM and append to buffer
        for i in 0..<frameCount {
            var monoSample: Float = 0
            for ch in 0..<channelCount {
                monoSample += channelData[ch][i]
            }
            monoSample /= Float(channelCount)

            // Clamp and convert to Int16
            let clamped = max(-1.0, min(1.0, monoSample))
            var int16 = Int16(clamped * Float(Int16.max))
            pcmBuffer.append(Data(bytes: &int16, count: 2))
        }
    }

    private func startSilenceDetection() {
        let timer = DispatchSource.makeTimerSource(queue: DispatchQueue.main)
        timer.schedule(deadline: .now() + 0.5, repeating: 0.5)
        timer.setEventHandler { [weak self] in
            guard let self = self else { return }
            let elapsed = Date().timeIntervalSince(self.lastSoundTime)
            if elapsed > self.silenceTimeoutSeconds {
                Log.info("Silence timeout after \(String(format: "%.1f", elapsed))s")
                self.onSilenceTimeout?()
            }
        }
        timer.resume()
        silenceTimer = timer
    }

    private func stopSilenceDetection() {
        silenceTimer?.cancel()
        silenceTimer = nil
    }

    /// Encode raw 16-bit PCM data as a WAV file.
    private func encodeAsWAV(pcmData: Data, sampleRate: Double) -> Data {
        let numChannels: UInt16 = 1
        let bitsPerSample: UInt16 = 16
        let byteRate = UInt32(sampleRate) * UInt32(numChannels) * UInt32(bitsPerSample / 8)
        let blockAlign = numChannels * (bitsPerSample / 8)
        let dataSize = UInt32(pcmData.count)
        let fileSize = 36 + dataSize

        var wav = Data()

        // RIFF header
        wav.append(contentsOf: "RIFF".utf8)
        wav.append(littleEndian: fileSize)
        wav.append(contentsOf: "WAVE".utf8)

        // fmt chunk
        wav.append(contentsOf: "fmt ".utf8)
        wav.append(littleEndian: UInt32(16))          // chunk size
        wav.append(littleEndian: UInt16(1))            // PCM format
        wav.append(littleEndian: numChannels)
        wav.append(littleEndian: UInt32(sampleRate))
        wav.append(littleEndian: byteRate)
        wav.append(littleEndian: blockAlign)
        wav.append(littleEndian: bitsPerSample)

        // data chunk
        wav.append(contentsOf: "data".utf8)
        wav.append(littleEndian: dataSize)
        wav.append(pcmData)

        return wav
    }
}

// MARK: - Data extension for little-endian writes

private extension Data {
    mutating func append(littleEndian value: UInt16) {
        var v = value.littleEndian
        append(Data(bytes: &v, count: 2))
    }
    mutating func append(littleEndian value: UInt32) {
        var v = value.littleEndian
        append(Data(bytes: &v, count: 4))
    }
}
