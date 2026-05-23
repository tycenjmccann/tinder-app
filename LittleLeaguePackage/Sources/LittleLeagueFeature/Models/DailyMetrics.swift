import Foundation

struct DailyMetrics: Codable {
    var date: Date
    var cardsCompleted: Int
    var currentStreak: Int
    var lastActiveDate: Date
    var dailyGoal: Int
}
