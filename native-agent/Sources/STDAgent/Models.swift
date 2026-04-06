import Foundation

// MARK: - IPC Message Envelope

/// Every message over the socket is a JSON object with "type" + optional payload.
/// Newline-delimited JSON (one message per line).
struct IPCMessage: Codable {
    let type: String
    let payload: AnyCodable?
}

// MARK: - Commands (Electron → Agent)

struct ConfigurePayload: Codable {
    let hotkey: String
    let whisperCommand: String
    let whisperModelPath: String
    let sourceLanguage: String
    let defaultDictationLanguage: String
    let ollamaBaseUrl: String
    let ollamaModel: String
    let ollamaTranslationModel: String
    let ollamaPrompt: String
    let bubbleEnabled: Bool
    let autoPasteEnabled: Bool
    let dictionary: [String: String]  // word → correction
}

struct StartListeningPayload: Codable {
    let targetLanguage: String?
}

struct StopListeningPayload: Codable {
    let targetLanguage: String?
    let sourceLanguage: String?
}

struct SetBubbleStatePayload: Codable {
    let state: String  // "idle" | "recording" | "processing"
}

// MARK: - Events (Agent → Electron)

struct HotkeyEventPayload: Codable {
    let hotkey: String
}

struct TranscriptionResultPayload: Codable {
    let text: String
    let language: String
}

struct PipelineResultPayload: Codable {
    let text: String
    let rawText: String
    let ollamaText: String?
    let language: String
    let sourceApp: String?
    let audioPath: String?
}

struct AudioLevelPayload: Codable {
    let rms: Float
    let peak: Float
}

struct ErrorPayload: Codable {
    let code: String
    let message: String
}

struct StateChangedPayload: Codable {
    let state: String  // "idle" | "recording" | "processing"
    let previousState: String
}

// MARK: - Agent State

enum AgentState: String, Codable {
    case idle
    case recording
    case processing
}

// MARK: - AnyCodable helper for dynamic payloads

struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if container.decodeNil() {
            value = NSNull()
        } else if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([AnyCodable].self) {
            value = array.map { $0.value }
        } else if let dict = try? container.decode([String: AnyCodable].self) {
            value = dict.mapValues { $0.value }
        } else {
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Unsupported type")
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch value {
        case is NSNull:
            try container.encodeNil()
        case let bool as Bool:
            try container.encode(bool)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let string as String:
            try container.encode(string)
        case let array as [Any]:
            try container.encode(array.map { AnyCodable($0) })
        case let dict as [String: Any]:
            try container.encode(dict.mapValues { AnyCodable($0) })
        default:
            throw EncodingError.invalidValue(value, .init(codingPath: encoder.codingPath, debugDescription: "Unsupported type"))
        }
    }
}
