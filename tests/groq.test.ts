import { afterEach, describe, expect, it } from "vitest";
import { getGroqConfig, isGroqConfigured } from "@/lib/server/groq";

const KEYS = [
  "GROQ_API_KEY",
  "GROQ_BASE_URL",
  "GROQ_MODEL",
  "GROQ_TIMEOUT_MS",
] as const;

const original = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of KEYS) {
    const value = original[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("Groq configuration", () => {
  it("is disabled without an API key", () => {
    delete process.env.GROQ_API_KEY;
    expect(getGroqConfig()).toBeNull();
    expect(isGroqConfigured()).toBe(false);
  });

  it("rejects a non-HTTPS base URL", () => {
    process.env.GROQ_API_KEY = "test-key";
    process.env.GROQ_BASE_URL = "http://api.groq.com/openai/v1";
    expect(getGroqConfig()).toBeNull();
  });

  it("reads the Groq settings and strips a trailing slash", () => {
    process.env.GROQ_API_KEY = "test-key";
    process.env.GROQ_BASE_URL = "https://api.groq.com/openai/v1/";
    process.env.GROQ_MODEL = "llama-3.3-70b-versatile";
    process.env.GROQ_TIMEOUT_MS = "20000";
    expect(getGroqConfig()).toEqual({
      apiKey: "test-key",
      baseUrl: "https://api.groq.com/openai/v1",
      model: "llama-3.3-70b-versatile",
      timeoutMs: 20000,
    });
  });
});
