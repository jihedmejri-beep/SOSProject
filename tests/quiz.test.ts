import { describe, expect, it } from "vitest";
import { LANGS } from "@/lib/i18n/types";
import { KNOWLEDGE } from "@/lib/pap/knowledge";
import {
  QUIZ_DISTRIBUTION,
  QUIZ_LENGTH,
  QUIZ_QUESTIONS,
  appendSeenPrompt,
  buildQuiz,
  questionFingerprint,
  questionsByDifficulty,
  scoreQuiz,
  shuffle,
  shuffleQuestionOptions,
} from "@/lib/pap/quiz";
import { QUIZ_REFERENCE_FACTS } from "@/lib/pap/quizReference";

function seededRng(seed = 42): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe("quiz reference facts", () => {
  it("keeps every fact on a guide page known to the knowledge base", () => {
    const pages = new Set(KNOWLEDGE.map((chunk) => chunk.page));
    for (const fact of QUIZ_REFERENCE_FACTS) {
      expect(pages.has(fact.page)).toBe(true);
      expect(fact.section).toBeGreaterThanOrEqual(1);
      expect(fact.text.trim().length).toBeGreaterThan(20);
    }
  });
});

describe("quiz question bank", () => {
  it("contains exactly five unique questions balanced 2/2/1", () => {
    const ids = QUIZ_QUESTIONS.map((question) => question.id);
    expect(QUIZ_LENGTH).toBe(5);
    expect(QUIZ_DISTRIBUTION).toEqual({ easy: 2, medium: 2, hard: 1 });
    expect(QUIZ_QUESTIONS).toHaveLength(QUIZ_LENGTH);
    expect(new Set(ids).size).toBe(ids.length);
    expect(questionsByDifficulty("easy")).toHaveLength(2);
    expect(questionsByDifficulty("medium")).toHaveLength(2);
    expect(questionsByDifficulty("hard")).toHaveLength(1);
  });

  it("grounds every curated question in a reference fact and page", () => {
    const facts = new Map(QUIZ_REFERENCE_FACTS.map((fact) => [fact.id, fact]));
    for (const question of QUIZ_QUESTIONS) {
      const fact = facts.get(question.topic);
      expect(fact).toBeDefined();
      expect(question.sourcePage).toBe(fact?.page);
    }
  });

  it("has complete translations and four options in every language", () => {
    for (const question of QUIZ_QUESTIONS) {
      for (const lang of LANGS) {
        expect(question.question[lang].trim().length).toBeGreaterThan(5);
        expect(question.options).toHaveLength(4);
        for (const option of question.options) {
          expect(option[lang].trim().length).toBeGreaterThan(0);
        }
        expect(question.explanation[lang].trim().length).toBeGreaterThan(10);
      }
    }
  });

  it("has exactly one valid correct answer and a guide page", () => {
    for (const question of QUIZ_QUESTIONS) {
      expect(question.correct).toBeGreaterThanOrEqual(0);
      expect(question.correct).toBeLessThan(question.options.length);
      expect(question.sourcePage).toBeGreaterThanOrEqual(3);
      expect(question.sourcePage).toBeLessThanOrEqual(17);
    }
  });

  it("does not present the historical minimum as an established fact", () => {
    for (const question of QUIZ_QUESTIONS) {
      const text = `${question.question.fr} ${question.options.map((o) => o.fr).join(" ")}`;
      expect(text.toLowerCase()).not.toContain("minimum de 10");
    }
  });
});

describe("quiz building and scoring", () => {
  it("builds five questions with the 2/2/1 split, without duplicates", () => {
    const quiz = buildQuiz(seededRng());
    expect(quiz).toHaveLength(QUIZ_LENGTH);
    expect(new Set(quiz.map((question) => question.id)).size).toBe(QUIZ_LENGTH);
    for (const level of ["easy", "medium", "hard"] as const) {
      expect(quiz.filter((question) => question.difficulty === level)).toHaveLength(
        QUIZ_DISTRIBUTION[level],
      );
    }
  });

  it("shuffles option order while preserving the correct answer", () => {
    const question = QUIZ_QUESTIONS[0]!;
    const answer = question.options[question.correct];
    const moved = shuffleQuestionOptions(question, () => 0);

    expect(new Set(moved.options)).toEqual(new Set(question.options));
    expect(moved.options[moved.correct]).toBe(answer);
    expect(moved.correct).not.toBe(0);
    expect(question.correct).toBe(0);
  });

  it("does not leave the correct answer in the first position", () => {
    const quiz = buildQuiz(() => 0);
    for (const question of quiz) {
      expect(question.correct).not.toBe(0);
    }
  });

  it("scores only correct answers", () => {
    const quiz = buildQuiz(seededRng(7));
    const answers: Record<string, number> = {};
    quiz.forEach((question, index) => {
      answers[question.id] = index % 2 === 0 ? question.correct : (question.correct + 1) % 4;
    });
    const result = scoreQuiz(answers, quiz);
    expect(result.total).toBe(QUIZ_LENGTH);
    expect(result.score).toBe(quiz.filter((_, index) => index % 2 === 0).length);
  });

  it("returns an empty score for unanswered questions", () => {
    const quiz = buildQuiz(seededRng(3));
    expect(scoreQuiz({}, quiz)).toEqual({ score: 0, total: QUIZ_LENGTH });
  });

  it("shuffle keeps all items", () => {
    const items = [1, 2, 3, 4, 5];
    const shuffled = shuffle(items, seededRng(9));
    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("question fingerprints", () => {
  it("normalizes case and whitespace in the French prompt", () => {
    const question = QUIZ_QUESTIONS[0]!;
    const noisy = {
      ...question,
      question: { ...question.question, fr: "  Quelle   AFFIRMATION décrit correctement le PAP ?  " },
    };
    expect(questionFingerprint(noisy)).toBe(questionFingerprint(question));
  });

  it("appends a fingerprint once and caps history at 20 entries", () => {
    const question = QUIZ_QUESTIONS[0]!;
    const fingerprint = questionFingerprint(question);
    const full = Array.from({ length: 20 }, (_, i) => `seen-${i}`);
    const capped = appendSeenPrompt(full, question);
    expect(capped).toHaveLength(20);
    expect(capped[capped.length - 1]).toBe(fingerprint);
    expect(capped[0]).toBe("seen-1");
    const once = appendSeenPrompt(["older"], question);
    expect(appendSeenPrompt(once, question)).toEqual(once);
  });
});
