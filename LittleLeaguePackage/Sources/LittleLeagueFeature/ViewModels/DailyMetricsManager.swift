import Foundation

@MainActor
class DailyMetricsManager: ObservableObject {
    static let shared = DailyMetricsManager()

    private static let storageKey = "daily_metrics"
    private static let defaultDailyGoal = 20

    @Published private(set) var currentMetrics: DailyMetrics

    init() {
        if let data = UserDefaults.standard.data(forKey: Self.storageKey),
           let stored = try? JSONDecoder().decode(DailyMetrics.self, from: data) {
            currentMetrics = stored
        } else {
            currentMetrics = DailyMetrics(
                date: Date(),
                cardsCompleted: 0,
                currentStreak: 0,
                lastActiveDate: Date(),
                dailyGoal: Self.defaultDailyGoal
            )
        }
        rolloverIfNeeded()
    }

    func recordCardCompleted() {
        rolloverIfNeeded()
        currentMetrics.cardsCompleted += 1
        updateStreak()
        currentMetrics.lastActiveDate = Date()
        persist()
    }

    func getTodayMetrics() -> DailyMetrics {
        currentMetrics
    }

    private func rolloverIfNeeded() {
        let calendar = Calendar.current
        if !calendar.isDateInToday(currentMetrics.date) {
            currentMetrics.cardsCompleted = 0
            currentMetrics.date = Date()
            updateStreak()
            persist()
        }
    }

    private func updateStreak() {
        let calendar = Calendar.current
        if calendar.isDateInToday(currentMetrics.lastActiveDate) {
            // Same day — keep streak
        } else if calendar.isDateInYesterday(currentMetrics.lastActiveDate) {
            currentMetrics.currentStreak += 1
        } else {
            currentMetrics.currentStreak = 1
        }
    }

    private func persist() {
        guard let data = try? JSONEncoder().encode(currentMetrics) else { return }
        UserDefaults.standard.set(data, forKey: Self.storageKey)
    }
}
