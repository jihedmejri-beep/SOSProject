import { describe, expect, it } from "vitest";
import {
  QUIZ_DISTRIBUTION,
  QUIZ_LENGTH,
  type Difficulty,
  type QuizQuestion,
} from "@/lib/pap/quiz";
import { QUIZ_REFERENCE_FACTS } from "@/lib/pap/quizReference";
import { createRateLimiter } from "@/lib/server/rateLimit";
import {
  QUIZ_SYSTEM_PROMPT,
  buildQuizFacts,
  buildQuizUserPrompt,
  parseJsonObject,
  parseQuizRequestBody,
  parseSeenPrompts,
  selectBalancedQuestions,
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

function generatedQuestion(id: string, difficulty: Difficulty): QuizQuestion {
  return {
    id,
    difficulty,
    topic: "ai-generated",
    sourcePage: 4,
    question: {
      fr: `Question ${id}`,
      ar: `سؤال ${id}`,
      en: `Question ${id}`,
    },
    options: [
      { fr: "A", ar: "أ", en: "A" },
      { fr: "B", ar: "ب", en: "B" },
      { fr: "C", ar: "ج", en: "C" },
      { fr: "D", ar: "د", en: "D" },
    ],
    correct: 0,
    explanation: {
      fr: "Explication de test suffisamment longue.",
      ar: "توضيح اختباري طويل بما يكفي.",
      en: "A sufficiently long test explanation.",
    },
    aiGenerated: true,
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

  it("rejects source pages outside the reference fact set", () => {
    const allowed = new Set(QUIZ_REFERENCE_FACTS.map((fact) => fact.page));
    expect(
      validateGeneratedQuestions({ questions: [validQuestion({ sourcePage: 12 })] }, allowed),
    ).toHaveLength(0);
    expect(
      validateGeneratedQuestions({ questions: [validQuestion({ sourcePage: 4 })] }, allowed),
    ).toHaveLength(1);
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

describe("generated quiz selection", () => {
  it("asks the model for exactly five questions with a 2/2/1 split", () => {
    expect(QUIZ_SYSTEM_PROMPT).toContain("exactly 5 questions");
    expect(QUIZ_SYSTEM_PROMPT).toContain("2 easy, 2 medium and 1 hard");
    expect(QUIZ_SYSTEM_PROMPT).toContain("ONLY the FACTS");
  });

  it("labels every reference fact with its guide page", () => {
    const facts = buildQuizFacts(QUIZ_REFERENCE_FACTS);
    for (const fact of QUIZ_REFERENCE_FACTS) {
      expect(facts).toContain(`[p.${fact.page}] ${fact.text}`);
    }
  });

  it("selects a balanced five-question quiz", () => {
    const generated = [
      generatedQuestion("e1", "easy"),
      generatedQuestion("e2", "easy"),
      generatedQuestion("e3", "easy"),
      generatedQuestion("m1", "medium"),
      generatedQuestion("m2", "medium"),
      generatedQuestion("m3", "medium"),
      generatedQuestion("h1", "hard"),
      generatedQuestion("h2", "hard"),
    ];
    const selected = selectBalancedQuestions(generated, () => 0.5);
    expect(selected).not.toBeNull();
    expect(selected).toHaveLength(QUIZ_LENGTH);
    for (const level of ["easy", "medium", "hard"] as const) {
      expect(selected?.filter((question) => question.difficulty === level)).toHaveLength(
        QUIZ_DISTRIBUTION[level],
      );
    }
  });

  it("rejects a generation that lacks a difficulty", () => {
    const generated = [
      generatedQuestion("e1", "easy"),
      generatedQuestion("e2", "easy"),
      generatedQuestion("m1", "medium"),
      generatedQuestion("m2", "medium"),
    ];
    expect(selectBalancedQuestions(generated)).toBeNull();
  });
});

describe("seen prompts", () => {
  it("accepts only string arrays, normalized and bounded", () => {
    expect(parseSeenPrompts(null)).toEqual([]);
    expect(parseSeenPrompts("not-an-array")).toEqual([]);
    expect(parseSeenPrompts([1, {}, "  Quelle   est  la  definition  "])).toEqual([
      "Quelle est la definition",
    ]);
    expect(parseSeenPrompts(Array.from({ length: 25 }, (_, i) => `q${i}`))).toHaveLength(20);
    expect(parseSeenPrompts(["x".repeat(250)])[0]).toHaveLength(200);
  });

  it("builds a user prompt with an AVOID block only when history exists", () => {
    const facts = "[p.4] PAP is a voluntary contribution.";
    expect(buildQuizUserPrompt(facts, [])).toContain(facts);
    expect(buildQuizUserPrompt(facts, [])).not.toContain("AVOID");
    const prompt = buildQuizUserPrompt(facts, ["Question A", "Question B"]);
    expect(prompt).toContain("AVOID");
    expect(prompt).toContain("1. Question A");
    expect(prompt).toContain("2. Question B");
  });

  it("parses the quiz request body tolerantly", () => {
    expect(parseQuizRequestBody(null)).toEqual({ seen: [] });
    expect(parseQuizRequestBody("not json")).toEqual({ seen: [] });
    expect(parseQuizRequestBody(JSON.stringify({ seen: [" Q1 "] }))).toEqual({ seen: ["Q1"] });
  });

  it("instructs the model not to reuse previous prompts", () => {
    expect(QUIZ_SYSTEM_PROMPT).toContain("previously used prompts");
  });
});
