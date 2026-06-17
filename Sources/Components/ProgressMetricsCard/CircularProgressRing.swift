import SwiftUI

struct CircularProgressRing: View {
    let progress: Double
    var ringColor: Color = .accentColor
    var strokeWidth: CGFloat = 12

    private var clampedProgress: Double {
        min(max(progress, 0.0), 1.0)
    }

    var body: some View {
        ZStack {
            Circle()
                .stroke(
                    ringColor.opacity(0.2),
                    style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
                )

            Circle()
                .trim(from: 0, to: clampedProgress)
                .stroke(
                    ringColor,
                    style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut, value: clampedProgress)

            Text("\(Int(clampedProgress * 100))%")
                .font(.title3)
                .fontWeight(.bold)
                .monospacedDigit()
                .contentTransition(.numericText())
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Progress: \(Int(clampedProgress * 100)) percent")
        .accessibilityValue("\(Int(clampedProgress * 100))%")
    }
}
