import { pickLocalized, pickLocalizedList } from "@/lib/i18n/localized";
import type { Lang } from "@/lib/i18n/types";
import { KNOWLEDGE, type KnowledgeChunk } from "./knowledge";

export type RetrievalHit = {
  chunk: KnowledgeChunk;
  score: number;
};

export const MIN_RELEVANCE = 5;

const STOPWORDS: Record<Lang, Set<string>> = {
  fr: new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "à", "au",
    "aux", "en", "dans", "sur", "pour", "par", "avec", "sans", "que", "qui",
    "quoi", "est", "ce", "cette", "ces", "il", "elle", "on", "je", "tu", "nous",
    "vous", "mon", "ma", "mes", "son", "sa", "ses", "se", "si", "ne", "pas",
    "plus", "moins", "comment", "quel", "quelle", "quels", "quelles", "the",
    "a", "an", "is", "are", "can", "i", "my", "what", "how", "do", "does",
  ]),
  ar: new Set([
    "في", "من", "على", "إلى", "عن", "مع", "هو", "هي", "هل", "ما", "ماذا",
    "كيف", "أي", "التي", "الذي", "و", "أو", "أن", "إن", "لا", "نعم", "هذا",
    "هذه", "ذلك", "تلك", "لي", "لك", "لدي", "عندي", "يمكن", "يتم",
  ]),
  en: new Set([
    "the", "a", "an", "is", "are", "was", "were", "do", "does", "did", "can",
    "could", "i", "my", "me", "you", "your", "it", "its", "of", "to", "in",
    "on", "for", "with", "without", "and", "or", "what", "which", "how",
    "when", "where", "who", "why", "about", "there", "this", "that", "these",
    "those", "be", "have", "has", "if", "at", "by", "from", "as", "we",
  ]),
};

const ARABIC_DIACRITICS = /[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g;

export function normalizeForSearch(text: string, lang: Lang): string {
  let value = text.toLowerCase();
  if (lang === "ar") {
    value = value
      .replace(ARABIC_DIACRITICS, "")
      .replace(/\u0640/g, "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[ؤئ]/g, "ء");
  } else {
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return value
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string, lang: Lang): string[] {
  const normalized = normalizeForSearch(text, lang);
  if (!normalized) return [];
  return normalized
    .split(" ")
    .filter((token) => token.length > 1 && !STOPWORDS[lang].has(token));
}

function scoreChunk(question: string, lang: Lang, chunk: KnowledgeChunk): number {
  const questionNorm = normalizeForSearch(question, lang);
  const questionTokens = new Set(tokenize(question, lang));
  const seenKeywords = new Set<string>();
  let score = 0;
  let keywordScore = 0;

  for (const keywordLang of ["fr", "ar", "en"] as Lang[]) {
    for (const rawKeyword of pickLocalizedList(chunk.keywords, keywordLang)) {
      const keyword = normalizeForSearch(rawKeyword, keywordLang);
      if (keyword.length < 2 || seenKeywords.has(keyword)) continue;
      seenKeywords.add(keyword);
      if (questionNorm.includes(keyword)) {
        keywordScore += keyword.includes(" ") ? 7 : 5;
      }
    }
  }
  score += Math.min(keywordScore, 20);

  const chunkTokens = new Set(tokenize(pickLocalized(chunk.text, lang), lang));
  let overlap = 0;
  for (const token of questionTokens) {
    if (chunkTokens.has(token)) overlap += 1;
  }
  score += Math.min(overlap, 6);

  return score;
}

export function retrieve(question: string, lang: Lang, limit = 4): RetrievalHit[] {
  return KNOWLEDGE.map((chunk) => ({ chunk, score: scoreChunk(question, lang, chunk) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.page - b.chunk.page)
    .slice(0, limit);
}

export function bestTopic(
  question: string,
  lang: Lang,
): { topic: string; hits: RetrievalHit[] } | null {
  const hits = retrieve(question, lang, 4);
  const top = hits[0];
  if (!top || top.score < MIN_RELEVANCE) return null;
  return { topic: top.chunk.topic, hits };
}

export function buildContext(hits: RetrievalHit[], lang: Lang): string {
  return hits
    .map(
      (hit) =>
        `[Guide p.${hit.chunk.page} — ${pickLocalized(hit.chunk.title, lang)}]\n${pickLocalized(hit.chunk.text, lang)}`,
    )
    .join("\n\n");
}
