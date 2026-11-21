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
const DEFAULT_MODEL = "openai/gpt-oss-120b";

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

  const timeout = Number(process.env.GROQ_TIMEOUT_MS ?? 25000);
  return {
    apiKey,
    baseUrl: `${baseUrl.origin}${baseUrl.pathname.replace(/\/$/, "")}`,
    model: process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL,
    timeoutMs: Number.isFinite(timeout) && timeout > 1000 ? timeout : 25000,
  };
}

export function isGroqConfigured(): boolean {
  return getGroqConfig() !== null;
}

type CompletionOptions = {
  maxTokens?: number;
  temperature?: number;
  json?: boolean;
  timeoutMs?: number;
};

type CompletionResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

async function callGroq(
  config: GroqConfig,
  messages: ChatMessage[],
  options: CompletionOptions,
  useJsonMode: boolean,
  signal: AbortSignal,
): Promise<CompletionResponse> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 900,
      ...(useJsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
    signal,
    cache: "no-store",
  });
  return response;
}

/**
 * Server-only Groq call. Groq exposes an OpenAI-compatible chat endpoint.
 * Never throws and never logs secrets; returns null on any failure so callers
 * can fall back to curated content.
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
    let response = await callGroq(config, messages, options, Boolean(options.json), controller.signal);

    if (!response.ok && options.json && (response.status === 400 || response.status === 422)) {
      response = await callGroq(config, messages, options, false, controller.signal);
    }

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
