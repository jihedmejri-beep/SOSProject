# Tab 1 ÔÇö Layout, storytelling and character redesign

## Intent

Tab 1 (`L'Impact d'un geste`) is the first thing a visitor sees, mostly on a phone. Today the
scene is short, the story is a flat one-line caption under the picture, the progression bar
sits above the controls, and the pixel cast reads as rounded blobs ÔÇö Basam even grows larger
than everyone else. This change makes the tab one continuous mobile experience, gives Basam's
journey an emotional voice in a reserved band of sky, and replaces the cast with human-looking,
distinct, expressive pixel art.

The existing simulator stays exactly as it is: seven stages, thresholds `0,2,4,6,8,10,12`,
cap 24, amounts, totals, reset, no persistence and no payment.

## Goals

- Mobile first: a taller simulation with clear floor space and a reserved sky band for narration.
- On mobile, scene and contribution controls live in one continuous section; the user never
  scrolls back and forth between the picture and the buttons.
- The progression bar moves out of the scene card into the side panel already beside the simulation.
- Desktop keeps the two-column grid without dead space.
- Each of the seven stages gets one short, emotional narration in French, Arabic and English:
  what changed for Basam, how his surroundings and relationships evolved, and how he feels.
- Every story sprite is redrawn with human proportions, silhouette, clothing, face and visible
  emotion. Cast members are easy to tell apart and have age-appropriate sizes: small children,
  bigger school-age children, and adults and high-school children as the biggest. Basam stays
  recognisable at all seven ages and is sized like the peers of his age at each stage, so he is
  never larger than the people around him.

## Non-goals

- No changes to other tabs, the separate 10-stage PAP journey, the dock or the welcome flow.
- No new asset pipeline, image files, test framework, linter or dependencies.
- No AI-generated narration, no personal-data storage, no payment flow.
- No change to stage ids, thresholds, amounts, reset behaviour or the illustrative-not-a-promise
  wording in the disclaimer.

## Constraints

- `AGENTS.md` is authoritative: six-colour palette only (`#08A9E0`, `#1D3768`, `#E2556A`,
  `#EFFAFF`, `#CFEAF5`, `#FFFFFF`), opacity for depth; `tests/palette.test.ts` enforces it.
- French is primary; Arabic RTL and English LTR ship together. `fr.ts`, `ar.ts` and `en.ts`
  must keep identical key structures and equal array lengths (`tests/i18n.test.ts`).
- `src/lib/pap/*` stays pure and framework-free. Client components keep `"use client"`.
- Design-system classes in `src/app/globals.css` are reused; Tailwind is only a reset utility.
- `PixelSprite` stays the renderer: run-length rows, `shapeRendering="crispEdges"`,
  `imageRendering: pixelated`, no new image format.

## Approaches

### Layout of the mobile section

1. **One continuous section (chosen).** `.sim-grid` stays the section. Ôëñ900px it stacks as
   today; Ôëñ640px the section itself gets the card surface while its two children become flush,
   forming one uninterrupted surface. The scene card holds the enlarged scene and its stage
   badge; the panel holds the progression bar, amount chips, buttons and stats. The first card
   above the controls at all widths. Desktop keeps two separate cards in the existing
   1.35fr / 1fr grid.
2. **Two cards, tighter gap and reordered content.** Less CSS, but the controls still read as a
   separate panel and the user still perceives a boundary ÔÇö it does not really deliver "same
   overall section". Rejected.
3. **Restructure the whole tab.** Rejected: out of scope and risks the other tabs.

### Narration content

Reuse the existing `impact.stageDescriptions` key, rewriting its seven entries as the emotional
narration. It already has seven entries in all three languages, so the i18n contract is
preserved and no new key is introduced. The flat caption below the scene is removed; the text
is rendered in the sky box instead. This is the builder's call from the conversation.

The scene root keeps `role="img"` with its existing `aria-label`; ARIA treats descendants of a
role="img" element as presentational, so the visual narration box alone is not announced. The
same narration text is therefore mirrored in a polite live region rendered alongside the scene
(or in `ImpactTab` next to the existing `sr-only` status element). It carries
`aria-live="polite"` and updates with the stage so assistive technology announces the new
narration on each change; the visual box itself stays inside `.scene` in the sky band.

### Sprite authoring

1. **Hand-authored run-length sprites (chosen).** Keep `storySprites.ts` and `PixelSprite`.
   Draw a shared human base (head, hair, shoulders, arms, torso, legs, feet), then vary face,
   posture, clothing and accessory per character and per Basam age. Reuse `withBlink` for eyes.
   A small test asserts human proportions and a shared 16px source grid; rendered size is set
   per age tier in the scene layers. No new dependency, palette test unchanged, crisp edges
   guaranteed.
2. **Generated raster images.** Would break the crisp pixel renderer, add an asset pipeline and
   put hex values outside the enforced palette. Rejected.

## The design

### Mobile shape

```text
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé Tab 1 ÔÇö L'impact d'un gesteÔöé
Ôöé ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ Ôöé
Ôöé Ôöé ├ëtape 3  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉÔöé Ôöé  sky: narration box
Ôöé Ôöé          Ôöé BasamÔÇª     ÔöéÔöé Ôöé  short, one or two lines
Ôöé Ôöé    Ôÿü     ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿÔöé Ôöé
Ôöé Ôöé  ­ƒÅá   ­ƒæ®  ­ƒºÆ  ­ƒÅ½       Ôöé Ôöé  taller floor
Ôöé ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ Ôöé
Ôöé ÔûôÔûôÔûôÔûôÔûôÔûôÔûæÔûæÔûæÔûæÔûæ  progression  Ôöé  in the panel
Ôöé ÔöÇÔöÇ amount chips ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ Ôöé
Ôöé [ Ajouter ] [ R├®initialiser]
Ôöé total   gestes   ├®tape / 7 Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

Desktop keeps the two columns: the enlarged scene on the left, the panel on the right. The
narration box stays inside the scene, top-centre or top-inline-end, clear of the stage badge.

### Files and responsibilities

- `src/components/tabs/ImpactTab.tsx` ÔÇö move the `.progress` element from the scene card into
  the control panel; remove the flat stage-description paragraph from the scene card; keep
  every state updater, amount, total, interaction, announcement, reset and `aria-*` attribute.
  The stage counter and "next stage" text stay where they are today.
- `src/app/globals.css` ÔÇö enlarge `.scene` (taller floor and sky), add `.scene-narration`,
  style the mobile merged surface (`.sim-grid` and flush children at Ôëñ640px), keep the existing
  `.scene--overcast`, badge, ground, animation and responsive rules working.
- `src/components/pixel/VillageScene.tsx` ÔÇö render `t.impact.stageDescriptions[stage - 1]` in
  the narration box inside `.scene`, keep the layer renderer, badge and ground, and add a
  visually-hidden polite live region with the same narration so it is announced on stage change.
- `src/components/pixel/storySprites.ts` ÔÇö replace the rounded hero and cast with redesigned
  human sprites; keep the exported names used by `sceneLayers.ts` and `HERO_EYES`/`HERO_BLINK`.
- `src/components/pixel/sceneLayers.ts` ÔÇö give characters three age-based width tiers (small
  child, bigger school-age child, adult/high-school age) so Basam matches his peers at each
  stage; keep ids, ordering, persistence and milestone timing unchanged.
- `src/lib/i18n/{fr,ar,en}.ts` ÔÇö rewrite the seven `stageDescriptions` as short emotional
  narration (what changed, surroundings/relationships, feeling) in each language. Keep the
  illustrative-not-a-promise note untouched.
- Tests ÔÇö extend `storySprites.test.ts` for human proportions and a shared 16px source grid,
  extend `i18n.test.ts` to assert seven non-empty narrations per language, add a scene-layer
  check that each character uses the correct age-tier width; keep `domain`/`impactStages`/
  `palette` tests green. Where practical, assert the narration live region is rendered with
  the current stage text.

### Sprite invariants

- Basam: the same hair shape, eye placement and face signature at all seven ages; expression
  and posture change with the stage (alone/withdrawn ÔåÆ cared-for ÔåÆ safe ÔåÆ curious ÔåÆ belonging
  ÔåÆ confident ÔåÆ hopeful/principal), clothes evolve with age.
- Cast: mother (warm, distinct hair and dress), two different younger siblings, school friend,
  director (distinct silhouette), staff/community members ÔÇö each with a recognisable outline,
  clothing and face.
- Every human sprite uses the same 16px source grid; rendered size comes from three age tiers:
  small children (young Basam, siblings, friend), bigger school-age children (Basam entering
  and growing through school), and the biggest tier for adults and high-school/young-adult
  Basam (mother, director, staff, Basam at stages 6ÔÇô7). Basam is never larger than peers of his
  age; his central position and the narration draw the eye.
- Every sprite remains rectangular, non-empty and painted only with the six approved colours
  through `PIXEL_PALETTE` letters.

## What is left to the builder

- Exact pixel rows, per-stage colour accents and final character widths.
- Exact narration wording, as long as each entry is short, emotional, covers the three points,
  and stays illustrative rather than a promise.
- Final breakpoints and min-heights, as long as mobile stays one continuous surface and the
  desktop grid stays two columns without dead space.
