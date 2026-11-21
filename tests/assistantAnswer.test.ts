import { describe, expect, it } from "vitest";
import {
  buildAssistantSystemPrompt,
  citationsFromSections,
  parseAssistantAnswer,
} from "@/lib/server/assistantAnswer";
import type { ReferenceSection } from "@/lib/server/papReference";

const SECTIONS: ReferenceSection[] = [
  { number: 1, title: "PAP at a glance", markdown: "## 1. PAP at a glance" },
  { number: 7, title: "How the monthly withdrawal works", markdown: "## 7. ..." },
];

const ARABIC_ANSWER = "يُسحب الاقتطاع عادةً في الخامس والعشرين من كل شهر، ويمكنك إيقافه بالتواصل مع SOS.";

describe("assistant system prompt", () => {
  it("grounds the answer in the reference and asks for Modern Standard Arabic", () => {
    const prompt = buildAssistantSystemPrompt("ar", "REFERENCE BODY");
    expect(prompt).toContain("REFERENCE BODY");
    expect(prompt).toContain("Modern Standard Arabic");
    expect(prompt).toContain("sectionNumbers");
    expect(prompt).toContain("Never invent");
  });

  it("uses the selected language", () => {
    expect(buildAssistantSystemPrompt("fr", "X")).toContain("reply in French");
    expect(buildAssistantSystemPrompt("en", "X")).toContain("reply in English");
  });
});

describe("assistant answer validation", () => {
  it("accepts a supported answer with an existing section", () => {
    const parsed = parseAssistantAnswer(
      JSON.stringify({
        answer: ARABIC_ANSWER,
        supported: true,
        sectionNumbers: [7],
        language: "ar",
      }),
      SECTIONS,
      "ar",
    );
    expect(parsed).toEqual({
      answer: ARABIC_ANSWER,
      supported: true,
      sections: [7],
    });
  });

  it("accepts an unsupported answer without citations", () => {
    const parsed = parseAssistantAnswer(
      JSON.stringify({
        answer: "لا تتوفر لديّ هذه المعلومة في المرجع، يرجى التحقق مع فريق SOS.",
        supported: false,
        sectionNumbers: [],
        language: "ar",
      }),
      SECTIONS,
      "ar",
    );
    expect(parsed?.supported).toBe(false);
    expect(parsed?.sections).toEqual([]);
  });

  it("rejects unsupported claims without a reference section", () => {
    const parsed = parseAssistantAnswer(
      JSON.stringify({
        answer: ARABIC_ANSWER,
        supported: true,
        sectionNumbers: [],
        language: "ar",
      }),
      SECTIONS,
      "ar",
    );
    expect(parsed).toBeNull();
  });

  it("rejects unknown sections, wrong language and malformed output", () => {
    const base = {
      answer: ARABIC_ANSWER,
      supported: true,
      sectionNumbers: [7],
      language: "ar",
    };
    expect(
      parseAssistantAnswer(
        JSON.stringify({ ...base, sectionNumbers: [99] }),
        SECTIONS,
        "ar",
      ),
    ).toBeNull();
    expect(
      parseAssistantAnswer(JSON.stringify({ ...base, language: "fr" }), SECTIONS, "ar"),
    ).toBeNull();
    expect(parseAssistantAnswer("not json", SECTIONS, "ar")).toBeNull();
    expect(
      parseAssistantAnswer(JSON.stringify({ ...base, answer: "short" }), SECTIONS, "ar"),
    ).toBeNull();
    expect(
      parseAssistantAnswer(JSON.stringify({ ...base, supported: "yes" }), SECTIONS, "ar"),
    ).toBeNull();
  });

  it("maps sections to reference citations", () => {
    expect(citationsFromSections(SECTIONS, [7])).toEqual([
      {
        page: 7,
        title: "How the monthly withdrawal works",
        status: "educational",
        source: "reference",
      },
    ]);
  });
});
