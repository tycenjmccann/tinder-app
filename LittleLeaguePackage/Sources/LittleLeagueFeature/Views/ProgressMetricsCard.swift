import SwiftUI

struct ProgressMetricsCard: View {
    @ObservedObject var metrics: DailyMetricsManager

    private var todayMetrics: DailyMetrics {
        metrics.getTodayMetrics()
    }

    private var progress: Double {
        guard todayMetrics.dailyGoal > 0 else { return 0 }
        return min(Double(todayMetrics.cardsCompleted) / Double(todayMetrics.dailyGoal), 1.0)
    }

    var body: some View {
        HStack(spacing: 16) {
            CircularProgressRing(progress: progress)

            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 6) {
                    Image(systemName: "flame.fill")
                        .foregroundColor(.orange)
                    Text("\(todayMetrics.currentStreak)")
                        .font(.system(.title2, design: .rounded, weight: .bold))
                    Text("day streak")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("\(todayMetrics.currentStreak) day streak")

                HStack(spacing: 6) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.accentColor)
                    Text("\(todayMetrics.cardsCompleted) / \(todayMetrics.dailyGoal)")
                        .font(.system(.title2, design: .rounded, weight: .bold))
                    Text("today")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("\(todayMetrics.cardsCompleted) of \(todayMetrics.dailyGoal) cards completed today")
            }

            Spacer()
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(Color(.secondarySystemBackground))
                .shadow(color: .black.opacity(0.08), radius: 4, x: 0, y: 2)
        )
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Daily progress")
    }
}

#Preview("Fresh Start") {
    ProgressMetricsCard(metrics: DailyMetricsManager())
        .padding()
}
