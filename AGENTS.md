# Agent conventions

Read this before changing the project. The authoritative product brief is
`Prompt.md`; the distilled version is `docs/specs/pap-revolution.md`.

## Commands

```bash
npm test            # vitest run, must stay green
npm run lint        # tsc --noEmit, must stay clean
npm run build       # production build, must succeed
```

Run all three before declaring work complete. Do not add a test framework or a
second linter; Vitest and `tsc` are the established tools.

## Hard product rules

- The experience always starts in **French**; Arabic is RTL, English is LTR.
- Only these six colours may appear in `src/`: `#08A9E0`, `#1D3768`, `#E2556A`,
  `#EFFAFF`, `#CFEAF5`, `#FFFFFF`. Use opacity for depth.
  `tests/palette.test.ts` enforces this.
- No personal data persistence and no real payment flow. The profile lives in
  browser memory; only the language and the session onboarding flag persist.
- Every factual PAP claim must trace to a `KNOWLEDGE` chunk with a guide page.
  Never invent dates, amounts, eligibility rules, guarantees or links.
- The historical 10 DT minimum is **historical**, not an established current
  rule. Never phrase it as mandatory.
- Never claim an external integration works unless it was actually tested.
  Without `DEEPSEEK_API_KEY`, the product is in curated mode.

## Code layout

- `src/lib/pap/*` is pure, framework-free and unit-tested. Keep it that way.
- `src/lib/i18n/*`: add a key to `fr.ts`, `ar.ts` and `en.ts` together;
  `tests/i18n.test.ts` checks identical structures and array lengths.
- `src/components/tabs/*`: one component per tab, copy through `useExperience`.
- `src/lib/server/*`: server-only. Never import it from a client component.
- API routes return typed payloads from `src/lib/api/types.ts` and always have a
  curated fallback.

## Style

- TypeScript strict, no `any` in new code. Prefer narrow types and type guards.
- Tailwind v4 is installed for reset/utilities, but the design system lives in
  `src/app/globals.css`; reuse its classes (`card`, `btn`, `chat`, `scene`…).
- Do not add comments that restate code. Keep the existing doc-comment style for
  non-obvious invariants only.
- Client components need `"use client"`; keep data logic out of them.

## AI safeguards

- DeepSeek is called only server-side through `src/lib/server/deepseek.ts`.
- Validate model output before returning it: citation pages must be a subset of
  the retrieved pages, answers are length-bounded, quiz questions must be
  complete in all three languages and must not mention an unconfirmed minimum.
- On any error, timeout, missing key or failed validation, return curated
  content. Never surface raw model output.
