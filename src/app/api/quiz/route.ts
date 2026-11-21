import { NextResponse } from "next/server";
import type { QuizResponse } from "@/lib/api/types";
import { KNOWLEDGE } from "@/lib/pap/knowledge";
import { buildQuiz, QUIZ_LENGTH, shuffle, type Difficulty, type QuizQuestion } from "@/lib/pap/quiz";
import { chatCompletion } from "@/lib/server/groq";
import {
  parseJsonObject,
  validateGeneratedQuestions,
} from "@/lib/server/quizGeneration";
import { createRateLimiter } from "@/lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });

const LEVELS: Difficulty[] = ["easy", "medium", "hard"];

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    if (first && first.trim()) return first.trim();
  }
  return request.headers.get("x-real-ip") ?? "local";
}

function buildFacts(): string {
  return KNOWLEDGE.map(
    (chunk) => `[p.${chunk.page}] ${chunk.text.fr}`,
  ).join("\n");
}

const SYSTEM_PROMPT = [
  "You write a short quiz about the PAP (Prélèvement Automatique Permanent) of SOS Villages d'Enfants Tunisie.",
  "Use ONLY the FACTS provided.",
  "Never present an unconfirmed minimum amount as an official rule; avoid the word minimum entirely.",
  "Write exactly 6 questions: 2 easy, 2 medium, 2 hard.",
  "Every question, option and explanation must be provided in French (fr), Arabic (ar) and English (en).",
  "Each question has exactly 4 options and one correct index from 0 to 3.",
  "sourcePage must be a page number present in the FACTS.",
  'Return ONLY JSON: {"questions":[{"difficulty":"easy","sourcePage":4,"question":{"fr":"","ar":"","en":""},"options":[{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""}],"correct":0,"explanation":{"fr":"","ar":"","en":""}}]}.',
].join(" ");

function curatedQuiz(): QuizResponse {
  return { mode: "curated", questions: buildQuiz() };
}

function balancedAiQuiz(generated: QuizQuestion[]): QuizQuestion[] | null {
  const picked: QuizQuestion[] = [];
  for (const level of LEVELS) {
    const ofLevel = generated.filter((question) => question.difficulty === level);
    if (ofLevel.length < 2) return null;
    picked.push(...ofLevel.slice(0, 2));
  }
  return shuffle(picked).slice(0, QUIZ_LENGTH);
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!limiter.allow(clientKey(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const raw = await chatCompletion(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `FACTS:\n${buildFacts()}` },
    ],
    { json: true, maxTokens: 2400, timeoutMs: 30000 },
  );

  const generated = validateGeneratedQuestions(parseJsonObject(raw));
  const questions = generated.length > 0 ? balancedAiQuiz(generated) : null;
  if (!questions) return NextResponse.json(curatedQuiz());

  const payload: QuizResponse = { mode: "ai", questions };
  return NextResponse.json(payload);
}
