import { GET } from "@/app/api/v1/progress/daily/route";
import { POST } from "@/app/api/v1/progress/complete/route";
import { clearStore } from "@/lib/services/progress-store";
import { NextRequest } from "next/server";

function createRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  } = {}
): NextRequest {
  const { method = "GET", headers = {}, body } = options;
  const init: RequestInit = {
    method,
    headers: new Headers(headers),
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return new NextRequest(new URL(url, "http://localhost:3000"), init);
}

describe("API Routes", () => {
  beforeEach(() => {
    clearStore();
  });

  describe("GET /api/v1/progress/daily", () => {
    it("returns 400 without x-user-id header", async () => {
      const request = createRequest("/api/v1/progress/daily");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it("returns default metrics for new user", async () => {
      const request = createRequest("/api/v1/progress/daily", {
        headers: { "x-user-id": "user-1", "x-timezone": "UTC" },
      });
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.completed_count).toBe(0);
      expect(data.goal_count).toBe(10);
      expect(data.streak_days).toBe(0);
      expect(data.progress_percentage).toBe(0);
      expect(data.date).toBeDefined();
    });

    it("defaults timezone to UTC when not provided", async () => {
      const request = createRequest("/api/v1/progress/daily", {
        headers: { "x-user-id": "user-1" },
      });
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.date).toBeDefined();
    });
  });

  describe("POST /api/v1/progress/complete", () => {
    it("returns 400 without x-user-id header", async () => {
      const request = createRequest("/api/v1/progress/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: { item_id: "item-1" },
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 without body", async () => {
      const request = createRequest("/api/v1/progress/complete", {
        method: "POST",
        headers: {
          "x-user-id": "user-1",
          "x-timezone": "UTC",
          "content-type": "application/json",
        },
        body: {},
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it("returns 400 with empty item_id", async () => {
      const request = createRequest("/api/v1/progress/complete", {
        method: "POST",
        headers: {
          "x-user-id": "user-1",
          "x-timezone": "UTC",
          "content-type": "application/json",
        },
        body: { item_id: "" },
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("increments on valid request", async () => {
      const request = createRequest("/api/v1/progress/complete", {
        method: "POST",
        headers: {
          "x-user-id": "user-1",
          "x-timezone": "UTC",
          "content-type": "application/json",
        },
        body: { item_id: "item-1" },
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.completed_count).toBe(1);
      expect(data.progress_percentage).toBeCloseTo(0.1);
      expect(data.streak_days).toBe(1);
    });

    it("increments count with multiple completions", async () => {
      const req1 = createRequest("/api/v1/progress/complete", {
        method: "POST",
        headers: {
          "x-user-id": "user-1",
          "x-timezone": "UTC",
          "content-type": "application/json",
        },
        body: { item_id: "item-1" },
      });
      await POST(req1);

      const req2 = createRequest("/api/v1/progress/complete", {
        method: "POST",
        headers: {
          "x-user-id": "user-1",
          "x-timezone": "UTC",
          "content-type": "application/json",
        },
        body: { item_id: "item-2" },
      });
      const response = await POST(req2);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.completed_count).toBe(2);
      expect(data.progress_percentage).toBeCloseTo(0.2);
    });
  });
});
