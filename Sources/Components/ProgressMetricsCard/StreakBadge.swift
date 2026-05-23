import SwiftUI

struct StreakBadge: View {
    let streakDays: Int

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "flame.fill")
                .foregroundStyle(streakDays > 0 ? .orange : Color(.systemGray3))
                .font(.title2)

            VStack(alignment: .leading, spacing: 2) {
                Text("\(streakDays)")
                    .font(.title2)
                    .fontWeight(.bold)
                    .monospacedDigit()
                    .contentTransition(.numericText())

                Text("day streak")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(streakDays) day streak")
    }
}
