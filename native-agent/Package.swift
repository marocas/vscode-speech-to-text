// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "STDAgent",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "STDAgent", targets: ["STDAgent"])
    ],
    targets: [
        .executableTarget(
            name: "STDAgent",
            swiftSettings: [
                .unsafeFlags(["-parse-as-library"])
            ],
            linkerSettings: [
                .linkedFramework("AVFoundation"),
                .linkedFramework("CoreGraphics"),
                .linkedFramework("AppKit"),
                .linkedFramework("Network"),
                .linkedFramework("Carbon"),
            ]
        ),
    ]
)
