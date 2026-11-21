import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ chatCompletion: vi.fn() }));
vi.mock("@/lib/server/deepseek", () => ({ chatCompletion: mocks.chatCompletion }));

import { POST } from "@/app/api/quiz/route";

const request = (body: unknown, ip: string) =>
  new Request("http://localhost/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-real-ip": ip },
    body: body === undefined ? "" : JSON.stringify(body),
  });

beforeEach(() => mocks.chatCompletion.mockReset());

describe("quiz route", () => {
  it("returns the curated quiz when the model call fails", async () => {
    mocks.chatCompletion.mockResolvedValue(null);
    const response = await POST(request({}, "route-fallback"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ mode: "curated" });
  });

  it("forwards normalized seen prompts and generation options", async () => {
    mocks.chatCompletion.mockResolvedValue(null);
    await POST(request({ seen: ["  Quelle   definition  "] }, "route-args"));
    const [messages, options] = mocks.chatCompletion.mock.calls[0]!;
    expect(options).toMatchObject({ json: true, maxTokens: 2400, timeoutMs: 30000, temperature: 0.7 });
    expect(messages[1].content).toContain("AVOID");
    expect(messages[1].content).toContain("Quelle definition");
  });
});
