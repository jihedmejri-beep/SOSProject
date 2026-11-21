# Implementation plan and status

Status at the end of the build session. Update this file when a slice changes.

## Done

- [x] Next.js 15 + React 19 + TypeScript strict + Tailwind v4 + Vitest scaffold.
- [x] Security headers, environment template, npm scripts.
- [x] Typed trilingual dictionaries (FR default, AR RTL, EN) with structure tests.
- [x] PAP domain: constants, stages, formatting, official links, validation.
- [x] Curated quiz bank (12 questions, 3 languages, source pages) and scoring.
- [x] Reviewed knowledge base (13 chunks) + curated answers + unsupported path.
- [x] Keyword retrieval with French/Arabic/English normalisation.
- [x] Original pixel sprites and five-stage village scene, reduced motion aware.
- [x] Experience provider: language, tab, in-memory profile, guest, onboarding.
- [x] Brand, language selector, welcome modal with focus trap.
- [x] Floating dock: hash routing, keyboard arrows, touch swipe.
- [x] Impact tab: simulation and growing scene.
- [x] PAP tab: five-step journey and budget simulator.
- [x] Quiz tab: five balanced questions from the reference guide, feedback,
  explanations, restart.
- [x] Assistant tab: chat, suggestions, citations, status badges, retry, clear.
- [x] Donate tab: two official routes, comparison, official links.
- [x] `/api/assistant`: retrieval, curated fallback, validated Groq path.
- [x] `/api/quiz`: curated fallback, validated balanced trilingual generation.
- [x] Server safeguards: HTTPS config, input bounds, rate limiter, no raw output.
- [x] Tests: i18n, validation, domain, quiz, knowledge, sprites, palette, server.
- [x] Production build, typecheck and full test suite green.
- [x] README, AGENTS, GLOSSARY, spec, architecture and this plan.

## Verification

```text
npm test       91 passed
npm run lint   clean
npm run build  success (static /, dynamic /api/assistant and /api/quiz)
```

## Follow-ups (require product owner)

- [ ] Add the official SOS logo files to `public/` and replace the placeholder
  mark in `Brand`.
- [ ] Supply the official brand font and update the type scale in `globals.css`.
- [ ] Review every knowledge chunk against the final PAP guide PDF.
- [ ] Run the assistant and quiz against a real `GROQ_API_KEY` and record the
  result before claiming AI mode in production.
- [ ] Decide whether a shared rate-limit store is needed for the deployment.
- [ ] Confirm the current minimum contribution wording with SOS before publishing
  any amount.
