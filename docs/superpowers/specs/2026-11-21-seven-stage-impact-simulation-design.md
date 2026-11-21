# Seven-Stage Impact Simulation — Design

## Intent

Replace the five-stage visual progression of Tab 1 ("L'impact d'un geste") with seven
linked stages that follow one child from difficult circumstances to a young adult in a
developed SOS Children's Village. The scene must read as one continuous story: the same
child, recognizable throughout, grows up while the same world gains care, a home, school,
family, a village, and finally a community. The simulator itself — fictional amounts,
totals, gesture counter, reset — keeps its current behavior.

The work prepares for a later prompt that will add narration boxes. It does not add
narration UI or restructure the tab layout.

## Goals

- Seven visually distinct, ordered stages with the exact milestones from the brief.
- One recognizable hero: same face/hair identity, age-appropriate size, clothing and
  expression at each stage; no rescaling of a single sprite.
- New supporting characters: mother figure, two distinct siblings, village director,
  community staff, and other children.
- Additive environment: elements introduced earlier persist and evolve in later stages.
- Stage data separated from rendering so narration text can attach to a stable id later.
- All art uses the six approved colours, genuine pixel rows, crisp edges, and the
  existing `PixelSprite` renderer.

## Non-goals

- Narration boxes, storytelling layout redesign, or new tabs.
- Changes to the 10-stage PAP "journey" feature or its generated SVG scenes.
- Changes to amounts, debit-day facts, payment behavior, data persistence, or AI flows.

## Constraints

- Palette: `#08A9E0`, `#1D3768`, `#E2556A`, `#EFFAFF`, `#CFEAF5`, `#FFFFFF` only;
  depth via opacity. Enforced by `tests/palette.test.ts`.
- French first; Arabic RTL and English LTR. Every i18n key added to all three dictionaries;
  array lengths must match (`tests/i18n.test.ts`).
- `src/lib/pap/*` stays pure and framework-free.
- No invented PAP facts, dates, amounts, guarantees or links.
- The journey is illustrative, not a promise that every child follows the same path.

## Approaches considered

1. **Code-authored run-length sprites (chosen).** Extend the existing `paint`/`PixelSprite`
   system with new sprite modules. Guarantees the six-colour palette, crisp nearest-neighbour
   edges, zero new runtime dependencies, and keeps palette/sprite tests meaningful.
2. **Generated raster image assets.** Rejected: cannot guarantee exact palette values or
   crisp pixel boundaries, introduces an asset pipeline, and breaks the current
   palette-invariant test coverage.
3. **CSS-drawn scenes.** Rejected: does not produce genuine pixel art or reusable sprites.

## Decisions

- `Stage` becomes `1 | ... | 7`. Thresholds: 0, 2, 4, 6, 8, 10, 12 gestures; the existing
  24-gesture cap stays, so cadence is unchanged (two gestures per stage).
- New pure-data `src/lib/pap/impactStages.ts` exposes `IMPACT_STAGES` with stable ids
  `alone`, `first-care`, `home`, `play-school`, `family`, `village`, `future`; `id` is the
  future narration hook.
- New `src/components/pixel/storySprites.ts` holds age-specific hero sprites and all new
  characters/props; the existing `sprites.ts` remains for the 10-stage journey.
- New `src/components/pixel/sceneLayers.ts` maps each stage id to an ordered list of
  positioned layers. `VillageScene.tsx` becomes a thin renderer of that config.
- Stage 1 has no house, garden, toy, sprout or companions. Stage 2 adds a small act of
  care (food). Stage 3 adds the modest home and mother. Stage 4 adds play/school.
  Stage 5 adds siblings. Stage 6 adds wider village, school and director. Stage 7 adds
  diploma, staff, more children and shared buildings.
- The existing `symbolNote` copy in fr/ar/en is extended to state the journey is
  illustrative and not a promise of any individual outcome.

## Left to the implementer

- Exact pixel rows, layer positions and CSS class assignments are implementation choices
  as long as the tests in the plan hold and the palette stays closed.
