# Design: Groq model client (assistant + quiz)

**Date:** 2026-11-21
**Scope:** Small change.

## Intent and why

The existing AI client is `src/lib/server/deepseek.ts`. No key is configured, so
both the quiz and the assistant always fall back to curated content, and the
quiz repeats the same five questions. The user wants to insert a Groq API key and
have the model generate fresh questions with answers. They chose to **edit the
existing `deepseek.ts` file in place** rather than add a new client file, so both
routes will use Groq through that one module.

## Goals

- Make `src/lib/server/deepseek.ts` read Groq credentials from the environment
  and call Groq's OpenAI-compatible chat endpoint.
- Let each quiz attempt avoid prompts already shown in the current session.
- Keep all validation, grounding, rate limiting and curated fallbacks intact.
- Keep the public API of the client module (`chatCompletion`) so neither route
  needs a provider rewrite.

## Non-goals

- No new `groq.ts` file and no generic multi-provider abstraction.
- No key, model name or prompt history persisted beyond the React session.
- No change to the curated bank, validation rules or scoring UI.
- No claim of a live verified Groq call — that requires the user's key.

## Anti-goals

- Raw model output reaching the UI, or a generated question mentioning an
  unconfirmed minimum amount.
- Losing the curated fallback on missing key, timeout, bad JSON or invalid
  content.
- Leaking the key into a client bundle or a log.

## Constraints

- `src/lib/pap/*` stays pure and framework-free.
- `src/lib/server/*` stays server-only.
- API routes return typed payloads from `src/lib/api/types.ts` and always have a
  curated fallback.
- Strict TypeScript, no `any`.
- Verify with `npm test`, `npm run lint`, `npm run build`.

## Approaches considered

| Approach | Trade-off | Decision |
| --- | --- | --- |
| Edit `deepseek.ts` in place to call Groq | One file, both routes switch automatically; file name no longer matches provider | **Chosen by user** |
| Add a separate `groq.ts` for the quiz only | Keeps assistant on DeepSeek, but adds a second client and was declined | Rejected |
| Rename into a shared provider-neutral client | Cleaner naming, larger blast radius | Rejected |

## Design

### 1. `src/lib/server/deepseek.ts` (edited, filename unchanged)

- Keep `ChatMessage` and the exported `chatCompletion(messages, options)`.
- Rename the config surface to match its new provider: `GroqConfig`,
  `getGroqConfig()`, `isGroqConfigured()`.
- Environment: `GROQ_API_KEY` (required), `GROQ_BASE_URL` (default
  `https://api.groq.com/openai/v1`), `GROQ_MODEL` (default
  `llama-3.3-70b-versatile`), `GROQ_TIMEOUT_MS` (default 15000, must exceed
  1000). Reject empty keys and non-HTTPS base URLs.
- POST to `${baseUrl}/chat/completions` with a Bearer token, optional
  `response_format: { type: "json_object" }`, `max_tokens`, and `cache: "no-store"`.
- Add `temperature?: number` to the completion options, default 0.2 so the
  assistant keeps its current behaviour.
- Still aborts on timeout, never throws, never logs secrets, returns
  `string | null` on every failure.

Both `/api/assistant` and `/api/quiz` keep their existing import and therefore
use Groq automatically. The assistant's strict answer/citation validation stays
as-is; any Groq failure returns the curated answer.

### 2. `src/lib/pap/quiz.ts`

Export pure `questionFingerprint(question: QuizQuestion): string` — the
normalized French prompt key. Reuse it in the validator and in `QuizTab` so both
agree on what "the same question" means.

### 3. `src/lib/server/quizGeneration.ts`

- Add to `QUIZ_SYSTEM_PROMPT`: if the user message lists previously used
  prompts, do not reuse them or near-duplicates.
- Add `parseSeenPrompts(raw)` (accept string arrays, keep at most 20 entries,
  trim/collapse whitespace, cap each at 200 chars, return `[]` otherwise) and
  `buildQuizUserPrompt(facts, seen)`. These neutralize malformed or injected
  bodies.
- Use `questionFingerprint` for deduplication in `validateGeneratedQuestions`.

### 4. `src/app/api/quiz/route.ts`

- Parse optional JSON body `{ lang?, seen?: string[] }`, tolerating an empty or
  invalid body.
- Build the user message with
  `buildQuizUserPrompt(buildQuizFacts(QUIZ_REFERENCE_FACTS), seen)`.
- Call `chatCompletion` with `{ json: true, maxTokens: 2400, timeoutMs: 30000,
  temperature: 0.7 }`.
- Keep the rate limiter, `REFERENCE_PAGES` validation, balanced selection and
  `curatedQuiz()` fallback unchanged.

### 5. `src/components/tabs/QuizTab.tsx`

- Add `seenPrompts: string[]` React state, capped at 20 entries.
- POST `{ lang, seen: seenPrompts.slice(-12) }`.
- On a successful load, append each returned question's `questionFingerprint`.
- No `localStorage`, no persistence, no new i18n keys.

### 6. Configuration and docs

- `.env.example`: replace `DEEPSEEK_*` with `GROQ_*` variables and comments.
- `README.md`, `docs/architecture/overview.md`, `docs/specs/pap-revolution.md`:
  document that the shared client uses Groq, with curated fallback.
- `AGENTS.md`: update the AI-safeguard line from `DEEPSEEK_API_KEY` to
  `GROQ_API_KEY` and the client reference to `deepseek.ts` so the conventions
  stay accurate. Flagged here because it is a user convention file.

### 7. Tests

- `tests/deepseek.test.ts` (new): config from env, missing key, bad URL,
  non-HTTPS, timeout default, successful completion, failed fetch returning
  null, JSON mode, temperature forwarding, no secret logging.
- `tests/server.test.ts`: seen-prompt parsing and user-prompt construction;
  existing validation/selection tests remain green.
- `tests/quiz.test.ts`: `questionFingerprint` normalization.

## What is left to the builder

Implement tests first, then run `npm test`, `npm run lint`, `npm run build`.
Report that a live Groq call was **not** verified without a key; the user adds
`GROQ_API_KEY` to `.env.local` to exercise it.
