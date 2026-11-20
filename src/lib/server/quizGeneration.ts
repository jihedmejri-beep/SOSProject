import type { Lang } from "@/lib/i18n/types";
import type { Difficulty, QuizQuestion } from "@/lib/pap/quiz";
import { LANGS } from "@/lib/i18n/types";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const MIN_PAGE = 3;
const MAX_PAGE = 17;

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
export function validateGeneratedQuestions(input: unknown): QuizQuestion[] {
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
      sourcePage > MAX_PAGE
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

    const fingerprint = question.fr.toLowerCase().replace(/\s+/g, " ").trim();
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
