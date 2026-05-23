import { calculateStreak } from "@/lib/services/streak-calculator";
import { DailyProgress } from "@/lib/types/progress";

function makeProgress(
  date: string,
  completedCount: number
): DailyProgress {
  return {
    user_id: "user-1",
    date,
    completed_count: completedCount,
    goal_count: 10,
    streak_days: 0,
    progress_percentage: completedCount / 10,
    completed_items: Array.from({ length: completedCount }, (_, i) => `item-${i}`),
  };
}

describe("calculateStreak", () => {
  it("returns 0 for empty history", () => {
    expect(calculateStreak([], "2024-01-15")).toBe(0);
  });

  it("returns 1 for a single day with completions (current day)", () => {
    const history = [makeProgress("2024-01-15", 3)];
    expect(calculateStreak(history, "2024-01-15")).toBe(1);
  });

  it("returns 0 for a single day with no completions", () => {
    const history = [makeProgress("2024-01-15", 0)];
    expect(calculateStreak(history, "2024-01-15")).toBe(0);
  });

  it("counts consecutive days correctly", () => {
    const history = [
      makeProgress("2024-01-13", 2),
      makeProgress("2024-01-14", 5),
      makeProgress("2024-01-15", 3),
    ];
    expect(calculateStreak(history, "2024-01-15")).toBe(3);
  });

  it("resets streak when a gap is found", () => {
    const history = [
      makeProgress("2024-01-12", 2),
      makeProgress("2024-01-14", 5),
      makeProgress("2024-01-15", 3),
    ];
    // Gap on Jan 13 means streak is only 2 (Jan 14 + Jan 15)
    expect(calculateStreak(history, "2024-01-15")).toBe(2);
  });

  it("counts streak from yesterday if current day has no completions", () => {
    const history = [
      makeProgress("2024-01-13", 2),
      makeProgress("2024-01-14", 5),
      makeProgress("2024-01-15", 0),
    ];
    // Current day has 0, so check yesterday: Jan 14 (yes) + Jan 13 (yes) = 2
    expect(calculateStreak(history, "2024-01-15")).toBe(2);
  });

  it("returns 0 if current day and yesterday have no completions", () => {
    const history = [
      makeProgress("2024-01-13", 2),
      makeProgress("2024-01-15", 0),
    ];
    // No yesterday (Jan 14) entry means streak is 0
    expect(calculateStreak(history, "2024-01-15")).toBe(0);
  });

  it("handles long streaks", () => {
    const history: DailyProgress[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date("2024-01-30T00:00:00Z");
      date.setUTCDate(date.getUTCDate() - i);
      history.push(makeProgress(date.toISOString().split("T")[0], 1));
    }
    expect(calculateStreak(history, "2024-01-30")).toBe(30);
  });

  it("handles date strings correctly across month boundaries", () => {
    const history = [
      makeProgress("2024-01-31", 2),
      makeProgress("2024-02-01", 3),
    ];
    expect(calculateStreak(history, "2024-02-01")).toBe(2);
  });
});
