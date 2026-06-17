// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "TinderApp",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "Components",
            targets: ["Components"]
        )
    ],
    targets: [
        .target(
            name: "Components",
            path: "Sources/Components"
        )
    ]
)
