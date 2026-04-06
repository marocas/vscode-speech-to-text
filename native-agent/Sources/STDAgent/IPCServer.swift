import Foundation
import Network

/// Unix domain socket IPC server.
/// Accepts one client at a time (the Electron main process).
/// Protocol: newline-delimited JSON messages.
final class IPCServer {
    private var listener: NWListener?
    private var connection: NWConnection?
    private let socketPath: String
    private let queue = DispatchQueue(label: "com.std-agent.ipc", qos: .userInitiated)
    private var buffer = Data()

    var onMessage: ((String, Data) -> Void)?  // (type, rawPayloadJSON)
    var onClientConnected: (() -> Void)?
    var onClientDisconnected: (() -> Void)?

    init(socketPath: String? = nil) {
        self.socketPath = socketPath ?? {
            let home = FileManager.default.homeDirectoryForCurrentUser.path
            return "\(home)/.std-agent.sock"
        }()
    }

    func start() throws {
        // Remove stale socket file
        try? FileManager.default.removeItem(atPath: socketPath)

        let params = NWParameters()
        params.defaultProtocolStack.transportProtocol = NWProtocolTCP.Options()
        params.requiredLocalEndpoint = NWEndpoint.unix(path: socketPath)

        let listener = try NWListener(using: params)
        self.listener = listener

        listener.stateUpdateHandler = { [weak self] state in
            switch state {
            case .ready:
                Log.info("IPC server listening on \(self?.socketPath ?? "?")")
            case .failed(let error):
                Log.error("IPC listener failed: \(error)")
                self?.stop()
            default:
                break
            }
        }

        listener.newConnectionHandler = { [weak self] newConnection in
            self?.handleNewConnection(newConnection)
        }

        listener.start(queue: queue)
    }

    func stop() {
        connection?.cancel()
        connection = nil
        listener?.cancel()
        listener = nil
        try? FileManager.default.removeItem(atPath: socketPath)
    }

    func send(type: String, payload: Encodable? = nil) {
        guard let connection = connection else { return }

        do {
            var json: [String: Any] = ["type": type]
            if let payload = payload {
                let data = try JSONEncoder().encode(payload)
                if let dict = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    json["payload"] = dict
                }
            }
            var data = try JSONSerialization.data(withJSONObject: json)
            data.append(contentsOf: [0x0A])  // newline delimiter
            connection.send(content: data, completion: .contentProcessed { error in
                if let error = error {
                    Log.error("IPC send error: \(error)")
                }
            })
        } catch {
            Log.error("IPC encode error: \(error)")
        }
    }

    // MARK: - Private

    private func handleNewConnection(_ newConnection: NWConnection) {
        // Replace existing connection
        connection?.cancel()
        connection = newConnection
        buffer = Data()

        newConnection.stateUpdateHandler = { [weak self] state in
            switch state {
            case .ready:
                Log.info("IPC client connected")
                self?.onClientConnected?()
            case .cancelled, .failed:
                Log.info("IPC client disconnected")
                self?.connection = nil
                self?.onClientDisconnected?()
            default:
                break
            }
        }

        newConnection.start(queue: queue)
        receiveLoop(newConnection)
    }

    private func receiveLoop(_ connection: NWConnection) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] data, _, isComplete, error in
            if let data = data, !data.isEmpty {
                self?.buffer.append(data)
                self?.processBuffer()
            }
            if isComplete || error != nil {
                connection.cancel()
                return
            }
            self?.receiveLoop(connection)
        }
    }

    private func processBuffer() {
        while let newlineIndex = buffer.firstIndex(of: 0x0A) {
            let lineData = buffer[buffer.startIndex..<newlineIndex]
            buffer = Data(buffer[buffer.index(after: newlineIndex)...])

            guard !lineData.isEmpty else { continue }

            do {
                if let json = try JSONSerialization.jsonObject(with: lineData) as? [String: Any],
                   let type = json["type"] as? String {
                    let payloadData: Data
                    if let payload = json["payload"], !(payload is NSNull) {
                        payloadData = try JSONSerialization.data(withJSONObject: payload)
                    } else {
                        payloadData = Data()
                    }
                    onMessage?(type, payloadData)
                }
            } catch {
                Log.error("IPC parse error: \(error)")
            }
        }
    }
}
