export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GroqConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
};

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export function getGroqConfig(): GroqConfig | null {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  const rawBase = process.env.GROQ_BASE_URL?.trim() || DEFAULT_BASE_URL;
  let baseUrl: URL;
  try {
    baseUrl = new URL(rawBase);
  } catch {
    return null;
  }
  if (baseUrl.protocol !== "https:") return null;

  const timeout = Number(process.env.GROQ_TIMEOUT_MS ?? 15000);
  return {
    apiKey,
    baseUrl: baseUrl.origin + baseUrl.pathname.replace(/\/$/, ""),
    model: process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL,
    timeoutMs: Number.isFinite(timeout) && timeout > 1000 ? timeout : 15000,
  };
}

export function isGroqConfigured(): boolean {
  return getGroqConfig() !== null;
}

type CompletionOptions = {
  maxTokens?: number;
  json?: boolean;
  timeoutMs?: number;
  temperature?: number;
};

/**
 * Server-only Groq call. Never throws and never logs secrets. Returns null
 * on any failure so callers can fall back to the curated knowledge base.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options: CompletionOptions = {},
): Promise<string | null> {
  const config = getGroqConfig();
  if (!config) return null;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? config.timeoutMs,
  );

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 700,
        ...(options.json ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!data || typeof data !== "object") return null;
    const choices = (data as { choices?: unknown }).choices;
    if (!Array.isArray(choices) || choices.length === 0) return null;
    const first = choices[0] as { message?: { content?: unknown } };
    const content = first?.message?.content;
    return typeof content === "string" ? content : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
