import Foundation

/// HTTP client for Ollama API — handles refinement and translation.
final class OllamaClient {
    private var baseUrl: String = "http://127.0.0.1:11434"
    private var refinementModel: String = "llama3.2:latest"
    private var translationModel: String = "translategemma:4b"
    private var prompt: String = ""
    private var currentTask: URLSessionDataTask?

    func configure(baseUrl: String, model: String, translationModel: String, prompt: String) {
        self.baseUrl = baseUrl.isEmpty ? "http://127.0.0.1:11434" : baseUrl
        self.refinementModel = model
        self.translationModel = translationModel
        self.prompt = prompt
    }

    /// Refine or translate text via Ollama.
    func enhance(text: String, targetLanguage: String?, sourceLanguage: String?) async throws -> String {
        let needsTranslation = targetLanguage != nil && sourceLanguage != nil && targetLanguage != sourceLanguage

        let model: String
        let userPrompt: String

        if needsTranslation {
            model = translationModel
            let sourceLang = languageName(for: sourceLanguage ?? "en")
            let targetLang = languageName(for: targetLanguage ?? "en")
            userPrompt = """
            Translate the following text from \(sourceLang) to \(targetLang). \
            Return ONLY the translated text, no explanations or formatting:

            \(text)
            """
        } else {
            model = refinementModel
            let systemPrompt = prompt.isEmpty
                ? "You are a helpful assistant that refines and corrects transcribed speech. Fix grammar, punctuation, and obvious transcription errors while preserving the original meaning. Return ONLY the corrected text."
                : prompt
            userPrompt = """
            \(systemPrompt)

            \(text)
            """
        }

        let url = URL(string: "\(baseUrl)/api/generate")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 30

        let body: [String: Any] = [
            "model": model,
            "prompt": userPrompt,
            "stream": false,
            "options": ["temperature": 0.1]
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        Log.info("Ollama \(needsTranslation ? "translation" : "refinement") with model: \(model)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? -1
            throw OllamaError.httpError(statusCode)
        }

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let responseText = json["response"] as? String else {
            throw OllamaError.invalidResponse
        }

        let cleaned = sanitizeResponse(responseText, original: text, isTranslation: needsTranslation)
        return cleaned
    }

    func cancel() {
        currentTask?.cancel()
        currentTask = nil
    }

    // MARK: - Private

    private func sanitizeResponse(_ response: String, original: String, isTranslation: Bool) -> String {
        var text = response.trimmingCharacters(in: .whitespacesAndNewlines)

        // Strip markdown code fences
        if text.hasPrefix("```") {
            if let endIndex = text.range(of: "\n")?.upperBound {
                text = String(text[endIndex...])
            }
            if text.hasSuffix("```") {
                text = String(text.dropLast(3))
            }
            text = text.trimmingCharacters(in: .whitespacesAndNewlines)
        }

        // Reject assistant-reply patterns
        let rejectPatterns = [
            "Here is the", "Here's the", "I've corrected", "I have corrected",
            "The corrected text", "Sure,", "Of course", "Certainly"
        ]
        for pattern in rejectPatterns {
            if text.hasPrefix(pattern) {
                Log.info("Rejected Ollama response (assistant pattern). Using original.")
                return original
            }
        }

        // For refinement (not translation), check token overlap
        if !isTranslation {
            let originalWords = Set(original.lowercased().split(separator: " "))
            let responseWords = Set(text.lowercased().split(separator: " "))
            let overlap = originalWords.intersection(responseWords)
            let overlapRatio = originalWords.isEmpty ? 0 : Double(overlap.count) / Double(originalWords.count)
            if overlapRatio < 0.3 {
                Log.info("Rejected Ollama response (too divergent: \(String(format: "%.0f", overlapRatio * 100))% overlap). Using original.")
                return original
            }
        }

        return text.isEmpty ? original : text
    }

    private func languageName(for code: String) -> String {
        let map: [String: String] = [
            "en": "English", "en-gb": "English", "en-us": "English",
            "pt": "Portuguese", "pt-pt": "Portuguese", "pt-br": "Brazilian Portuguese",
            "es": "Spanish", "es-es": "Spanish",
            "fr": "French", "fr-fr": "French",
            "de": "German", "de-de": "German",
            "it": "Italian", "it-it": "Italian",
            "ja": "Japanese", "zh": "Chinese",
            "ko": "Korean", "ru": "Russian",
            "ar": "Arabic", "hi": "Hindi",
            "nl": "Dutch", "pl": "Polish",
            "sv": "Swedish", "da": "Danish",
            "no": "Norwegian", "fi": "Finnish",
        ]
        return map[code.lowercased()] ?? code
    }
}

enum OllamaError: LocalizedError {
    case httpError(Int)
    case invalidResponse

    var errorDescription: String? {
        switch self {
        case .httpError(let code):
            return "Ollama HTTP error: \(code)"
        case .invalidResponse:
            return "Invalid Ollama response format"
        }
    }
}
