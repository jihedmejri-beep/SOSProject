import type { Lang } from "@/lib/i18n/types";
import type { Difficulty, QuizQuestion } from "@/lib/pap/quiz";
import { QUIZ_DISTRIBUTION, QUIZ_LENGTH, questionFingerprint, shuffle } from "@/lib/pap/quiz";
import type { QuizReferenceFact } from "@/lib/pap/quizReference";
import { LANGS } from "@/lib/i18n/types";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const MIN_PAGE = 3;
const MAX_PAGE = 17;

export const QUIZ_SYSTEM_PROMPT = [
  "You write a short quiz about the PAP (Prélèvement Automatique Permanent) of SOS Villages d'Enfants Tunisie.",
  "Use ONLY the FACTS provided; they are condensed from the SOS PAP reference file.",
  "Every factual claim in a question, option and explanation must come from those FACTS.",
  "Never present an unconfirmed minimum amount as an official rule; avoid the word minimum entirely.",
  "Write exactly 5 questions: 2 easy, 2 medium and 1 hard.",
  "Every question, option and explanation must be provided in French (fr), Arabic (ar) and English (en).",
  "Each question has exactly 4 options and one correct index from 0 to 3.",
  "sourcePage must be one of the page numbers present in the FACTS.",
  'Return ONLY JSON: {"questions":[{"difficulty":"easy","sourcePage":4,"question":{"fr":"","ar":"","en":""},"options":[{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""}],"correct":0,"explanation":{"fr":"","ar":"","en":""}}]}.',
].join(" ");

export function buildQuizFacts(facts: QuizReferenceFact[]): string {
  return facts.map((fact) => `[p.${fact.page}] ${fact.text}`).join("\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function localizedString(value: unknown, minLength: number): Record<Lang, string> | null {
  if (!isRecord(value)) return null;
  const result = {} as Record<Lang, string>;
  for (const lang of LANGS) {
    const text = value[lang];
    if (typeof text !== "string" || text.trim().length < minLength) return null;
    result[lang] = text.trim();
  }
  return result;
}

function hasUnconfirmedMinimum(text: string): boolean {
  return /minimum/i.test(text) || /الحد الأدنى/.test(text);
}

/**
 * Strict validation for model-generated quiz questions. Anything ambiguous,
 * incomplete or mentioning an unconfirmed minimum is rejected.
 */
export function validateGeneratedQuestions(
  input: unknown,
  allowedPages?: ReadonlySet<number>,
): QuizQuestion[] {
  if (!isRecord(input)) return [];
  const rawQuestions = input.questions;
  if (!Array.isArray(rawQuestions)) return [];

  const accepted: QuizQuestion[] = [];
  const seen = new Set<string>();

  rawQuestions.forEach((raw, index) => {
    if (!isRecord(raw)) return;
    const difficulty = raw.difficulty;
    if (typeof difficulty !== "string" || !DIFFICULTIES.includes(difficulty as Difficulty)) {
      return;
    }
    const sourcePage = raw.sourcePage;
    if (
      typeof sourcePage !== "number" ||
      !Number.isInteger(sourcePage) ||
      sourcePage < MIN_PAGE ||
      sourcePage > MAX_PAGE ||
      (allowedPages !== undefined && !allowedPages.has(sourcePage))
    ) {
      return;
    }
    const question = localizedString(raw.question, 6);
    const explanation = localizedString(raw.explanation, 12);
    if (!question || !explanation) return;

    const rawOptions = raw.options;
    if (!Array.isArray(rawOptions) || rawOptions.length !== 4) return;
    const options = rawOptions.map((option) => localizedString(option, 1));
    if (options.some((option) => option === null)) return;

    const correct = raw.correct;
    if (typeof correct !== "number" || !Number.isInteger(correct) || correct < 0 || correct > 3) {
      return;
    }

    const allText = [
      ...LANGS.map((lang) => question[lang]),
      ...options.flatMap((option) => LANGS.map((lang) => option?.[lang] ?? "")),
      ...LANGS.map((lang) => explanation[lang]),
    ].join(" ");

    if (hasUnconfirmedMinimum(allText)) return;

    const fingerprint = questionFingerprint(raw as QuizQuestion);
    if (seen.has(fingerprint)) return;
    seen.add(fingerprint);

    accepted.push({
      id: `ai-${index}-${Math.abs(hash(fingerprint))}`,
      difficulty: difficulty as Difficulty,
      topic: "ai-generated",
      sourcePage,
      question,
      options: options as Record<Lang, string>[],
      correct,
      explanation,
      aiGenerated: true,
    });
  });

  return accepted;
}

/**
 * Keeps the 2 easy / 2 medium / 1 hard split. Returns null when the model did
 * not produce enough accepted questions for one of the levels.
 */
export function selectBalancedQuestions(
  generated: QuizQuestion[],
  rng: () => number = Math.random,
): QuizQuestion[] | null {
  const picked: QuizQuestion[] = [];
  for (const level of DIFFICULTIES) {
    const ofLevel = generated.filter((question) => question.difficulty === level);
    const needed = QUIZ_DISTRIBUTION[level];
    if (ofLevel.length < needed) return null;
    picked.push(...ofLevel.slice(0, needed));
  }
  return shuffle(picked, rng).slice(0, QUIZ_LENGTH);
}

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) {
    result = (result * 31 + value.charCodeAt(i)) | 0;
  }
  return result;
}

export function parseJsonObject(raw: string | null): unknown {
  if (!raw) return null;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}
