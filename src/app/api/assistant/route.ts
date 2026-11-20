import { NextResponse } from "next/server";
import type { AssistantResponse } from "@/lib/api/types";
import { isLang, type Lang } from "@/lib/i18n/types";
import { answerFromKnowledge, citationsFromHits } from "@/lib/pap/answer";
import { buildContext, retrieve } from "@/lib/pap/retrieve";
import { chatCompletion } from "@/lib/server/deepseek";
import { createRateLimiter } from "@/lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 20, windowMs: 60_000 });

const LANGUAGE_LABEL: Record<Lang, string> = {
  fr: "French",
  ar: "Arabic",
  en: "English",
};

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    if (first && first.trim()) return first.trim();
  }
  return request.headers.get("x-real-ip") ?? "local";
}

function buildSystemPrompt(lang: Lang): string {
  return [
    "You are the PAP assistant of SOS Villages d'Enfants Tunisie.",
    "Answer ONLY with facts contained in the CONTEXT.",
    "Never invent numbers, dates, policies, links, guarantees or eligibility rules.",
    "Never present an unconfirmed minimum amount as an official rule.",
    "If the CONTEXT does not answer the question, set confident to false and leave answer empty.",
    `Write the answer in ${LANGUAGE_LABEL[lang]}, in 2 to 4 short sentences, plain text without markdown.`,
    'Return ONLY a JSON object: {"answer": string, "citationPages": number[], "confident": boolean}.',
    "citationPages must be a subset of the pages listed in the CONTEXT.",
  ].join(" ");
}

type ModelAnswer = { answer: string; pages: number[] };

function parseModelAnswer(raw: string | null, allowedPages: number[]): ModelAnswer | null {
  if (!raw) return null;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  let data: unknown;
  try {
    data = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  if (record.confident !== true) return null;

  const answer = record.answer;
  if (typeof answer !== "string") return null;
  const trimmed = answer.trim();
  if (trimmed.length < 20 || trimmed.length > 1500) return null;

  const pages = record.citationPages;
  if (!Array.isArray(pages) || pages.length === 0) return null;

  const valid: number[] = [];
  for (const page of pages) {
    if (typeof page !== "number" || !Number.isInteger(page)) return null;
    if (!allowedPages.includes(page)) return null;
    if (!valid.includes(page)) valid.push(page);
  }

  return { answer: trimmed, pages: valid };
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
  if (!curated.supported) {
    const payload: AssistantResponse = { ...curated, mode: "curated" };
    return NextResponse.json(payload);
  }

  const hits = retrieve(trimmed, lang, 3);
  const allowedPages = hits.map((hit) => hit.chunk.page);
  const context = buildContext(hits, lang);

  const raw = await chatCompletion(
    [
      { role: "system", content: buildSystemPrompt(lang) },
      {
        role: "user",
        content: `QUESTION: ${trimmed}\n\nCONTEXT:\n${context}`,
      },
    ],
    { json: true, maxTokens: 600 },
  );

  const parsed = parseModelAnswer(raw, allowedPages);
  if (!parsed) {
    const payload: AssistantResponse = { ...curated, mode: "curated" };
    return NextResponse.json(payload);
  }

  const payload: AssistantResponse = {
    answer: parsed.answer,
    citations: citationsFromHits(
      hits.filter((hit) => parsed.pages.includes(hit.chunk.page)),
      lang,
    ),
    mode: "ai",
    supported: true,
    topic: curated.topic,
  };
  return NextResponse.json(payload);
}
