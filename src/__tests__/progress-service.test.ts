import { getDailyProgress, recordCompletion } from "@/lib/services/progress-service";
import { clearStore } from "@/lib/services/progress-store";

describe("progress-service", () => {
  beforeEach(() => {
    clearStore();
  });

  describe("getDailyProgress", () => {
    it("creates a new record if none exists", () => {
      const progress = getDailyProgress("user-1", "UTC");

      expect(progress.user_id).toBe("user-1");
      expect(progress.completed_count).toBe(0);
      expect(progress.goal_count).toBe(10);
      expect(progress.streak_days).toBe(0);
      expect(progress.progress_percentage).toBe(0);
      expect(progress.completed_items).toEqual([]);
    });

    it("returns existing record if one exists", () => {
      recordCompletion("user-1", "item-1", "UTC");
      const progress = getDailyProgress("user-1", "UTC");

      expect(progress.completed_count).toBe(1);
      expect(progress.completed_items).toContain("item-1");
    });
  });

  describe("recordCompletion", () => {
    it("increments completed count", () => {
      const progress = recordCompletion("user-1", "item-1", "UTC");

      expect(progress.completed_count).toBe(1);
      expect(progress.completed_items).toEqual(["item-1"]);
    });

    it("prevents duplicate completions of same item_id", () => {
      recordCompletion("user-1", "item-1", "UTC");
      const progress = recordCompletion("user-1", "item-1", "UTC");

      expect(progress.completed_count).toBe(1);
      expect(progress.completed_items).toEqual(["item-1"]);
    });

    it("calculates progress_percentage correctly", () => {
      let progress = recordCompletion("user-1", "item-1", "UTC");
      expect(progress.progress_percentage).toBeCloseTo(0.1);

      progress = recordCompletion("user-1", "item-2", "UTC");
      expect(progress.progress_percentage).toBeCloseTo(0.2);

      for (let i = 3; i <= 10; i++) {
        progress = recordCompletion("user-1", `item-${i}`, "UTC");
      }
      expect(progress.progress_percentage).toBe(1.0);
    });

    it("caps progress_percentage at 1.0", () => {
      for (let i = 1; i <= 12; i++) {
        recordCompletion("user-1", `item-${i}`, "UTC");
      }
      const progress = getDailyProgress("user-1", "UTC");
      expect(progress.progress_percentage).toBe(1.0);
    });

    it("updates streak on completion", () => {
      const progress = recordCompletion("user-1", "item-1", "UTC");
      expect(progress.streak_days).toBe(1);
    });
  });
});
