import SwiftUI

struct CircularProgressRing: View {
    let progress: Double
    var strokeWidth: CGFloat = 8
    var trackColor: Color = .secondary.opacity(0.3)
    var progressColor: Color = .accentColor

    var body: some View {
        ZStack {
            Circle()
                .stroke(trackColor, style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round))

            Circle()
                .trim(from: 0, to: CGFloat(min(progress, 1.0)))
                .stroke(progressColor, style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut, value: progress)

            Text("\(Int(progress * 100))%")
                .font(.system(.title3, design: .rounded, weight: .bold))
                .monospacedDigit()
                .accessibilityHidden(true)
        }
        .frame(width: 80, height: 80)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Progress: \(Int(progress * 100)) percent")
    }
}

#Preview("Empty") {
    CircularProgressRing(progress: 0)
}

#Preview("Half") {
    CircularProgressRing(progress: 0.5)
}

#Preview("Full") {
    CircularProgressRing(progress: 1.0)
}
