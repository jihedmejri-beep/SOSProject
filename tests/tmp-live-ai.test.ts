import { readFileSync } from "node:fs";
import { describe, it } from "vitest";
import { KNOWLEDGE } from "@/lib/pap/knowledge";
import { buildAssistantSystemPrompt, parseAssistantAnswer } from "@/lib/server/assistantAnswer";
import { chatCompletion, getGroqConfig } from "@/lib/server/groq";
import { loadPapReference } from "@/lib/server/papReference";
import {
  parseJsonObject,
  validateGeneratedQuestions,
} from "@/lib/server/quizGeneration";

const text = readFileSync(".env.local", "utf8");
for (const line of text.split(/\r?\n/)) {
  const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (match) process.env[match[1]!] = match[2]!;
}

const QUIZ_SYSTEM_PROMPT = [
  "You write a short quiz about the PAP (Prélèvement Automatique Permanent) of SOS Villages d'Enfants Tunisie.",
  "Use ONLY the FACTS provided.",
  "Never present an unconfirmed minimum amount as an official rule; avoid the word minimum entirely.",
  "Write exactly 6 questions: 2 easy, 2 medium, 2 hard.",
  "Every question, option and explanation must be provided in French (fr), Arabic (ar) and English (en).",
  "Each question has exactly 4 options and one correct index from 0 to 3.",
  "sourcePage must be a page number present in the FACTS.",
  'Return ONLY JSON: {"questions":[{"difficulty":"easy","sourcePage":4,"question":{"fr":"","ar":"","en":""},"options":[{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""},{"fr":"","ar":"","en":""}],"correct":0,"explanation":{"fr":"","ar":"","en":""}}]}.',
].join(" ");

const FACTS = KNOWLEDGE.map((chunk) => `[p.${chunk.page}] ${chunk.text.fr}`).join("\n");

describe("temporary live AI diagnostics", () => {
  it("prints the raw assistant output for French", async () => {
    const reference = loadPapReference();
    if (!reference) throw new Error("reference missing");
    const raw = await chatCompletion(
      [
        { role: "system", content: buildAssistantSystemPrompt("fr", reference.text) },
        { role: "user", content: "Quelle est la date du prélèvement ?" },
      ],
      { json: true, maxTokens: 1200, timeoutMs: 60000 },
    );
    console.log("RAW_FR", raw);
    console.log("PARSED_FR", JSON.stringify(parseAssistantAnswer(raw, reference.sections, "fr")));
  }, 90000);

  it("prints the raw assistant output for Arabic", async () => {
    const reference = loadPapReference();
    if (!reference) throw new Error("reference missing");
    const raw = await chatCompletion(
      [
        { role: "system", content: buildAssistantSystemPrompt("ar", reference.text) },
        { role: "user", content: "ما هو تاريخ السحب؟" },
      ],
      { json: true, maxTokens: 1200, timeoutMs: 60000 },
    );
    console.log("RAW_AR", raw);
    console.log("PARSED_AR", JSON.stringify(parseAssistantAnswer(raw, reference.sections, "ar")));
  }, 90000);

  it("prints the raw quiz output", async () => {
    const raw = await chatCompletion(
      [
        { role: "system", content: QUIZ_SYSTEM_PROMPT },
        { role: "user", content: `FACTS:\n${FACTS}` },
      ],
      { json: true, maxTokens: 2400, timeoutMs: 60000 },
    );
    const parsed = parseJsonObject(raw);
    const valid = validateGeneratedQuestions(parsed);
    console.log("RAW_QUIZ", raw);
    console.log("VALID_QUIZ", valid.length, valid.map((q) => q.difficulty));
  }, 90000);
});
