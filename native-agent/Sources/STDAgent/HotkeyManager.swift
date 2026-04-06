import Cocoa
import Carbon.HIToolbox

/// Manages global hotkey registration via CGEvent taps.
final class HotkeyManager {
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var targetKeyCode: CGKeyCode = 0
    private var targetModifiers: CGEventFlags = []
    private var isHotkeyDown = false

    var onHotkeyPressed: (() -> Void)?
    var onHotkeyReleased: (() -> Void)?

    /// Parse an Electron-style accelerator string (e.g., "CommandOrControl+Shift+D")
    /// into a CGKeyCode and CGEventFlags.
    func register(hotkey: String) -> Bool {
        unregister()

        let parts = hotkey.split(separator: "+").map { String($0).trimmingCharacters(in: .whitespaces) }
        var modifiers: CGEventFlags = []
        var keyString = ""

        for part in parts {
            switch part.lowercased() {
            case "command", "cmd", "meta", "commandorcontrol", "cmdorctrl":
                modifiers.insert(.maskCommand)
            case "control", "ctrl":
                modifiers.insert(.maskControl)
            case "shift":
                modifiers.insert(.maskShift)
            case "alt", "option":
                modifiers.insert(.maskAlternate)
            default:
                keyString = part
            }
        }

        guard let keyCode = keyCodeForString(keyString) else {
            Log.error("Unknown key: \(keyString)")
            return false
        }

        targetKeyCode = keyCode
        targetModifiers = modifiers

        return installEventTap()
    }

    func unregister() {
        if let source = runLoopSource {
            CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes)
            runLoopSource = nil
        }
        if let tap = eventTap {
            CGEvent.tapEnable(tap: tap, enable: false)
            eventTap = nil
        }
        isHotkeyDown = false
    }

    // MARK: - Private

    private func installEventTap() -> Bool {
        let mask: CGEventMask = (1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.keyUp.rawValue) | (1 << CGEventType.flagsChanged.rawValue)

        let callback: CGEventTapCallBack = { proxy, type, event, refcon in
            guard let refcon = refcon else { return Unmanaged.passRetained(event) }
            let manager = Unmanaged<HotkeyManager>.fromOpaque(refcon).takeUnretainedValue()
            return manager.handleEvent(proxy: proxy, type: type, event: event)
        }

        let selfPtr = Unmanaged.passUnretained(self).toOpaque()

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .listenOnly,
            eventsOfInterest: mask,
            callback: callback,
            userInfo: selfPtr
        ) else {
            Log.error("Failed to create CGEvent tap. Accessibility permission may be required.")
            return false
        }

        eventTap = tap
        let source = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        runLoopSource = source
        CFRunLoopAddSource(CFRunLoopGetMain(), source, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)

        Log.info("Hotkey registered: keyCode=\(targetKeyCode), modifiers=\(targetModifiers.rawValue)")
        return true
    }

    private func handleEvent(proxy: CGEventTapProxy, type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        let keyCode = CGKeyCode(event.getIntegerValueField(.keyboardEventKeycode))
        let flags = event.flags

        // Check if our target modifiers are held
        let relevantFlags: CGEventFlags = [.maskCommand, .maskControl, .maskShift, .maskAlternate]
        let currentMods = flags.intersection(relevantFlags)
        let targetMods = targetModifiers.intersection(relevantFlags)

        switch type {
        case .keyDown:
            if keyCode == targetKeyCode && currentMods == targetMods && !isHotkeyDown {
                isHotkeyDown = true
                DispatchQueue.main.async { [weak self] in
                    self?.onHotkeyPressed?()
                }
            }
        case .keyUp:
            if keyCode == targetKeyCode && isHotkeyDown {
                isHotkeyDown = false
                DispatchQueue.main.async { [weak self] in
                    self?.onHotkeyReleased?()
                }
            }
        case .flagsChanged:
            // Handle modifier-only release while hotkey is held
            if isHotkeyDown && currentMods != targetMods {
                isHotkeyDown = false
                DispatchQueue.main.async { [weak self] in
                    self?.onHotkeyReleased?()
                }
            }
        default:
            break
        }

        return Unmanaged.passRetained(event)
    }

    /// Map a key string to a CGKeyCode.
    private func keyCodeForString(_ key: String) -> CGKeyCode? {
        let map: [String: CGKeyCode] = [
            "a": 0, "b": 11, "c": 8, "d": 2, "e": 14, "f": 3, "g": 5,
            "h": 4, "i": 34, "j": 38, "k": 40, "l": 37, "m": 46, "n": 45,
            "o": 31, "p": 35, "q": 12, "r": 15, "s": 1, "t": 17, "u": 32,
            "v": 9, "w": 13, "x": 7, "y": 16, "z": 6,
            "0": 29, "1": 18, "2": 19, "3": 20, "4": 21,
            "5": 23, "6": 22, "7": 26, "8": 28, "9": 25,
            "f1": 122, "f2": 120, "f3": 99, "f4": 118,
            "f5": 96, "f6": 97, "f7": 98, "f8": 100,
            "f9": 101, "f10": 109, "f11": 103, "f12": 111,
            "space": 49, "return": 36, "enter": 36, "tab": 48,
            "escape": 53, "delete": 51, "backspace": 51,
            "up": 126, "down": 125, "left": 123, "right": 124,
        ]
        return map[key.lowercased()]
    }
}
