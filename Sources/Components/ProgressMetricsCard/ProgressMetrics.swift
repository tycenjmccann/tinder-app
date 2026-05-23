import Foundation

struct ProgressMetrics: Sendable {
    let progress: Double
    let streakDays: Int
    let completedCount: Int
    let totalCount: Int

    var clampedProgress: Double {
        min(max(progress, 0.0), 1.0)
    }

    var progressPercentage: Int {
        Int(clampedProgress * 100)
    }
}
