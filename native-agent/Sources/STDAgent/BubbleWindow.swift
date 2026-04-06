import AppKit
import SwiftUI
import Combine

/// Observable model for audio levels, shared between manager and SwiftUI view.
final class AudioLevelModel: ObservableObject {
    @Published var levels: [CGFloat] = Array(repeating: 0, count: 7)

    func push(_ rms: Float) {
        let normalized = CGFloat(min(1.0, rms / 0.15))  // normalize RMS to 0..1
        var newLevels = levels
        newLevels.removeFirst()
        newLevels.append(normalized)
        levels = newLevels
    }

    func reset() {
        levels = Array(repeating: 0, count: 7)
    }
}

/// Floating bubble window — small, always-on-top, non-activating indicator.
final class BubbleWindowManager {
    private var window: NSPanel?
    private var hostingView: NSHostingView<BubbleView>?
    private var currentState: AgentState = .idle
    private var displayTracker: DispatchSourceTimer?
    private let audioModel = AudioLevelModel()

    var onCancel: (() -> Void)?

    func createWindow() {
        let bubbleView = BubbleView(state: .constant(.idle), audioModel: audioModel, onCancel: { [weak self] in
            self?.onCancel?()
        })
        let hosting = NSHostingView(rootView: bubbleView)
        hosting.frame = NSRect(x: 0, y: 0, width: 64, height: 64)

        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 64, height: 64),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        panel.isFloatingPanel = true
        panel.level = .statusBar
        panel.backgroundColor = .clear
        panel.isOpaque = false
        panel.hasShadow = false
        panel.isMovableByWindowBackground = true
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        panel.contentView = hosting

        // Position at bottom-center of main screen
        if let screen = NSScreen.main {
            let screenFrame = screen.visibleFrame
            let x = screenFrame.midX - 32
            let y = screenFrame.minY + 40
            panel.setFrameOrigin(NSPoint(x: x, y: y))
        }

        self.window = panel
        self.hostingView = hosting

        // Show immediately in idle state
        panel.orderFront(nil)

        startDisplayTracking()
    }

    func show(state: AgentState = .recording) {
        setState(state)
        window?.alphaValue = 1.0
        window?.orderFront(nil)
    }

    func hide() {
        setState(.idle)
        audioModel.reset()
        // Fade to subtle idle appearance instead of hiding completely
        NSAnimationContext.runAnimationGroup { context in
            context.duration = 0.6
            window?.animator().alphaValue = 0.4
        }
    }

    func setState(_ state: AgentState) {
        currentState = state
        if state != .recording {
            audioModel.reset()
        }
        let bubbleView = BubbleView(state: .constant(state), audioModel: audioModel, onCancel: { [weak self] in
            self?.onCancel?()
        })
        hostingView?.rootView = bubbleView
    }

    func updateAudioLevel(rms: Float) {
        audioModel.push(rms)
    }

    func destroy() {
        displayTracker?.cancel()
        displayTracker = nil
        window?.close()
        window = nil
    }

    // MARK: - Private

    private func startDisplayTracking() {
        let timer = DispatchSource.makeTimerSource(queue: DispatchQueue.main)
        timer.schedule(deadline: .now() + 1, repeating: 1)
        timer.setEventHandler { [weak self] in
            self?.checkDisplayChange()
        }
        timer.resume()
        displayTracker = timer
    }

    private func checkDisplayChange() {
        guard let window = window else { return }
        let mouseLocation = NSEvent.mouseLocation
        guard let currentScreen = NSScreen.screens.first(where: { $0.frame.contains(mouseLocation) }),
              let windowScreen = window.screen,
              currentScreen != windowScreen else { return }

        let screenFrame = currentScreen.visibleFrame
        let x = screenFrame.midX - 32
        let y = screenFrame.minY + 40
        window.setFrameOrigin(NSPoint(x: x, y: y))
    }
}

// MARK: - SwiftUI Bubble View

struct BubbleView: View {
    @Binding var state: AgentState
    @ObservedObject var audioModel: AudioLevelModel
    let onCancel: () -> Void

    var body: some View {
        ZStack {
            Circle()
                .fill(backgroundColor)
                .frame(width: 48, height: 48)
                .opacity(state == .idle ? 0.5 : 0.9)

            if state == .recording {
                // Waveform bars showing live audio levels
                WaveformView(levels: audioModel.levels)
                    .frame(width: 30, height: 24)
            } else {
                Image(systemName: iconName)
                    .font(.system(size: 20))
                    .foregroundColor(.white)
            }

            if state == .processing {
                Button(action: onCancel) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                }
                .buttonStyle(.plain)
                .offset(x: 18, y: -18)
            }
        }
        .frame(width: 64, height: 64)
    }

    private var backgroundColor: Color {
        switch state {
        case .idle: return .gray
        case .recording: return .red
        case .processing: return .orange
        }
    }

    private var iconName: String {
        switch state {
        case .idle: return "mic"
        case .recording: return "stop.fill"
        case .processing: return "ellipsis"
        }
    }
}

// MARK: - Waveform Visualization

struct WaveformView: View {
    let levels: [CGFloat]
    private let barWidth: CGFloat = 2.5
    private let barSpacing: CGFloat = 1.5
    private let minHeight: CGFloat = 2

    var body: some View {
        HStack(spacing: barSpacing) {
            ForEach(0..<levels.count, id: \.self) { i in
                RoundedRectangle(cornerRadius: barWidth / 2)
                    .fill(Color.white)
                    .frame(width: barWidth, height: barHeight(for: levels[i]))
                    .animation(.easeOut(duration: 0.08), value: levels[i])
            }
        }
    }

    private func barHeight(for level: CGFloat) -> CGFloat {
        let maxHeight: CGFloat = 22
        return max(minHeight, level * maxHeight)
    }
}
