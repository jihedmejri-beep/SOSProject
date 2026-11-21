import { pickLocalized } from "@/lib/i18n/localized";
import type { Lang } from "@/lib/i18n/types";
import {
  CURATED_ANSWERS,
  KNOWLEDGE,
  UNSUPPORTED_ANSWER,
  type SourceStatus,
} from "./knowledge";
import { bestTopic, type RetrievalHit } from "./retrieve";

export type Citation = {
  page: number;
  title: string;
  status: SourceStatus;
  source?: "guide" | "reference";
};

export type GroundedAnswer = {
  supported: boolean;
  topic: string | null;
  answer: string;
  citations: Citation[];
};

function citationsForPages(pages: number[], lang: Lang): Citation[] {
  const seen = new Set<number>();
  const citations: Citation[] = [];
  for (const page of pages) {
    if (seen.has(page)) continue;
    const chunk = KNOWLEDGE.find((item) => item.page === page);
    if (!chunk) continue;
    seen.add(page);
    citations.push({
      page,
      title: pickLocalized(chunk.title, lang),
      status: chunk.status,
      source: "guide",
    });
  }
  return citations;
}

/**
 * Deterministic, source-grounded answer. Used directly when the model is not
 * configured or unavailable, and as a validation fallback otherwise.
 */
export function answerFromKnowledge(question: string, lang: Lang): GroundedAnswer {
  const best = bestTopic(question, lang);
  if (!best) {
    return {
      supported: false,
      topic: null,
      answer: pickLocalized(UNSUPPORTED_ANSWER, lang),
      citations: [],
    };
  }

  const curated = CURATED_ANSWERS[best.topic];
  const chunk = best.hits.find((hit) => hit.chunk.topic === best.topic)?.chunk;
  const answer = curated
    ? pickLocalized(curated.answer, lang)
    : chunk
      ? pickLocalized(chunk.text, lang)
      : pickLocalized(UNSUPPORTED_ANSWER, lang);
  const pages = curated ? curated.pages : chunk ? [chunk.page] : [];

  return {
    supported: true,
    topic: best.topic,
    answer,
    citations: citationsForPages(pages, lang),
  };
}

export function citationsFromHits(hits: RetrievalHit[], lang: Lang): Citation[] {
  return citationsForPages(
    hits.map((hit) => hit.chunk.page),
    lang,
  );
}
