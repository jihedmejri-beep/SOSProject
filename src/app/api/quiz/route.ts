import { NextResponse } from "next/server";
import type { QuizResponse } from "@/lib/api/types";
import { buildQuiz } from "@/lib/pap/quiz";
import { QUIZ_REFERENCE_FACTS } from "@/lib/pap/quizReference";
import { chatCompletion } from "@/lib/server/deepseek";
import {
  QUIZ_SYSTEM_PROMPT,
  buildQuizFacts,
  buildQuizUserPrompt,
  parseJsonObject,
  parseQuizRequestBody,
  selectBalancedQuestions,
  validateGeneratedQuestions,
} from "@/lib/server/quizGeneration";
import { createRateLimiter } from "@/lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });
const REFERENCE_PAGES = new Set(QUIZ_REFERENCE_FACTS.map((fact) => fact.page));

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    if (first && first.trim()) return first.trim();
  }
  return request.headers.get("x-real-ip") ?? "local";
}

function curatedQuiz(): QuizResponse {
  return { mode: "curated", questions: buildQuiz() };
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!limiter.allow(clientKey(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { seen } = parseQuizRequestBody(await request.text().catch(() => null));

  const raw = await chatCompletion(
    [
      { role: "system", content: QUIZ_SYSTEM_PROMPT },
      { role: "user", content: buildQuizUserPrompt(buildQuizFacts(QUIZ_REFERENCE_FACTS), seen) },
    ],
    { json: true, maxTokens: 2400, timeoutMs: 30000, temperature: 0.7 },
  );

  const generated = validateGeneratedQuestions(parseJsonObject(raw), REFERENCE_PAGES);
  const questions = generated.length > 0 ? selectBalancedQuestions(generated) : null;
  if (!questions) return NextResponse.json(curatedQuiz());

  const payload: QuizResponse = { mode: "ai", questions };
  return NextResponse.json(payload);
}
