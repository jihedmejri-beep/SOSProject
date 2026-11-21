# PAP Revolution — product specification

Distilled from `Prompt.md` (authoritative). This file records the stable product
intent; update it only when the brief changes.

## Problem

Many potential supporters do not understand what the PAP is, how the monthly
debit works, or how it differs from a one-off donation. Confusion about the
mandate, the debit date, failed debits and the historical 10 DT minimum blocks
trust and conversion.

## Goal

A single-page, mobile-first educational experience that makes the PAP obvious,
trustworthy and memorable, and routes interested visitors to the official SOS
Tunisie pages. It must feel like a warm, modern pixel-art village rather than a
bank form.

## Audience

- French-first visitors in Tunisia and the diaspora.
- Arabic readers who need a native RTL experience.
- English readers who need a clear explanation.
- Low-attention mobile users arriving from social channels.

## Experience

Five tabs, one per vertical slice:

1. **Impact** — a pixel-art child and village that grow across five stages as
   simulated monthly contributions accumulate. The scene is the emotional anchor.
2. **PAP** — an interactive, five-step journey: what PAP is, the mandate, the
   monthly debit, the 25th/5th calendar, and how to change or stop it. Includes a
   transparent monthly-budget simulator.
3. **Quiz** — six questions (two easy, two medium, two hard), immediate feedback,
   explanations and a source page for each answer.
4. **Assistant** — a chat grounded in the reviewed knowledge base, with visible
   citations, source status and an explicit curated/AI mode label.
5. **Donate** — the two official routes (one-off/online donation vs PAP), a
   comparison, and direct links to the official SOS Tunisie pages.

Navigation is a floating, Instagram-inspired dock with hash routing, keyboard
arrows and horizontal swipe on touch devices. French is the default language;
Arabic switches the document to RTL.

## Non-negotiable rules

- French on first load. Arabic RTL, English LTR.
- Six colours only, depth through opacity:
  `#08A9E0`, `#1D3768`, `#E2556A`, `#EFFAFF`, `#CFEAF5`, `#FFFFFF`.
- No personal-data persistence, no database, no real payment. Only the language
  and the session onboarding flag persist.
- No invented facts. Every factual claim maps to a knowledge chunk with a guide
  page. The historical 10 DT minimum is historical, never mandatory.
- Never claim an integration works unless it was tested. Without
  `GROQ_API_KEY` the product is explicitly in curated mode.
- The assistant is grounded in `sos-tunisie-pap-reference.md`, an independent
  explanatory guide. The live SOS website and authorised staff override it.

## Verified facts used

- PAP = *Prélèvement Automatique Permanent*: voluntary recurring monthly
  contribution from a Tunisian current account.
- The donor chooses the amount and the first debit month; there is no confirmed
  current minimum. The 10 DT minimum dates from October 2024 and is historical.
- Debit on the 25th; a failed debit is retried on the 5th of the following
  month; failures are not cumulative.
- Cards are not used for PAP; a Tunisian current account is required.
- A donor cannot choose a specific child; contributions support SOS work.
- To change, pause or stop, the donor contacts SOS.
- Official links: `https://www.sosve.tn/fr/`,
  `https://www.sosve.tn/fr/parrainez-aujourdhui/`,
  `https://www.sosve.tn/fr/don-en-ligne/`,
  `https://inscription.sos-tunisie.org/`.

## Out of scope

- Real mandate creation, payment processing, card forms or bank integrations.
- Accounts, authentication, analytics on personal data, CRM or email capture.
- Choosing or displaying a specific child.
- A CMS. Content is typed in `src/lib/i18n` and `src/lib/pap/knowledge.ts`.

## Acceptance criteria

- All five tabs are functional, not placeholders, and work in FR/AR/EN.
- The scene visibly changes across the five stages and respects reduced motion.
- Navigation works by dock, keyboard and swipe; deep links via hash.
- The quiz scores answers, shows explanations and can restart.
- The assistant answers supported questions with citations and refuses
  unsupported ones; API failures fall back to curated content.
- `npm test`, `npm run lint` and `npm run build` pass.
- No colour outside the six, no personal-data persistence, no unverified claim.
