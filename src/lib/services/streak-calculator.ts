import { DailyProgress } from "@/lib/types/progress";

/**
 * Calculates the current streak of consecutive days with completions.
 *
 * Rules:
 * - If current day has completions, streak starts at 1 and counts backwards
 * - If current day has no completions, checks if yesterday had completions
 *   and counts backwards from there
 * - A day with completed_count === 0 breaks the streak
 * - Returns 0 if no consecutive activity is found
 */
export function calculateStreak(
  history: DailyProgress[],
  currentDate: string
): number {
  if (history.length === 0) {
    return 0;
  }

  const progressByDate = new Map<string, DailyProgress>();
  for (const entry of history) {
    progressByDate.set(entry.date, entry);
  }

  const current = progressByDate.get(currentDate);
  const currentHasCompletions = current && current.completed_count > 0;

  if (!currentHasCompletions) {
    // Current day has no completions — check from yesterday
    const yesterday = getDateOffset(currentDate, -1);
    const yesterdayProgress = progressByDate.get(yesterday);

    if (!yesterdayProgress || yesterdayProgress.completed_count === 0) {
      return 0;
    }

    let streak = 0;
    let checkDate = yesterday;

    while (true) {
      const dayProgress = progressByDate.get(checkDate);
      if (!dayProgress || dayProgress.completed_count === 0) {
        break;
      }
      streak++;
      checkDate = getDateOffset(checkDate, -1);
    }

    return streak;
  }

  // Current day has completions — count from today backwards
  let streak = 1;
  let checkDate = getDateOffset(currentDate, -1);

  while (true) {
    const dayProgress = progressByDate.get(checkDate);
    if (!dayProgress || dayProgress.completed_count === 0) {
      break;
    }
    streak++;
    checkDate = getDateOffset(checkDate, -1);
  }

  return streak;
}

/** Get a date string offset by N days from the given date */
function getDateOffset(dateStr: string, offsetDays: number): string {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().split("T")[0];
}
