import { NextRequest, NextResponse } from "next/server";
import { userHeadersSchema } from "@/lib/validation/progress";
import { getDailyProgress } from "@/lib/services/progress-service";

/**
 * GET /api/v1/progress/daily
 *
 * Returns the current day's progress metrics for the authenticated user.
 * Requires x-user-id header. Accepts optional x-timezone header (defaults to UTC).
 */
export async function GET(request: NextRequest) {
  try {
    const headersParsed = userHeadersSchema.safeParse({
      "x-user-id": request.headers.get("x-user-id") ?? undefined,
      "x-timezone": request.headers.get("x-timezone") ?? undefined,
    });

    if (!headersParsed.success) {
      return NextResponse.json(
        { error: headersParsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { "x-user-id": userId, "x-timezone": timezone } = headersParsed.data;
    const progress = getDailyProgress(userId, timezone);

    return NextResponse.json({
      date: progress.date,
      completed_count: progress.completed_count,
      goal_count: progress.goal_count,
      streak_days: progress.streak_days,
      progress_percentage: progress.progress_percentage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
