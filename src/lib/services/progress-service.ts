import { DailyProgress } from "@/lib/types/progress";
import {
  getProgress,
  setProgress,
  getProgressHistory,
} from "@/lib/services/progress-store";
import { calculateStreak } from "@/lib/services/streak-calculator";

const DEFAULT_GOAL_COUNT = 10;
const STREAK_HISTORY_DAYS = 30;

/**
 * Get the current date string in the user's timezone.
 * Uses Intl.DateTimeFormat with 'en-CA' locale for YYYY-MM-DD format.
 */
function getCurrentDate(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

/** Get or create a progress record for the given user and date */
function getOrCreateProgress(userId: string, date: string): DailyProgress {
  const existing = getProgress(userId, date);
  if (existing) {
    return existing;
  }

  const newProgress: DailyProgress = {
    user_id: userId,
    date,
    completed_count: 0,
    goal_count: DEFAULT_GOAL_COUNT,
    streak_days: 0,
    progress_percentage: 0,
    completed_items: [],
  };

  // Calculate streak based on historical data
  const history = getProgressHistory(userId, STREAK_HISTORY_DAYS, date);
  newProgress.streak_days = calculateStreak(history, date);

  setProgress(newProgress);
  return newProgress;
}

/**
 * Get the daily progress for a user in their timezone.
 * Creates a new record with defaults if none exists for today.
 */
export function getDailyProgress(
  userId: string,
  timezone: string
): DailyProgress {
  const date = getCurrentDate(timezone);
  return getOrCreateProgress(userId, date);
}

/**
 * Record a completion for the user.
 * - Prevents duplicate item_id completions
 * - Recalculates progress_percentage and streak_days
 */
export function recordCompletion(
  userId: string,
  itemId: string,
  timezone: string
): DailyProgress {
  const date = getCurrentDate(timezone);
  const progress = getOrCreateProgress(userId, date);

  // Prevent duplicate completions
  if (progress.completed_items.includes(itemId)) {
    return progress;
  }

  progress.completed_items.push(itemId);
  progress.completed_count = progress.completed_items.length;
  progress.progress_percentage = Math.min(
    progress.completed_count / progress.goal_count,
    1.0
  );

  // Recalculate streak with updated current day
  const history = getProgressHistory(userId, STREAK_HISTORY_DAYS, date);
  const historyWithCurrent = history.map((h) =>
    h.date === date ? progress : h
  );
  if (!history.some((h) => h.date === date)) {
    historyWithCurrent.push(progress);
  }
  progress.streak_days = calculateStreak(historyWithCurrent, date);

  setProgress(progress);
  return progress;
}
