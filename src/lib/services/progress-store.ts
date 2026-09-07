import { DailyProgress } from "@/lib/types/progress";

/**
 * In-memory store for daily progress records.
 * Key format: `${user_id}:${date}`
 *
 * Note: This is suitable for development/testing. In production,
 * replace with a persistent data store (e.g., DynamoDB, PostgreSQL).
 */
const store = new Map<string, DailyProgress>();

function makeKey(userId: string, date: string): string {
  return `${userId}:${date}`;
}

/** Retrieve a user's progress for a specific date */
export function getProgress(
  userId: string,
  date: string
): DailyProgress | undefined {
  return store.get(makeKey(userId, date));
}

/** Persist a user's progress record */
export function setProgress(progress: DailyProgress): void {
  store.set(makeKey(progress.user_id, progress.date), progress);
}

/**
 * Retrieve progress history for streak calculation.
 * Returns records for up to `days` days before `fromDate` (inclusive).
 */
export function getProgressHistory(
  userId: string,
  days: number,
  fromDate: string
): DailyProgress[] {
  const results: DailyProgress[] = [];
  const from = new Date(fromDate + "T00:00:00Z");

  for (let i = 0; i < days; i++) {
    const date = new Date(from);
    date.setUTCDate(date.getUTCDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const progress = store.get(makeKey(userId, dateStr));
    if (progress) {
      results.push(progress);
    }
  }

  return results;
}

/** Clear all records (used in testing) */
export function clearStore(): void {
  store.clear();
}
