# Groq Model Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Point the existing server client at Groq so the assistant and quiz generate model-backed answers/questions, with the quiz avoiding prompts already seen in the session.

**Architecture:** Keep the filename `src/lib/server/deepseek.ts` and the exported `chatCompletion()` signature, but read `GROQ_*` env vars and call Groq's OpenAI-compatible chat endpoint. Both API routes keep their imports and strict validators; the quiz additionally receives in-memory seen-question fingerprints from the client and injects them into its generation prompt. All failure paths stay curated.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Vitest 3, Groq OpenAI-compatible `/chat/completions`.

**Spec:** `docs/superpowers/specs/2026-11-21-groq-quiz-generation-design.md`

## Global Constraints

- The experience always starts in **French**; Arabic is RTL, English is LTR.
- Only these six colours may appear in `src/`: `#08A9E0`, `#1D3768`, `#E2556A`, `#EFFAFF`, `#CFEAF5`, `#FFFFFF`. Use opacity for depth.
- No personal-data persistence and no real payment flow. The profile lives in browser memory; only the language and the session onboarding flag persist.
- Every factual PAP claim must trace to a `KNOWLEDGE` chunk with a guide page. Never invent dates, amounts, eligibility rules, guarantees or links.
- The historical 10 DT minimum is **historical**, never phrased as mandatory.
- Never claim an external integration works unless it was actually tested. Without `GROQ_API_KEY`, the product is in curated mode.
- `src/lib/pap/*` is pure, framework-free and unit-tested. `src/lib/server/*` is server-only; never import it from a client component.
- Add i18n keys to `fr.ts`, `ar.ts` and `en.ts` together. This plan adds no new keys.
- API routes return typed payloads from `src/lib/api/types.ts` and always have a curated fallback.
- TypeScript strict, no `any` in new code. Client components need `"use client"`.
- Verify with `npm test`, `npm run lint`, `npm run build`.
- The working tree already contains uncommitted quiz-generation changes. Stage only the files named in each task (including their pre-existing edits); do not sweep unrelated files into a commit.

## Review Focus

These inputs are not fully exercised by a single task's own tests; each is pinned to the task named below.

- Missing `GROQ_API_KEY` must make `chatCompletion()` return `null` without any network call — Task 1 config tests.
- A timeout, non-2xx response or malformed JSON must return `null` and never throw — Task 1 fetch tests.
- A hostile `seen` body (wrong type, newlines, >20 entries, >200 chars per entry) must be reduced or rejected before reaching the prompt — Task 3 `parseSeenPrompts` tests.
- Groq JSON with an out-of-range page or "minimum" wording must be dropped and fall back to curated — Task 3 keeps the existing validator test in `tests/server.test.ts`.
- The key must never enter the client bundle or a log, and seen prompts must never reach `localStorage` — Task 6 grep verification.

---

### Task 1: Groq client configuration and completions

**Files:**
- Modify: `src/lib/server/deepseek.ts`
- Test: `tests/deepseek.test.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: `GroqConfig`, `getGroqConfig(): GroqConfig | null`, `isGroqConfigured(): boolean`, `chatCompletion(messages: ChatMessage[], options?: CompletionOptions): Promise<string | null>` where `CompletionOptions = { maxTokens?: number; json?: boolean; timeoutMs?: number; temperature?: number }`. Existing callers keep working unchanged.

- [ ] **Step 1: Write the failing tests**

Create `tests/deepseek.test.ts` with this setup and cases:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGroqConfig, isGroqConfigured, chatCompletion } from "@/lib/server/deepseek";

beforeEach(() => {
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("GROQ_BASE_URL", "");
  vi.stubEnv("GROQ_MODEL", "");
  vi.stubEnv("GROQ_TIMEOUT_MS", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
```

Cases:
- no key: `getGroqConfig()` is `null`, `isGroqConfigured()` is `false`, and `await chatCompletion([{ role: "user", content: "hi" }])` is `null` with `fetch` not called.
- valid env: with `GROQ_API_KEY="gsk_test"`, `GROQ_BASE_URL="https://api.groq.com/openai/v1/"`, `GROQ_MODEL="custom-model"`, `GROQ_TIMEOUT_MS="9000"`, expect `getGroqConfig()` to equal `{ apiKey: "gsk_test", baseUrl: "https://api.groq.com/openai/v1", model: "custom-model", timeoutMs: 9000 }`.
- defaults: with only the key set, expect `baseUrl === "https://api.groq.com/openai/v1"`, `model === "llama-3.3-70b-versatile"`, `timeoutMs === 15000`.
- bad URL (`"not a url"`) and HTTP URL (`"http://api.groq.com/openai/v1"`): both give `null`.
- low timeout (`"200"`): falls back to `15000`.
- success: stub `globalThis.fetch` to resolve `new Response(JSON.stringify({ choices: [{ message: { content: "hello" } }] }), { status: 200 })`; expect `chatCompletion([...], { json: true, maxTokens: 2400, temperature: 0.7 })` to be `"hello"`, the URL to end with `/chat/completions`, the `Authorization` header to be `Bearer gsk_test`, and the parsed request body to contain `response_format: { type: "json_object" }`, `max_tokens: 2400` and `temperature: 0.7`.
- failures: non-2xx, malformed JSON, missing `choices`, and a throwing `fetch` each return `null` without throwing; assert neither console spy was called with `gsk_test`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/deepseek.test.ts`
Expected: FAIL — `getGroqConfig` / `isGroqConfigured` are not exported.

- [ ] **Step 3: Implement the client in `src/lib/server/deepseek.ts`**

Keep the filename and the `ChatMessage` type. Replace the config block with `GroqConfig`, `getGroqConfig()` and `isGroqConfigured()` using the exact env names and defaults pinned in the tests; require HTTPS and reject malformed URLs. Add `temperature?: number` to `CompletionOptions` and send `temperature: options.temperature ?? 0.2` in the body. Preserve the existing abort/timeout, `cache: "no-store"`, null-on-error behaviour and absence of logging. Rename the exported config names to the Groq names; leave `chatCompletion` intact.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/deepseek.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/deepseek.ts tests/deepseek.test.ts
git commit -m "feat: point server chat client at Groq"
```

---

### Task 2: Shared question fingerprint helpers

**Files:**
- Modify: `src/lib/pap/quiz.ts`
- Modify: `src/lib/server/quizGeneration.ts`
- Test: `tests/quiz.test.ts`

**Interfaces:**
- Consumes: `QuizQuestion` from `src/lib/pap/quiz.ts`.
- Produces: `questionFingerprint(question: QuizQuestion): string`, `appendSeenPrompt(seen: string[], question: QuizQuestion): string[]`.

- [ ] **Step 1: Write the failing tests**

Add to `tests/quiz.test.ts` (import the two functions from `@/lib/pap/quiz`):

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/quiz.test.ts`
Expected: FAIL — the named exports do not exist.

- [ ] **Step 3: Implement the helpers**

In `src/lib/pap/quiz.ts`, define `questionFingerprint` as `question.question.fr.trim().toLowerCase().replace(/\s+/g, " ")` and `appendSeenPrompt` as an immutable append that skips duplicates and drops the oldest entry when the list reaches 20. In `src/lib/server/quizGeneration.ts`, replace the inline French-prompt fingerprint in `validateGeneratedQuestions` with `questionFingerprint(raw as QuizQuestion)` (or the equivalent normalized key) so deduplication semantics stay identical.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/quiz.test.ts tests/server.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pap/quiz.ts src/lib/server/quizGeneration.ts tests/quiz.test.ts
git commit -m "refactor: share quiz question fingerprinting"
```

---

### Task 3: Seen-prompt parsing and quiz generation prompt

**Files:**
- Modify: `src/lib/server/quizGeneration.ts`
- Test: `tests/server.test.ts`

**Interfaces:**
- Consumes: `buildQuizFacts` (existing) and `questionFingerprint` from Task 2.
- Produces: `parseSeenPrompts(raw: unknown): string[]`, `buildQuizUserPrompt(facts: string, seen: string[]): string`, `parseQuizRequestBody(raw: string | null): { seen: string[] }`.

- [ ] **Step 1: Write the failing tests**

Add to `tests/server.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/server.test.ts`
Expected: FAIL — the three helpers are not exported and the prompt line is missing.

- [ ] **Step 3: Implement the helpers**

In `src/lib/server/quizGeneration.ts`:
- `parseSeenPrompts`: return `[]` unless `Array.isArray(raw)`; for each string item collapse whitespace and trim, skip empties, slice to 200 chars, then cap the final list at 20.
- `buildQuizUserPrompt`: start with `FACTS:\n${facts}`; when `seen` is non-empty append `\n\nAVOID THESE PREVIOUS QUESTION PROMPTS (do not reuse or paraphrase):\n` followed by `${i + 1}. ${prompt}` lines.
- `parseQuizRequestBody`: return `{ seen: [] }` for `null`/invalid JSON/non-object; otherwise `{ seen: parseSeenPrompts((parsed as { seen?: unknown }).seen) }`.
- Append the system-prompt sentence: "If the user message lists previously used prompts, do not reuse them or near-duplicates."

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/server.test.ts`
Expected: PASS, including the pre-existing validation and selection tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/quizGeneration.ts tests/server.test.ts
git commit -m "feat: add seen-prompt handling to quiz generation"
```

---

### Task 4: Wire the quiz route to the new prompt and temperature

**Files:**
- Modify: `src/app/api/quiz/route.ts`
- Test: `tests/quizRoute.test.ts` (create)

**Interfaces:**
- Consumes: `chatCompletion` from Task 1, `parseQuizRequestBody` and `buildQuizUserPrompt` from Task 3, `curatedQuiz()` behaviour already in the route.
- Produces: no new exports; the POST endpoint now forwards seen prompts and `temperature: 0.7`.

- [ ] **Step 1: Write the failing tests**

Create `tests/quizRoute.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ chatCompletion: vi.fn() }));
vi.mock("@/lib/server/deepseek", () => ({ chatCompletion: mocks.chatCompletion }));

import { POST } from "@/app/api/quiz/route";

const request = (body: unknown, ip: string) =>
  new Request("http://localhost/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-real-ip": ip },
    body: body === undefined ? "" : JSON.stringify(body),
  });

beforeEach(() => mocks.chatCompletion.mockReset());

describe("quiz route", () => {
  it("returns the curated quiz when the model call fails", async () => {
    mocks.chatCompletion.mockResolvedValue(null);
    const response = await POST(request({}, "route-fallback"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ mode: "curated" });
  });

  it("forwards normalized seen prompts and generation options", async () => {
    mocks.chatCompletion.mockResolvedValue(null);
    await POST(request({ seen: ["  Quelle   definition  "] }, "route-args"));
    const [messages, options] = mocks.chatCompletion.mock.calls[0]!;
    expect(options).toMatchObject({ json: true, maxTokens: 2400, timeoutMs: 30000, temperature: 0.7 });
    expect(messages[1].content).toContain("AVOID");
    expect(messages[1].content).toContain("Quelle definition");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/quizRoute.test.ts`
Expected: FAIL — options have no `temperature: 0.7` and the user message has no AVOID block.

- [ ] **Step 3: Implement the route change**

In `src/app/api/quiz/route.ts`: parse the body with `parseQuizRequestBody(await request.text().catch(() => null))`; build the user message with `buildQuizUserPrompt(buildQuizFacts(QUIZ_REFERENCE_FACTS), seen)`; pass `{ json: true, maxTokens: 2400, timeoutMs: 30000, temperature: 0.7 }` to `chatCompletion`. Keep the rate limiter, `REFERENCE_PAGES`, `validateGeneratedQuestions`, `selectBalancedQuestions` and `curatedQuiz()` exactly as they are.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/quizRoute.test.ts tests/server.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/quiz/route.ts tests/quizRoute.test.ts
git commit -m "feat: send quiz history and variation settings to Groq"
```

---

### Task 5: Track seen questions in the quiz tab

**Files:**
- Modify: `src/components/tabs/QuizTab.tsx`

**Interfaces:**
- Consumes: `questionFingerprint` and `appendSeenPrompt` from Task 2.
- Produces: no new exports; the POST body now includes `seen`.

- [ ] **Step 1: Add in-memory history**

In `src/components/tabs/QuizTab.tsx`, add `const [seenPrompts, setSeenPrompts] = useState<string[]>([]);` near the other state. In `start()`, POST `JSON.stringify({ lang, seen: seenPrompts.slice(-12) })`. After a successful load (inside the branch where `loaded.length > 0` from the API), compute `loaded.reduce(appendSeenPrompt, seenPrompts)` and set it. Do not write to `localStorage` or add i18n keys. Keep the existing curated fallback and validation untouched.

- [ ] **Step 2: Verify types and build**

Run: `npm run lint && npm run build`
Expected: both succeed; no `any`, no client import of `src/lib/server/*`.

- [ ] **Step 3: Commit**

```bash
git add src/components/tabs/QuizTab.tsx
git commit -m "feat: remember quiz prompts within the session"
```

---

### Task 6: Configuration, documentation and final verification

**Files:**
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `docs/architecture/overview.md`
- Modify: `docs/specs/pap-revolution.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Update environment template**

Replace the `DEEPSEEK_*` block in `.env.example` with:

```env
# Server-side Groq configuration (used by /api/assistant and /api/quiz).
# Leave GROQ_API_KEY empty to run in curated (offline) demonstration mode.
GROQ_API_KEY=
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile

# Optional: request timeout in milliseconds for the model call.
GROQ_TIMEOUT_MS=15000
```

- [ ] **Step 2: Update docs**

In `README.md`, `docs/architecture/overview.md` and `docs/specs/pap-revolution.md`, replace DeepSeek env references with `GROQ_API_KEY` and note that the shared client in `src/lib/server/deepseek.ts` calls Groq while both routes keep strict validation and curated fallback. In `AGENTS.md`, change the AI-safeguard line about `DEEPSEEK_API_KEY` to `GROQ_API_KEY` and keep the DeepSeek-only-call rule reworded for the shared client. Do not change any other product rule.

- [ ] **Step 3: Verify no secrets or history reach the client**

Run (PowerShell — `grep` is not available in this shell):

```powershell
Select-String -Path (Get-ChildItem src -Recurse -Include *.ts,*.tsx).FullName -Pattern 'GROQ_API_KEY|NEXT_PUBLIC_' | ForEach-Object { "$($_.Path):$($_.LineNumber):$($_.Line.Trim())" }
Select-String -Path src/components/tabs/QuizTab.tsx -Pattern 'localStorage'
```

Expected: `GROQ_API_KEY` appears only under `src\lib\server\`; no `NEXT_PUBLIC_` secret; no `localStorage` in `QuizTab.tsx`.

- [ ] **Step 4: Run the full verification suite**

Run: `npm test && npm run lint && npm run build`
Expected: all three succeed.

- [ ] **Step 5: Commit**

```bash
git add .env.example README.md docs/architecture/overview.md docs/specs/pap-revolution.md AGENTS.md
git commit -m "docs: document Groq configuration and curated fallback"
```
