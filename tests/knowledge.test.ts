import { describe, expect, it } from "vitest";
import { LANGS } from "@/lib/i18n/types";
import { answerFromKnowledge } from "@/lib/pap/answer";
import {
  CURATED_ANSWERS,
  KNOWLEDGE,
  UNSUPPORTED_ANSWER,
} from "@/lib/pap/knowledge";
import { bestTopic, retrieve } from "@/lib/pap/retrieve";

const SUGGESTIONS: Array<{ lang: (typeof LANGS)[number]; question: string; topic: string }> = [
  { lang: "fr", question: "C'est quoi exactement le PAP ?", topic: "definition" },
  {
    lang: "fr",
    question: "Est-ce que je peux arrêter mon prélèvement ?",
    topic: "flexibility",
  },
  { lang: "fr", question: "Quelle est la date du prélèvement ?", topic: "dates" },
  { lang: "fr", question: "Quand le PAP est-il prélevé ?", topic: "dates" },
  {
    lang: "fr",
    question: "Quel type de compte bancaire faut-il ?",
    topic: "account",
  },
  { lang: "fr", question: "Puis-je choisir un enfant ?", topic: "privacy" },
  {
    lang: "fr",
    question: "Que se passe-t-il si mon compte manque de solde ?",
    topic: "failed",
  },
  { lang: "en", question: "What exactly is PAP?", topic: "definition" },
  { lang: "en", question: "Can I stop my debit?", topic: "flexibility" },
  { lang: "en", question: "When is the debit date?", topic: "dates" },
  {
    lang: "en",
    question: "What type of bank account is required?",
    topic: "account",
  },
  { lang: "en", question: "Can I choose a child?", topic: "privacy" },
  {
    lang: "en",
    question: "What happens if my account lacks funds?",
    topic: "failed",
  },
  { lang: "ar", question: "ما هو الاقتطاع بالضبط؟", topic: "definition" },
  { lang: "ar", question: "هل يمكنني إيقاف السحب؟", topic: "flexibility" },
  { lang: "ar", question: "ما هو تاريخ السحب؟", topic: "dates" },
  {
    lang: "ar",
    question: "أي نوع من الحسابات البنكية يلزم؟",
    topic: "account",
  },
  { lang: "ar", question: "هل يمكنني اختيار طفل؟", topic: "privacy" },
  {
    lang: "ar",
    question: "ماذا يحدث إذا لم يكفِ رصيد حسابي؟",
    topic: "failed",
  },
];

describe("knowledge base integrity", () => {
  it("has a page, text and keywords in every language for each chunk", () => {
    for (const chunk of KNOWLEDGE) {
      expect(chunk.page).toBeGreaterThanOrEqual(3);
      expect(chunk.page).toBeLessThanOrEqual(17);
      for (const lang of LANGS) {
        expect(chunk.text[lang].trim().length).toBeGreaterThan(20);
        expect(chunk.keywords[lang].length).toBeGreaterThan(0);
        expect(chunk.title[lang].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("has a curated answer for every chunk topic", () => {
    for (const chunk of KNOWLEDGE) {
      expect(CURATED_ANSWERS[chunk.topic]).toBeDefined();
      for (const lang of LANGS) {
        expect(CURATED_ANSWERS[chunk.topic]?.answer[lang].trim().length).toBeGreaterThan(20);
      }
    }
  });

  it("only cites pages that exist in the knowledge base", () => {
    const pages = new Set(KNOWLEDGE.map((chunk) => chunk.page));
    for (const answer of Object.values(CURATED_ANSWERS)) {
      for (const page of answer.pages) expect(pages.has(page)).toBe(true);
    }
  });
});

describe("retrieval", () => {
  it.each(SUGGESTIONS)("routes $question to $topic", ({ lang, question, topic }) => {
    const best = bestTopic(question, lang);
    expect(best).not.toBeNull();
    expect(best?.topic).toBe(topic);
  });

  it("returns hits ordered by score", () => {
    const hits = retrieve("Quelle est la date du prélèvement ?", "fr");
    expect(hits.length).toBeGreaterThan(0);
    for (let i = 1; i < hits.length; i += 1) {
      expect(hits[i - 1]!.score).toBeGreaterThanOrEqual(hits[i]!.score);
    }
  });

  it("does not claim support for unrelated questions", () => {
    const best = bestTopic("Quel est le prix d'une baguette à Paris ?", "fr");
    expect(best).toBeNull();
    const answer = answerFromKnowledge("Quel est le prix d'une baguette à Paris ?", "fr");
    expect(answer.supported).toBe(false);
    expect(answer.citations).toHaveLength(0);
    expect(answer.answer).toBe(UNSUPPORTED_ANSWER.fr);
  });
});

describe("grounded answers", () => {
  it("returns a citation for supported questions", () => {
    const answer = answerFromKnowledge("C'est quoi le PAP ?", "fr");
    expect(answer.supported).toBe(true);
    expect(answer.topic).toBe("definition");
    expect(answer.citations.map((citation) => citation.page)).toContain(4);
    expect(answer.answer).toContain("Prélèvement Automatique Permanent");
  });

  it("answers in the requested language", () => {
    const arabic = answerFromKnowledge("ما هو الاقتطاع بالضبط؟", "ar");
    const english = answerFromKnowledge("What exactly is PAP?", "en");
    expect(arabic.answer).toContain("الاقتطاع");
    expect(english.answer).toContain("voluntary contribution");
  });

  it("never invents a current minimum amount", () => {
    const answer = answerFromKnowledge("Quel est le montant minimum du PAP ?", "fr");
    expect(answer.supported).toBe(true);
    expect(answer.answer).toContain("ne confirme pas");
    expect(answer.citations[0]?.page).toBe(17);
  });
});
