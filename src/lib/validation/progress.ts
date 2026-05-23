import { z } from "zod";

/** Schema for POST /api/v1/progress/complete request body */
export const completeRequestSchema = z.object({
  item_id: z.string().min(1, "item_id must be a non-empty string"),
});

/** Schema for required user identification headers */
export const userHeadersSchema = z.object({
  "x-user-id": z.string().min(1, "x-user-id header is required"),
  "x-timezone": z.string().default("UTC"),
});

export type CompleteRequest = z.infer<typeof completeRequestSchema>;
export type UserHeaders = z.infer<typeof userHeadersSchema>;
