import type { QuizQuestion } from "@/lib/pap/quiz";

export type AnswerMode = "ai" | "curated";

export type CitationDto = {
  page: number;
  title: string;
  status: "official" | "historical" | "educational";
  source?: "guide" | "reference";
};

export type AssistantResponse = {
  answer: string;
  citations: CitationDto[];
  mode: AnswerMode;
  supported: boolean;
  topic: string | null;
};

export type QuizResponse = {
  mode: AnswerMode;
  questions: QuizQuestion[];
};

export type ApiError = {
  error: string;
};
