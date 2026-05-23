import { NextRequest, NextResponse } from "next/server";
import {
  userHeadersSchema,
  completeRequestSchema,
} from "@/lib/validation/progress";
import { recordCompletion } from "@/lib/services/progress-service";

/**
 * POST /api/v1/progress/complete
 *
 * Records a completion for the authenticated user.
 * Increments completed_count, recalculates progress_percentage and streak_days.
 * Prevents duplicate completions of the same item_id.
 *
 * Requires x-user-id header and JSON body with { item_id: string }.
 */
export async function POST(request: NextRequest) {
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const bodyParsed = completeRequestSchema.safeParse(body);
    if (!bodyParsed.success) {
      return NextResponse.json(
        { error: bodyParsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { "x-user-id": userId, "x-timezone": timezone } = headersParsed.data;
    const { item_id: itemId } = bodyParsed.data;

    const progress = recordCompletion(userId, itemId, timezone);

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
