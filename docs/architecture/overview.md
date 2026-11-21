# Architecture overview

## Shape

A single Next.js App Router page renders a client experience; two Node-runtime
API routes optionally call Groq through a shared server-only client. There is no
database and no server session.

```
Browser
  ExperienceProvider (lang, tab, in-memory profile, onboarding)
    AppShell
      Topbar: Brand + LanguageSelector
      TabPanel: Impact | PAP | Quiz | Assistant | Donate
      FloatingDock (hash routing, keyboard, swipe)
      WelcomeModal (focus trap, in-memory profile or guest)
  POST /api/assistant ──► PAP reference → curated fallback → optional Groq
  POST /api/quiz      ──► curated bank → optional Groq generation
```

## Layers

### `src/lib/pap` — pure domain

Framework-free and unit-tested:

- `domain.ts`: PAP constants, stages, formatting, official links, tab/hash
  helpers.
- `validation.ts`: donor profile and simulation input validation.
- `quiz.ts`: curated question bank, balanced selection, scoring, shuffle.
- `knowledge.ts`: reviewed chunks with topic, page and status; curated answers;
  unsupported-answer text.
- `retrieve.ts`: normalisation (accents, Arabic diacritics), keyword and token
  scoring, `MIN_RELEVANCE`, context builder.
- `answer.ts`: deterministic grounded answer and citations.

This layer has no React, DOM, network or environment access, so it can be tested
and reused on the server.

### `src/lib/i18n` — typed trilingual copy

`fr.ts`, `ar.ts`, `en.ts` implement the same `Dictionary` type. Arrays keep the
same lengths. `index.ts` exposes lookup, interpolation and direction helpers.
The language is persisted under `sos.pap.lang`; the default is always `fr`.

### `src/components` — presentation

- `experience/ExperienceProvider.tsx` owns language, active tab, in-memory
  profile, guest flag and onboarding state. It applies `lang`/`dir` to `<html>`.
- `AppShell.tsx` owns navigation: dock, arrow keys (direction-aware), touch
  swipe, hash sync and tab transition direction.
- `tabs/*` are one component per tab. They read copy through `useExperience`.
- `pixel/*` renders the original run-length sprites as SVG rects. `VillageScene`
  maps the simulation stage to the visible village. Blink frames and reduced
  motion are handled locally.
- `WelcomeModal` traps focus, validates the optional profile and offers a guest
  path. Nothing is sent anywhere.

### `src/app` — delivery

- `layout.tsx`: static French metadata and `<html lang="fr" dir="ltr">`.
- `page.tsx`: provider + shell.
- `api/assistant/route.ts`: input bounds, rate limit, full-reference prompt,
  optional Groq call, strict section validation, curated fallback.
- `api/quiz/route.ts`: rate limit, curated bank, optional trilingual generation,
  strict validation, balanced AI set or curated fallback.

### `src/lib/server` — server-only

- `groq.ts`: OpenAI-compatible Groq client, HTTPS base URL, timeout, silent
  failure. Never imported by a client component.
- `papReference.ts`: reads and caches `sos-tunisie-pap-reference.md` and parses
  its numbered `##` sections. `next.config.ts` traces the file for
  `/api/assistant`.
- `assistantAnswer.ts`: system prompt, JSON parsing and citation validation.
- `quizGeneration.ts`, `rateLimit.ts`: AI quiz validation and in-memory limits.

## Server safeguards

- **Secret isolation.** `GROQ_API_KEY` is read only in
  `src/lib/server/groq.ts`, the shared server-side client that calls Groq for
  both routes; no `NEXT_PUBLIC_` secret exists. Each route keeps strict output
  validation and a curated fallback. The base URL must parse and use HTTPS.
- **No raw output.** The assistant accepts only JSON with a bounded answer
  (20–1600 chars), a boolean `supported`, and section numbers that exist in the
  reference. Unsupported answers are returned without citations. Anything else
  returns the curated answer.
- **Quiz validation.** Generated questions must have two/three difficulty
  levels, a guide page in 3–17, four options, one valid index, complete FR/AR/EN
  strings and no mention of an unconfirmed minimum. Invalid items are dropped;
  empty results fall back to the curated bank.
- **Bounded input.** Questions are 3–600 characters; invalid bodies return 400.
- **Rate limiting.** In-memory fixed windows (assistant 20/min, quiz 10/min per
  client key). Suitable for a single instance; use a shared store to scale out.
- **Timeouts and silence.** Model calls abort on timeout and never throw or log
  secrets. Every failure path is curated.
- **Headers.** `next.config.ts` sets nosniff, frame denial, referrer policy and a
  restrictive permissions policy.

## Data flow: assistant

1. Validate `{question, lang}`.
2. Load the independent PAP reference and the curated fallback.
3. If a key exists, send the full reference with a strict system prompt that
   fixes the tone, forbids invented facts and specifies the answer language.
4. For Arabic, require warm Modern Standard Arabic; keep PAP/RIB terms where
   useful. Chat bubbles use `dir="auto"`.
5. Parse and validate; on success return `mode: "ai"`, the supported flag and
   citations mapped to reference sections (`source: "reference"`).
6. Otherwise return `mode: "curated"` with the deterministic answer.

## Data flow: quiz

1. Rate-limit the request.
2. If a key exists, ask for five trilingual questions (2 easy, 2 medium, 1 hard)
   from the reference facts.
3. Validate every item, including that its source page is one of the reference
   fact pages, and keep only accepted ones.
4. Require two easy, two medium and one hard accepted question; otherwise return
   the curated quiz. When satisfied, shuffle the five AI questions and return
   them.

## Styling

Tailwind v4 provides reset/utilities through `@tailwindcss/postcss`. The design
system is hand-written in `src/app/globals.css` and exposes `card`, `btn`,
`chat`, `scene`, `dock`, `modal`, `compare` and related classes. All colours are
CSS variables mapped to the six approved values. RTL uses logical properties and
a direction-aware layout. Motion respects `prefers-reduced-motion`.

## Decisions

- **No Postgres.** The brief forbids personal-data persistence; a database would
  add risk without product value. Language and session onboarding use storage.
- **Curated first.** The product is complete without an API key; AI is an
  enhancement behind validation.
- **Static shell.** One page keeps navigation instant and deploys to any Node
  host; the API routes are the only dynamic surface.
- **Original pixel art.** Sprites are hand-authored run-length rows rendered as
  SVG, keeping the palette and avoiding binary assets.

## Known limitations

- Official logo and font assets were not provided; `Brand` uses an original
  pixel mark.
- The source PDF was unavailable; curated facts come from the verified list in
  the brief. The assistant's AI mode uses the independent
  `sos-tunisie-pap-reference.md`; both must be reviewed against current SOS
  material.
- The Groq path is implemented with strict validation but untested end-to-end
  without a key.
- Rate limiting is per process.
