import SwiftUI

struct CompletionCounter: View {
    let completed: Int
    let total: Int

    private var isAllComplete: Bool {
        total > 0 && completed >= total
    }

    private var hasNoGoals: Bool {
        total == 0
    }

    var body: some View {
        HStack(spacing: 6) {
            if isAllComplete {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundStyle(.green)
                    .font(.body)
            }

            if hasNoGoals {
                Text("No goals set")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            } else {
                Text("\(completed) of \(total) completed")
                    .font(.subheadline)
                    .monospacedDigit()
                    .contentTransition(.numericText())
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(hasNoGoals ? "No goals set" : "\(completed) of \(total) completed")
    }
}
