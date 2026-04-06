import AppKit

/// Menu bar tray icon with status and quick actions.
final class TrayManager {
    private var statusItem: NSStatusItem?
    private var currentState: AgentState = .idle

    var onToggleDictation: (() -> Void)?
    var onOpenSettings: (() -> Void)?
    var onQuit: (() -> Void)?

    func setup() {
        let statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)

        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "mic", accessibilityDescription: "STD Agent")
            button.image?.size = NSSize(width: 18, height: 18)
            button.image?.isTemplate = true
        }

        let menu = NSMenu()
        menu.addItem(NSMenuItem(title: "Start Dictation", action: #selector(toggleDictation), keyEquivalent: ""))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "Open Settings…", action: #selector(openSettings), keyEquivalent: ","))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "Quit STD Agent", action: #selector(quit), keyEquivalent: "q"))

        // Set target for all items
        for item in menu.items where item.action != nil {
            item.target = self
        }

        statusItem.menu = menu
        self.statusItem = statusItem
    }

    func updateState(_ state: AgentState) {
        currentState = state
        guard let button = statusItem?.button else { return }

        let iconName: String
        switch state {
        case .idle:
            iconName = "mic"
            statusItem?.menu?.items.first?.title = "Start Dictation"
        case .recording:
            iconName = "mic.fill"
            statusItem?.menu?.items.first?.title = "Stop Recording"
        case .processing:
            iconName = "ellipsis.circle"
            statusItem?.menu?.items.first?.title = "Cancel Processing"
        }

        button.image = NSImage(systemSymbolName: iconName, accessibilityDescription: "STD Agent")
        button.image?.size = NSSize(width: 18, height: 18)
        button.image?.isTemplate = true
    }

    // MARK: - Actions

    @objc private func toggleDictation() {
        onToggleDictation?()
    }

    @objc private func openSettings() {
        onOpenSettings?()
    }

    @objc private func quit() {
        onQuit?()
    }
}
