import SwiftUI

#Preview("Default") {
    ProgressMetricsCard(metrics: ProgressMetrics(
        progress: 0.5,
        streakDays: 7,
        completedCount: 3,
        totalCount: 5
    ))
    .padding()
}

#Preview("Empty State") {
    ProgressMetricsCard(metrics: ProgressMetrics(
        progress: 0.0,
        streakDays: 0,
        completedCount: 0,
        totalCount: 0
    ))
    .padding()
}

#Preview("Complete") {
    ProgressMetricsCard(metrics: ProgressMetrics(
        progress: 1.0,
        streakDays: 365,
        completedCount: 10,
        totalCount: 10
    ))
    .padding()
}

#Preview("Large Values") {
    ProgressMetricsCard(metrics: ProgressMetrics(
        progress: 0.99,
        streakDays: 9999,
        completedCount: 99,
        totalCount: 100
    ))
    .padding()
}

#Preview("Dark Mode") {
    ProgressMetricsCard(metrics: ProgressMetrics(
        progress: 0.75,
        streakDays: 14,
        completedCount: 6,
        totalCount: 8
    ))
    .padding()
    .preferredColorScheme(.dark)
}
