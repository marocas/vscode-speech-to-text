import AppKit
import CoreGraphics

/// Handles text insertion into the active app via clipboard + CGEvent Cmd+V.
/// Also detects the frontmost application.
final class TextInserter {
    private var autoPasteEnabled: Bool = true

    func configure(autoPasteEnabled: Bool) {
        self.autoPasteEnabled = autoPasteEnabled
    }

    /// Get info about the currently focused application.
    func getFrontmostApp() -> (name: String, bundleId: String)? {
        guard let app = NSWorkspace.shared.frontmostApplication else { return nil }
        return (
            name: app.localizedName ?? "Unknown",
            bundleId: app.bundleIdentifier ?? ""
        )
    }

    /// Insert text by writing to clipboard and simulating Cmd+V.
    func insertText(_ text: String) -> Bool {
        guard autoPasteEnabled else {
            Log.info("Auto-paste disabled, text copied to clipboard only")
            copyToClipboard(text)
            return true
        }

        copyToClipboard(text)

        // Small delay to ensure clipboard is ready
        usleep(50_000)  // 50ms

        return simulatePaste()
    }

    // MARK: - Private

    private func copyToClipboard(_ text: String) {
        let pasteboard = NSPasteboard.general
        pasteboard.clearContents()
        pasteboard.setString(text, forType: .string)
    }

    private func simulatePaste() -> Bool {
        let source = CGEventSource(stateID: .combinedSessionState)

        // Key code 9 = 'V'
        guard let keyDown = CGEvent(keyboardEventSource: source, virtualKey: 9, keyDown: true),
              let keyUp = CGEvent(keyboardEventSource: source, virtualKey: 9, keyDown: false) else {
            Log.error("Failed to create CGEvent for paste")
            return false
        }

        keyDown.flags = .maskCommand
        keyUp.flags = .maskCommand

        keyDown.post(tap: .cgSessionEventTap)
        keyUp.post(tap: .cgSessionEventTap)

        return true
    }
}
