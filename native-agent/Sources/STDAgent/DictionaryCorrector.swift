import Foundation

/// Applies dictionary corrections to transcribed text.
final class DictionaryCorrector {
    private var dictionary: [String: String] = [:]

    func configure(dictionary: [String: String]) {
        // Normalize keys to lowercase
        self.dictionary = Dictionary(uniqueKeysWithValues: dictionary.map { ($0.key.lowercased(), $0.value) })
    }

    /// Apply word replacements (case-insensitive, whole-word matching).
    func apply(to text: String) -> String {
        guard !dictionary.isEmpty else { return text }

        var result = text
        for (word, replacement) in dictionary {
            // Whole-word, case-insensitive replacement
            let pattern = "\\b\(NSRegularExpression.escapedPattern(for: word))\\b"
            guard let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) else { continue }
            result = regex.stringByReplacingMatches(
                in: result,
                range: NSRange(result.startIndex..., in: result),
                withTemplate: replacement
            )
        }
        return result
    }
}
