import SwiftUI

struct ProgressMetricsCard: View {
    let metrics: ProgressMetrics

    var body: some View {
        HStack(spacing: 16) {
            CircularProgressRing(progress: metrics.progress)
                .frame(width: 80, height: 80)

            VStack(alignment: .leading, spacing: 12) {
                StreakBadge(streakDays: metrics.streakDays)
                CompletionCounter(completed: metrics.completedCount, total: metrics.totalCount)
            }

            Spacer(minLength: 0)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemBackground))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(.systemGray5), lineWidth: 1)
        )
        .shadow(color: Color(.systemGray4).opacity(0.5), radius: 8, x: 0, y: 2)
    }
}
