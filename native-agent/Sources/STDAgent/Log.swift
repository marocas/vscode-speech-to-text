import Foundation

/// Simple logger with levels
enum Log {
    static func info(_ message: String) {
        print("[STDAgent] INFO: \(message)")
    }

    static func error(_ message: String) {
        fputs("[STDAgent] ERROR: \(message)\n", stderr)
    }

    static func debug(_ message: String) {
        #if DEBUG
        print("[STDAgent] DEBUG: \(message)")
        #endif
    }
}
