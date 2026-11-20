import { describe, expect, it } from "vitest";
import { LANGS } from "@/lib/i18n/types";
import {
  QUIZ_LENGTH,
  QUIZ_QUESTIONS,
  QUESTIONS_PER_LEVEL,
  buildQuiz,
  questionsByDifficulty,
  scoreQuiz,
  shuffle,
} from "@/lib/pap/quiz";

function seededRng(seed = 42): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe("quiz question bank", () => {
  it("contains unique ids and 4 questions per difficulty", () => {
    const ids = QUIZ_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(questionsByDifficulty("easy")).toHaveLength(4);
    expect(questionsByDifficulty("medium")).toHaveLength(4);
    expect(questionsByDifficulty("hard")).toHaveLength(4);
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
  it("builds six questions, two per difficulty, without duplicates", () => {
    const quiz = buildQuiz(seededRng());
    expect(quiz).toHaveLength(QUIZ_LENGTH);
    expect(new Set(quiz.map((question) => question.id)).size).toBe(QUIZ_LENGTH);
    for (const level of ["easy", "medium", "hard"] as const) {
      expect(quiz.filter((question) => question.difficulty === level)).toHaveLength(
        QUESTIONS_PER_LEVEL,
      );
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
    expect(result.score).toBe(3);
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
