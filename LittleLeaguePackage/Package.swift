// swift-tools-version: 6.1

import PackageDescription

let package = Package(
    name: "LittleLeagueFeature",
    platforms: [.iOS(.v17), .macOS(.v13)],
    products: [
        .library(name: "LittleLeagueFeature", targets: ["LittleLeagueFeature"]),
    ],
    targets: [
        .target(name: "LittleLeagueFeature", swiftSettings: [
            .enableExperimentalFeature("StrictConcurrency=minimal")
        ]),
    ]
)
