# Seven-Stage Impact Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five-stage pixel-art progression of Tab 1 with seven ordered, data-driven stages of one child's life while preserving the contribution simulator.

**Architecture:** Pure stage data in `src/lib/pap`, new sprites in `src/components/pixel/storySprites.ts`, an ordered layer map in `sceneLayers.ts`, and `VillageScene.tsx` reduced to a renderer. The existing `PixelSprite` engine and CSS design system stay untouched apart from one overcast scene variant.

**Tech Stack:** Next.js, TypeScript strict, React, Vitest, Tailwind v4 reset, hand-authored run-length SVG pixel art.

**Spec:** `docs/superpowers/specs/2026-11-21-seven-stage-impact-simulation-design.md`

## Global Constraints

- Six colours only: `#08A9E0`, `#1D3768`, `#E2556A`, `#EFFAFF`, `#CFEAF5`, `#FFFFFF`; opacity for depth.
- `npm test`, `npm run lint`, `npm run build` must all pass at the end.
- French first; fr/ar/en dictionaries keep identical key structures and equal array lengths.
- `src/lib/pap/*` stays pure and framework-free; add no test framework or linter.
- No invented PAP facts, no persistence of personal data, no real payment flow.
- The 10-stage PAP journey (`src/lib/journey/*`, `src/components/journey/*`, `JOURNEY_SCENES`) is out of scope.
- No narration boxes or layout redesign in this plan; only stable stage ids that can carry narration later.

## Review Focus

- Stage 1 must show no house, garden, toy, sprout or companion — test in Task 3 pins the allowed layer ids.
- The hero must remain recognizable and must not be a resized copy — Task 2 tests fixed eye positions, shared face signature and seven distinct sprite arrays with non-decreasing heights.
- Elements introduced early should remain logically connected later — Task 3 tests the persistent-id set across stages.
- Every stage must look different — Task 3 tests that no two stages share the same layer-id set.
- Simulator behavior and reset must survive the refactor — Task 1 tests stage 0/12/24 mapping; Task 4 tests i18n array length and the `/ 7` label.

---

### Task 1: Seven-stage progression data

**Files:**
- Modify: `src/lib/pap/domain.ts`
- Modify: `tests/domain.test.ts`
- Create: `src/lib/pap/impactStages.ts`
- Create: `tests/impactStages.test.ts`

**Interfaces:**
- Consumes: current `Stage`, `STAGE_THRESHOLDS`, `computeStage`, `nextStageAt`, `gesturesToNextStage`, `experienceProgress`.
- Produces: `Stage = 1|2|3|4|5|6|7`; `STAGE_THRESHOLDS` with 7 entries; `STAGES` with 7 entries; `ImpactStageId`; `ImpactStage`; `IMPACT_STAGES: readonly ImpactStage[]`; `IMPACT_STAGE_COUNT`.

- [ ] **Step 1: Rewrite the progression assertions in `tests/domain.test.ts` for seven stages**

Replace the existing `village stage progression` describe block with assertions:
`STAGE_THRESHOLDS[7] === 12`; `computeStage` maps 0→1, 1→1, 2→2, 3→2, 4→3, 5→3, 6→4, 7→4, 8→5, 9→5, 10→6, 11→6, 12→7, 13→7, 100→7, -4→1; `gesturesToNextStage(0) === 2`, `(10) === 2`, `(12) === null`; `experienceProgress(0) === 0`, `(6) === 0.5`, `(12) === 1`, `(40) === 1`. Leave the other describe blocks unchanged.

- [ ] **Step 2: Run the domain test and watch it fail**

Run: `npm test -- tests/domain.test.ts`
Expected: FAIL on the new seven-stage assertions (missing threshold/stage), not on syntax.

- [ ] **Step 3: Extend `src/lib/pap/domain.ts`**

Change `Stage` to `1|2|3|4|5|6|7`, `STAGE_THRESHOLDS` to `{1:0,2:2,3:4,4:6,5:8,6:10,7:12}`, `STAGES` to `[1,2,3,4,5,6,7]`. Make `computeStage` walk `STAGES` backwards and return the first stage whose threshold is met; make `nextStageAt` return `null` at stage 7; base `experienceProgress` on `STAGE_THRESHOLDS[7]`.

- [ ] **Step 4: Run the domain test and the full suite**

Run: `npm test -- tests/domain.test.ts` → PASS.
Run: `npm test` → PASS.

- [ ] **Step 5: Write `tests/impactStages.test.ts`**

Assert: `IMPACT_STAGES` has length 7; ids equal `["alone","first-care","home","play-school","family","village","future"]`; numbers are 1..7 in order; each `threshold` equals `STAGE_THRESHOLDS[number]`; `computeStage(threshold)` yields the entry with that id for every entry; ids are unique; `IMPACT_STAGE_COUNT === 7`.

- [ ] **Step 6: Run the new test and watch it fail**

Run: `npm test -- tests/impactStages.test.ts`
Expected: FAIL because the module cannot be resolved.

- [ ] **Step 7: Create `src/lib/pap/impactStages.ts`**

Export the exact types and constants from the Interfaces block. Use `STAGE_THRESHOLDS` and `Stage` from `./domain`; no React imports.

- [ ] **Step 8: Run tests, then commit**

Run: `npm test` → PASS.
Commit: `git add src/lib/pap/domain.ts src/lib/pap/impactStages.ts tests/domain.test.ts tests/impactStages.test.ts && git commit -m "feat: extend impact simulation to seven stages"`

---

### Task 2: Age-evolving hero and story sprite library

**Files:**
- Create: `src/components/pixel/storySprites.ts`
- Create: `tests/storySprites.test.ts`

**Interfaces:**
- Consumes: `paint` pattern and `withBlink` from `src/components/pixel/sprites.ts`, `PIXEL_PALETTE` letters, `Stage` from `@/lib/pap/domain`.
- Produces: `HERO_SPRITES: Record<Stage, string[]>`, `HERO_EYES: Record<Stage, Array<[number, number]>>`, `HERO_BLINK: Record<Stage, string[]>`, and single sprites `MOTHER`, `SIBLING_A`, `SIBLING_B`, `DIRECTOR`, `STAFF`, `CHILD_FRIEND`, `BOWL`, `TOY_BALL`, `BOOK`, `DIPLOMA`, `HOUSE_MODEST`, `HOUSE_SIDE`, `SCHOOL_BUILDING`, `COMMUNITY_HALL`, `CLOUD_OVERCAST`, `SAPLING`.

- [ ] **Step 1: Write `tests/storySprites.test.ts`**

Cover: every exported sprite (including all seven `HERO_SPRITES` values and blink frames) is non-empty, rectangular, and uses only `.` plus keys of `PIXEL_PALETTE`; `HERO_SPRITES[1..7]` are pairwise distinct; hero row counts are non-decreasing with stage and `HERO_SPRITES[7].length > HERO_SPRITES[1].length`; for every stage, each coordinate in `HERO_EYES[stage]` points to the `n` eye pixel in `HERO_SPRITES[stage]` and to `w` in `HERO_BLINK[stage]`; each supporting sprite has at least one non-transparent pixel; `HERO_BLINK` frame dimensions match the base sprite.

- [ ] **Step 2: Run the sprite test and watch it fail**

Run: `npm test -- tests/storySprites.test.ts`
Expected: FAIL because the module cannot be resolved.

- [ ] **Step 3: Author `src/components/pixel/storySprites.ts`**

Use the existing run-length `paint` helper pattern. Hero sprites must share a fixed face signature (navy eyes at the declared coordinates, navy hair, white face) while changing head proportion, height, hair shape, clothing and mouth expression per stage: sad young child, cared-for child, neutral child, curious child, happy pre-teen, confident teenager, adult with graduation attire. Supporting sprites must be original and match the same outline/proportion style. Keep every row exactly `width` characters; only palette letters `n`, `w`, `c`, `l`, `p`, `r` and `.`.

- [ ] **Step 4: Run the sprite test and the full suite**

Run: `npm test -- tests/storySprites.test.ts` → PASS.
Run: `npm test` → PASS (includes `tests/sprites.test.ts` and `tests/palette.test.ts`).

- [ ] **Step 5: Commit**

Commit: `git add src/components/pixel/storySprites.ts tests/storySprites.test.ts && git commit -m "feat: add seven-age hero and village story sprites"`

---

### Task 3: Ordered per-stage scene layers

**Files:**
- Create: `src/components/pixel/sceneLayers.ts`
- Create: `tests/sceneLayers.test.ts`

**Interfaces:**
- Consumes: all exports from Task 2, `Stage` and `IMPACT_STAGES` from Task 1.
- Produces: `SceneLayer` (`id`, `sprite: readonly string[]`, `left`, `bottom`, `width`, `zIndex`, optional `className`, `blink`), `SCENE_LAYERS: Record<Stage, readonly SceneLayer[]>`, `layersForStage(stage: Stage): readonly SceneLayer[]`.

- [ ] **Step 1: Write `tests/sceneLayers.test.ts`**

Assert: every stage has exactly one layer with `id === "hero"` whose `sprite` equals `HERO_SPRITES[stage]`; stage 1 ids contain none of `house-modest`, `house-side`, `school`, `community-hall`, `sapling`, `toy`, `book`, `mother`, `sibling-a`, `sibling-b`, `director`, `staff`, `child-friend`, `diploma`, `bowl`; stage 2 contains `bowl` but no home/school; stage 3 contains `house-modest` and `mother`; stage 4 contains `school`, `book`, `toy`; stage 5 contains `sibling-a` and `sibling-b`; stage 6 contains `director`, `school`, `house-side`; stage 7 contains `diploma`, `staff`, `community-hall`, `child-friend`. Also assert: no two stages have identical id sets; for ids `hero`, `house-modest`, `mother`, `school`, `sibling-a`, `director`, `diploma`, if the id appears at stage N it appears at every stage > N; `layersForStage(3) === SCENE_LAYERS[3]`.

- [ ] **Step 2: Run the scene-layer test and watch it fail**

Run: `npm test -- tests/sceneLayers.test.ts`
Expected: FAIL because the module cannot be resolved.

- [ ] **Step 3: Author `src/components/pixel/sceneLayers.ts`**

Define one ordered layer list per stage using the sprites from Task 2. Keep the hero at the same horizontal anchor in every stage; keep the modest house, mother, school, siblings and director at fixed positions when they persist. Use existing CSS classes (`scene-pop`, `bob`, `sway`, `drift`, `hide-sm`) via `className`. Use percentage strings for `left`, `bottom` and `clamp()` strings for `width`; all positions must stay inside the 16:9 scene and remain legible when `hide-sm` items are dropped on mobile.

- [ ] **Step 4: Run the layer test, full suite and typecheck**

Run: `npm test -- tests/sceneLayers.test.ts` → PASS.
Run: `npm test` → PASS.
Run: `npm run lint` → PASS.

- [ ] **Step 5: Commit**

Commit: `git add src/components/pixel/sceneLayers.ts tests/sceneLayers.test.ts && git commit -m "feat: map seven stages to persistent scene layers"`

---

### Task 4: Renderer, copy and simulator wiring

**Files:**
- Modify: `src/components/pixel/VillageScene.tsx`
- Modify: `src/components/tabs/ImpactTab.tsx`
- Modify: `src/lib/i18n/fr.ts`
- Modify: `src/lib/i18n/ar.ts`
- Modify: `src/lib/i18n/en.ts`
- Modify: `tests/i18n.test.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `layersForStage`, `SCENE_LAYERS`, `Stage`, `STAGES`, `IMPACT_STAGES`.
- Produces: `VillageScene({ stage }: { stage: Stage })` rendering the layer list of that stage; stage label/description arrays of length 7 in all dictionaries.

- [ ] **Step 1: Extend `tests/i18n.test.ts` and watch it fail**

Add assertions that `fr.impact.stageNames`, `ar.impact.stageNames`, `en.impact.stageNames`, and the same three `stageDescriptions` arrays all have length 7 (replace the existing implicit coverage). Run `npm test -- tests/i18n.test.ts` → FAIL.

- [ ] **Step 2: Update the three dictionaries**

Replace the five stage names and descriptions with seven French, Arabic and English entries matching the brief's milestones (alone; first care; home and mother; play and school; siblings; high school and village; diploma and future). Extend each `impact.symbolNote` to say the journey is illustrative and not a promise of a particular path or outcome. Keep all keys identical across languages. Run `npm test -- tests/i18n.test.ts` → PASS.

- [ ] **Step 3: Rewrite `VillageScene.tsx` as a layer renderer**

Map `layersForStage(stage)` to `PixelSprite` instances inside `.scene` with `.scene-item`, applying each layer's `left`/`bottom`/`width`/`zIndex`/`className` and `blinkRows` where `blink` is true. Keep the `role="img"` container, the stage badge (`t.impact.stage` + stage name) and the ground element. Add class `scene--overcast` for stage 1 only. No stage number comparisons beyond passing `stage` to `layersForStage`.

- [ ] **Step 4: Add the overcast variant in `src/app/globals.css`**

Define `.scene--overcast` using only approved colour variables/opacity (subdued sky, no gradient wash beyond the existing one). Keep `.scene`, `.scene-item`, animation classes and responsive rules unchanged.

- [ ] **Step 5: Wire the tab's stage labels**

In `ImpactTab.tsx`, replace both hardcoded `/ 5` with `/ {IMPACT_STAGES.length}` (import from `@/lib/pap/impactStages`) and keep `stageDescriptions[stage - 1]` and the existing amount/reset logic untouched.

- [ ] **Step 6: Run all verification commands**

Run: `npm test` → PASS; `npm run lint` → PASS; `npm run build` → PASS. Confirm no console warnings from the build output.

- [ ] **Step 7: Commit**

Commit: `git add src/components/pixel/VillageScene.tsx src/components/tabs/ImpactTab.tsx src/lib/i18n/fr.ts src/lib/i18n/ar.ts src/lib/i18n/en.ts src/app/globals.css tests/i18n.test.ts && git commit -m "feat: render seven-stage story in impact tab"`

---

### Task 5: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Run the required commands from the repo's agent conventions**

Run: `npm test`, `npm run lint`, `npm run build`. All three must pass; report any failure by name.

- [ ] **Step 2: Confirm ordering and reset behavior from the pure layer**

Run: `npm test -- tests/domain.test.ts tests/impactStages.test.ts tests/sceneLayers.test.ts`. Confirm stage 1 at 0 gestures, stage 7 at 12 gestures, no regression past 24, and identical layer ids after a reset to 0.

- [ ] **Step 3: Check palette and asset integrity**

Run: `npm test -- tests/palette.test.ts tests/sprites.test.ts tests/storySprites.test.ts`. Confirm all sprite rows are rectangular, use only approved palette letters, and no new hex value appears in `src/`.

- [ ] **Step 4: Smoke-check the running app**

Start the dev server, open the impact tab, add gestures until stage 7, and reset back to stage 1. Confirm the seven stage names render, no broken sprite SVG appears, and the layout holds at mobile, tablet and desktop widths. Stop the server.
