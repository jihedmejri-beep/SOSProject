import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/server/rateLimit";
import {
  parseJsonObject,
  validateGeneratedQuestions,
} from "@/lib/server/quizGeneration";

function validQuestion(overrides: Record<string, unknown> = {}) {
  return {
    difficulty: "easy",
    sourcePage: 4,
    question: {
      fr: "Que signifie PAP ?",
      ar: "ماذا يعني الاقتطاع التلقائي الدائم؟",
      en: "What does PAP mean?",
    },
    options: [
      {
        fr: "Prélèvement Automatique Permanent",
        ar: "الاقتطاع التلقائي الدائم",
        en: "Permanent Automatic Debit",
      },
      { fr: "Paiement Annuel", ar: "دفع سنوي", en: "Annual payment" },
      { fr: "Prêt Aidé", ar: "قرض مدعوم", en: "Assisted loan" },
      { fr: "Don Ponctuel", ar: "تبرع ظرفي", en: "One-off donation" },
    ],
    correct: 0,
    explanation: {
      fr: "Le PAP est une contribution mensuelle récurrente et volontaire.",
      ar: "الاقتطاع مساهمة شهرية متكررة وتطوعية.",
      en: "PAP is a recurring and voluntary monthly contribution.",
    },
    ...overrides,
  };
}

describe("rate limiter", () => {
  it("blocks after the limit and recovers after the window", () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });

    expect(limiter.allow("a")).toBe(true);
    expect(limiter.allow("a")).toBe(true);
    expect(limiter.allow("a")).toBe(false);
    expect(limiter.allow("b")).toBe(true);

    time = 1001;
    expect(limiter.allow("a")).toBe(true);
  });
});

describe("generated quiz validation", () => {
  it("accepts a complete trilingual question", () => {
    const result = validateGeneratedQuestions({ questions: [validQuestion()] });
    expect(result).toHaveLength(1);
    expect(result[0]?.aiGenerated).toBe(true);
    expect(result[0]?.correct).toBe(0);
  });

  it("rejects incomplete translations, bad indices and wrong option counts", () => {
    expect(
      validateGeneratedQuestions({
        questions: [validQuestion({ question: { fr: "Que signifie PAP ?" } })],
      }),
    ).toHaveLength(0);

    expect(
      validateGeneratedQuestions({ questions: [validQuestion({ correct: 4 })] }),
    ).toHaveLength(0);

    expect(
      validateGeneratedQuestions({
        questions: [validQuestion({ options: [{ fr: "A", ar: "أ", en: "A" }] })],
      }),
    ).toHaveLength(0);
  });

  it("rejects out-of-range pages and unconfirmed minimum wording", () => {
    expect(
      validateGeneratedQuestions({ questions: [validQuestion({ sourcePage: 2 })] }),
    ).toHaveLength(0);

    expect(
      validateGeneratedQuestions({
        questions: [validQuestion({ explanation: {
          fr: "Le minimum de 10 DT est obligatoire.",
          ar: "الحد الأدنى هو 10 دينار.",
          en: "The minimum of 10 DT is mandatory.",
        } })],
      }),
    ).toHaveLength(0);
  });

  it("deduplicates questions with the same French prompt", () => {
    const result = validateGeneratedQuestions({
      questions: [validQuestion(), validQuestion()],
    });
    expect(result).toHaveLength(1);
  });

  it("parses JSON wrapped in prose", () => {
    expect(parseJsonObject('voici: {"a":1} merci')).toEqual({ a: 1 });
    expect(parseJsonObject("pas de json")).toBeNull();
  });
});
