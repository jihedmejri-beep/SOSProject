# SOS PAP Revolution

Educational web experience for **SOS Villages d'Enfants Tunisie**, built for
Challenge 1 of the PAP Revolution. It explains the PAP (*Prélèvement Automatique
Permanent*) through a pixel-art village that grows with monthly contributions,
an interactive PAP journey, a quiz, a source-grounded assistant and the official
donation routes.

The interface starts in **French** and is available in **Arabic (RTL)** and
**English**. It is a simulation: it never collects a mandate, a card number or a
real donation, and it stores no personal data.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: add GROQ_API_KEY
npm run dev                  # http://localhost:3000
```

Without `GROQ_API_KEY`, the app runs fully in **curated mode**: the
assistant and the quiz use the reviewed local knowledge base. With a key, the
server may call Groq and validates every response before display; any
failure silently falls back to curated content.

The assistant is grounded in [`sos-tunisie-pap-reference.md`](sos-tunisie-pap-reference.md),
an independent explanatory reference. The live SOS website and authorised SOS
staff always override it.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | TypeScript check (`tsc --noEmit`) |
| `npm run typecheck` | TypeScript check |
| `npm test` | Vitest suite |
| `npm run test:watch` | Vitest watch mode |

## Architecture at a glance

```
src/app/            App Router: single page + /api/assistant + /api/quiz
src/components/     Shell, floating dock, welcome modal, tabs, pixel art
src/lib/pap/        Pure PAP domain: facts, validation, quiz, retrieval, answers
src/lib/i18n/       Typed FR/AR/EN dictionaries and localization helpers
src/lib/server/     Groq client, PAP reference loader, rate limiter, validation
tests/              Vitest: i18n, validation, domain, quiz, knowledge, sprites,
                    palette, reference, assistant validation, Groq, server
```

- **No database.** The profile, quiz state and chat live in memory; only the
  chosen language (`localStorage`) and the session dismissal of the onboarding
  are persisted.
- **Grounding first.** Every supported answer comes from `KNOWLEDGE` and carries
  a guide page citation with a status (`official`, `historical`, `educational`).
- **Six colours only:** `#08A9E0`, `#1D3768`, `#E2556A`, `#EFFAFF`, `#CFEAF5`,
  `#FFFFFF`. Depth uses opacity, never new colours.

See [docs/architecture/overview.md](docs/architecture/overview.md) for details.

## Testing and build

```bash
npm test          # 105 tests
npm run lint      # clean
npm run build     # production build
```

## Known limitations

- The official logo files and the brand font were not supplied in the
  repository. The header uses an original white pixel-silhouette mark on the
  cyan tile; drop the official assets in `public/` and swap `Brand` when
  available.
- The source PDF (`SOS_Tunisie_PAP_Detailed_Guide`) was not present. The
  knowledge base implements the verified facts listed in the specification and
  keeps page references; it must be reviewed against the final PDF before
  publication.
- The historical 10 DT minimum (October 2024) is treated as historical context,
  never as a confirmed current rule.
- Rate limiting is in-memory, per instance. A shared store is required for
  strict multi-instance limits.
- Groq integration is implemented and validated, but could not be exercised
  end-to-end without an API key in this environment.
- The PAP reference is an independent guide based on public SOS information, not
  an official SOS document. It must be reviewed against current SOS material.

## Documentation

- [Product specification](docs/specs/pap-revolution.md)
- [Architecture](docs/architecture/overview.md)
- [Implementation plan and status](docs/plans/implementation.md)
- [Glossary](GLOSSARY.md)
- [Agent conventions](AGENTS.md)
