import { NextResponse } from "next/server";
import type { AssistantResponse } from "@/lib/api/types";
import { isLang } from "@/lib/i18n/types";
import { answerFromKnowledge, type GroundedAnswer } from "@/lib/pap/answer";
import {
  buildAssistantSystemPrompt,
  citationsFromSections,
  parseAssistantAnswer,
} from "@/lib/server/assistantAnswer";
import { chatCompletion } from "@/lib/server/groq";
import { loadPapReference } from "@/lib/server/papReference";
import { createRateLimiter } from "@/lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 20, windowMs: 60_000 });

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    if (first && first.trim()) return first.trim();
  }
  return request.headers.get("x-real-ip") ?? "local";
}

function curatedResponse(curated: GroundedAnswer): NextResponse {
  const payload: AssistantResponse = { ...curated, mode: "curated" };
  return NextResponse.json(payload);
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!limiter.allow(clientKey(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { question, lang } = (body ?? {}) as { question?: unknown; lang?: unknown };
  if (typeof question !== "string" || !isLang(lang)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const trimmed = question.trim();
  if (trimmed.length < 3 || trimmed.length > 600) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const curated = answerFromKnowledge(trimmed, lang);
  const reference = loadPapReference();
  if (!reference) return curatedResponse(curated);

  const raw = await chatCompletion(
    [
      { role: "system", content: buildAssistantSystemPrompt(lang, reference.text) },
      { role: "user", content: trimmed },
    ],
    { json: true, maxTokens: 900, timeoutMs: 25000 },
  );

  const parsed = parseAssistantAnswer(raw, reference.sections, lang);
  if (!parsed) return curatedResponse(curated);

  const payload: AssistantResponse = {
    answer: parsed.answer,
    citations: parsed.supported
      ? citationsFromSections(reference.sections, parsed.sections)
      : [],
    mode: "ai",
    supported: parsed.supported,
    topic: curated.topic ?? (parsed.supported ? "reference" : null),
  };
  return NextResponse.json(payload);
}
