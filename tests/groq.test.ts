import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { chatCompletion, getGroqConfig, isGroqConfigured } from "@/lib/server/groq";

const KEYS = [
  "GROQ_API_KEY",
  "GROQ_BASE_URL",
  "GROQ_MODEL",
  "GROQ_TIMEOUT_MS",
] as const;

beforeEach(() => {
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("GROQ_BASE_URL", "");
  vi.stubEnv("GROQ_MODEL", "");
  vi.stubEnv("GROQ_TIMEOUT_MS", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function expectNoKeyLeak(): void {
  const calls = [...vi.mocked(console.log).mock.calls, ...vi.mocked(console.error).mock.calls];
  expect(calls.some((args) => args.some((arg) => String(arg).includes("gsk_test")))).toBe(false);
}

describe("Groq configuration", () => {
  it("returns null and skips fetch when no API key is set", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    expect(getGroqConfig()).toBeNull();
    expect(isGroqConfigured()).toBe(false);
    expect(await chatCompletion([{ role: "user", content: "hi" }])).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reads every setting from the Groq environment variables", () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    vi.stubEnv("GROQ_BASE_URL", "https://api.groq.com/openai/v1/");
    vi.stubEnv("GROQ_MODEL", "custom-model");
    vi.stubEnv("GROQ_TIMEOUT_MS", "9000");

    expect(getGroqConfig()).toEqual({
      apiKey: "gsk_test",
      baseUrl: "https://api.groq.com/openai/v1",
      model: "custom-model",
      timeoutMs: 9000,
    });
  });

  it("uses the documented defaults when only the key is set", () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");

    const config = getGroqConfig();
    expect(config?.baseUrl).toBe("https://api.groq.com/openai/v1");
    expect(config?.model).toBe("openai/gpt-oss-120b");
    expect(config?.timeoutMs).toBe(25000);
  });

  it("rejects malformed and non-HTTPS base URLs", () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");

    vi.stubEnv("GROQ_BASE_URL", "not a url");
    expect(getGroqConfig()).toBeNull();

    vi.stubEnv("GROQ_BASE_URL", "http://api.groq.com/openai/v1");
    expect(getGroqConfig()).toBeNull();
  });

  it("falls back to the default timeout when it is too low", () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    vi.stubEnv("GROQ_TIMEOUT_MS", "200");

    expect(getGroqConfig()?.timeoutMs).toBe(25000);
  });
});

describe("Groq chatCompletion", () => {
  it("returns the message content and sends json, max tokens and temperature", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "hello" } }] }), {
        status: 200,
      }),
    );

    const result = await chatCompletion(
      [{ role: "user", content: "hi" }],
      { json: true, maxTokens: 2400, temperature: 0.7 },
    );

    expect(result).toBe("hello");
    const [url, init] = fetchSpy.mock.calls[0] ?? [];
    expect(String(url)).toMatch(/\/chat\/completions$/);
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer gsk_test");
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      response_format: { type: "json_object" },
      max_tokens: 2400,
      temperature: 0.7,
    });
  });

  it("retries without JSON mode when the API rejects that mode", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 400 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ choices: [{ message: { content: "retried" } }] }), {
          status: 200,
        }),
      );

    expect(await chatCompletion([{ role: "user", content: "hi" }], { json: true })).toBe("retried");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const secondBody = JSON.parse(String(fetchSpy.mock.calls[1]?.[1]?.body)) as Record<string, unknown>;
    expect(secondBody).not.toHaveProperty("response_format");
  });

  it("returns null on a non-2xx response", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));

    expect(await chatCompletion([{ role: "user", content: "hi" }])).toBeNull();
    expectNoKeyLeak();
  });

  it("returns null on malformed JSON", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("not-json", { status: 200 }));

    expect(await chatCompletion([{ role: "user", content: "hi" }])).toBeNull();
    expectNoKeyLeak();
  });

  it("returns null when choices is missing", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    expect(await chatCompletion([{ role: "user", content: "hi" }])).toBeNull();
    expectNoKeyLeak();
  });

  it("returns null when fetch throws", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk_test");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    expect(await chatCompletion([{ role: "user", content: "hi" }])).toBeNull();
    expectNoKeyLeak();
  });
});
