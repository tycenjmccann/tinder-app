/**
 * Represents a user's daily progress metrics.
 * Tracks completions, goals, and streak information for a single day.
 */
export interface DailyProgress {
  /** Unique identifier for the user */
  user_id: string;
  /** Date in YYYY-MM-DD format (user's local date) */
  date: string;
  /** Number of items completed today */
  completed_count: number;
  /** Target number of completions for the day */
  goal_count: number;
  /** Number of consecutive days with completions */
  streak_days: number;
  /** Ratio of completed_count to goal_count, capped at 1.0 */
  progress_percentage: number;
  /** List of item IDs completed today (prevents duplicates) */
  completed_items: string[];
}
