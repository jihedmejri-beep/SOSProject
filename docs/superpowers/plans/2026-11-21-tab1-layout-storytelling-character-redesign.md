# Tab 1 Layout, Storytelling and Character Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Tab 1 one continuous mobile-first experience with a taller scene, an in-sky emotional narration for each of seven stages, and redesigned human-looking pixel characters, without touching the simulator logic or other tabs.

**Architecture:** Keep the seven-stage pure domain and the `PixelSprite` run-length renderer unchanged in behaviour. Rewrite copy in the existing `stageDescriptions` arrays, render that copy twice in `VillageScene` (visual sky box plus screen-reader live region), move the progression bar into the control panel, merge the two cards into one surface at Ôëñ640px, and redraw every human sprite on a common 16px-wide grid. Tests are pure-data plus source-shape assertions because this repo has no DOM test framework and must not gain one.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Vitest 3, Tailwind v4 reset only, `src/app/globals.css` design system, hand-authored run-length SVG sprites.

**Spec:** `docs/superpowers/specs/2026-11-21-tab1-layout-storytelling-character-redesign-design.md`

## Global Constraints

- Every factual line follows `AGENTS.md`: French first, Arabic RTL, English LTR; six colours only (`#08A9E0`, `#1D3768`, `#E2556A`, `#EFFAFF`, `#CFEAF5`, `#FFFFFF`), opacity for depth; no personal-data persistence; no payment; no invented PAP facts.
- `npm test`, `npm run lint` (`tsc --noEmit`) and `npm run build` must all pass. Run them **sequentially** ÔÇö running lint in parallel with `next build` produced a phantom missing-logo type error in an earlier session.
- Do not add a test framework, DOM-testing library, linter, image pipeline or dependency. Vitest and `tsc` are the only tools.
- `src/lib/pap/*` stays pure and framework-free; client components keep `"use client"`.
- `fr.ts`, `ar.ts` and `en.ts` must keep identical key structures and equal array lengths.
- The seven stage ids, thresholds `0,2,4,6,8,10,12`, cap 24, amounts, totals, reset and the illustrative-not-a-promise `symbolNote` are unchanged.
- The separate 10-stage PAP journey and every other tab are out of scope.
- Verification commands run one at a time; each task commits independently with RED observed before GREEN.

## Review Focus

- **Arabic RTL narration overflow** ÔÇö the sky box must centre and wrap in RTL, not hang off-screen: pinned by the `.scene-narration` logical-property assertions in Task 5, plus the Arabic narration length assertions in Task 1.
- **Very small phone (Ôëñ380px)** ÔÇö badge and narration must not collide: pinned by the Ôëñ380px `.scene-narration` rule asserted in Task 5.
- **Stage 7 held at the 24-interaction cap** ÔÇö narration must still resolve to entry 7, never `undefined`: pinned by the seven-entry length assertion in Task 1 and the existing domain stage-7 tests rerun in Task 6.
- **Reduced motion** ÔÇö the new narration box must not introduce an animation that ignores `prefers-reduced-motion`: pinned by the source assertion in Task 5 that `.scene-narration` declares no `animation` and the existing reduced-motion media block remains.
- **Invalid custom amount and reset after the layout move** ÔÇö moving the progress bar must not alter state flow: pinned by rerunning the existing `tests/validation.test.ts` and `tests/domain.test.ts` in Task 6.

## File Structure

- `src/lib/i18n/{fr,ar,en}.ts` ÔÇö seven rewritten `impact.stageDescriptions` entries only; no new keys.
- `src/components/pixel/storySprites.ts` ÔÇö redraw the seven heroes and six human supporting cast; leave prop/building sprites as-is.
- `src/components/pixel/sceneLayers.ts` ÔÇö three age-tier width constants applied to human layers; ids and ordering untouched.
- `src/components/pixel/VillageScene.tsx` ÔÇö add visual narration box and `sr-only` live region; keep the layer renderer.
- `src/components/tabs/ImpactTab.tsx` ÔÇö add `.scene-card` / `.sim-panel` classes, move progress into the panel, remove the flat description paragraph; no state changes.
- `src/app/globals.css` ÔÇö taller `.scene`, larger ground, `.scene-narration`, merged mobile `.sim-grid` surface; keep existing scene/animation rules.
- Tests: `tests/i18n.test.ts` (extend), `tests/storySprites.test.ts` (replace growth test), `tests/sceneLayers.test.ts` (extend), new `tests/sceneNarration.test.ts`, new `tests/impactLayout.test.ts`.

---

### Task 1: Rewrite stage descriptions as emotional narration

**Files:**
- Modify: `src/lib/i18n/fr.ts:95-103`, `src/lib/i18n/ar.ts:97-105`, `src/lib/i18n/en.ts:97-105`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `t.impact.stageDescriptions: string[]` with seven concise entries that each name Basam (French/English `Basam`, Arabic `Ï¿Ï│Ïº┘à`) and cover what changed, how surroundings/relationships evolved, and how he feels. `VillageScene` (Task 4) reads `stageDescriptions[stage - 1]`.

- [ ] **Step 1: Write the failing test** in `tests/i18n.test.ts` inside the `describe("i18n dictionaries")` block:

```ts
  it("names Basam in seven concise stage narrations", () => {
    const names = { fr: "Basam", ar: "Ï¿Ï│Ïº┘à", en: "Basam" } as const;
    const dictionaries = { fr, ar, en } as const;
    for (const lang of ["fr", "ar", "en"] as const) {
      const lines = dictionaries[lang].impact.stageDescriptions;
      expect(lines, lang).toHaveLength(7);
      for (const line of lines) {
        expect(line, `${lang}: ${line}`).toContain(names[lang]);
        expect(line.length, `${lang}: ${line}`).toBeLessThanOrEqual(200);
      }
    }
  });
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- tests/i18n.test.ts`
Expected: FAIL ÔÇö the current descriptions never name Basam.

- [ ] **Step 3: Rewrite the seven entries in all three dictionaries**

Replace only the `stageDescriptions` arrays. Each entry must: name the hero; be one or two short sentences (Ôëñ200 characters); state what changed for Basam, how his surroundings/relationships evolved, and how he feels; follow the existing stage order (alone ÔåÆ first care ÔåÆ home ÔåÆ play/school ÔåÆ siblings ÔåÆ developed village ÔåÆ diploma/future); stay illustrative rather than a promise; invent no dates, amounts, eligibility rules or guarantees. French is the reference copy; Arabic and English are its translations. Keep all surrounding keys and the `symbolNote` wording untouched.

- [ ] **Step 4: Run the test and confirm GREEN**

Run: `npm test -- tests/i18n.test.ts`
Expected: PASS (all i18n tests, including the new one).

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n/fr.ts src/lib/i18n/ar.ts src/lib/i18n/en.ts tests/i18n.test.ts
git commit -m "feat: write Basam's seven-stage narration"
```

---

### Task 2: Redraw Basam and the supporting cast as human pixel characters

**Files:**
- Modify: `src/components/pixel/storySprites.ts`
- Test: `tests/storySprites.test.ts`

**Interfaces:**
- Consumes: `withBlink` from `./sprites`, `PIXEL_PALETTE` letters `n w c l p r`, `Stage` type.
- Produces: the same exported names (`HERO_SPRITES`, `HERO_EYES`, `HERO_BLINK`, `MOTHER`, `SIBLING_A`, `SIBLING_B`, `DIRECTOR`, `STAFF`, `CHILD_FRIEND`) with every human sprite 16px wide and 18ÔÇô22 rows tall; `HERO_EYES` stays `[6,4]` and `[9,4]`; prop, building, cloud and sapling exports unchanged.

- [ ] **Step 1: Replace the outdated growth test** in `tests/storySprites.test.ts`

Remove the `it("keeps seven distinct hero sprites that grow without shrinking", ...)` block and add:

```ts
const HUMANS: Array<[string, string[]]> = [
  ...STAGES.map((stage) => [`hero ${stage}`, HERO_SPRITES[stage]] as [string, string[]]),
  ["MOTHER", MOTHER],
  ["SIBLING_A", SIBLING_A],
  ["SIBLING_B", SIBLING_B],
  ["DIRECTOR", DIRECTOR],
  ["STAFF", STAFF],
  ["CHILD_FRIEND", CHILD_FRIEND],
];

function paintedSpan(row: string): number {
  const first = row.search(/[^.]/);
  if (first === -1) return 0;
  let last = first;
  for (let x = first + 1; x < row.length; x += 1) {
    if (row[x] !== ".") last = x;
  }
  return last - first + 1;
}

it("draws every human on one 16px grid with a head, shoulders and two feet", () => {
  for (const [name, rows] of HUMANS) {
    expect(rows[0]?.length, `${name} width`).toBe(16);
    expect(rows.length, `${name} height`).toBeGreaterThanOrEqual(18);
    expect(rows.length, `${name} height`).toBeLessThanOrEqual(22);
    const feetRow = rows.reduce((best, row, y) => (/[^.]/.test(row) ? y : best), 0);
    expect((rows[feetRow] ?? "").match(/[^.]+/g)?.length, `${name} feet`).toBe(2);
    const widest = Math.max(...rows.map(paintedSpan));
    expect(widest, `${name} shoulders`).toBeGreaterThanOrEqual(10);
    expect(paintedSpan(rows[3] ?? ""), `${name} head narrower than shoulders`).toBeLessThan(widest);
  }
});

it("changes Basam's expression while keeping his face signature", () => {
  const faces = STAGES.map((stage) => (HERO_SPRITES[stage] ?? []).slice(2, 9).join("/"));
  expect(new Set(faces).size).toBeGreaterThanOrEqual(5);
  expect(new Set(STAGES.map((stage) => HERO_SPRITES[stage]?.join("/"))).size).toBe(7);
});
```

- [ ] **Step 2: Run the sprite tests and confirm RED**

Run: `npm test -- tests/storySprites.test.ts`
Expected: FAIL on width/height/feet/head invariants for the current rounded 12px and 16px sprites.

- [ ] **Step 3: Redraw the human sprites**

In `storySprites.ts`, keep `paint`, `sprite`, `HERO_WIDTH = 16`, `HERO_SPRITES`, `HERO_EYES`, `HERO_BLINK` and the supporting exports. Redraw all seven hero row arrays and the mother, both siblings, director, staff and friend row arrays on this shared geometry:

- 16 columns; row 0 fully transparent; rows 1ÔÇô2 hair/head top; rows 3ÔÇô8 face with skin `w`, navy `n` eyes at `(6,4)` and `(9,4)`, and a mouth on row 7; row 9 neck/shoulders; rows 10ÔÇô15 torso with arms reaching at least x=2 and x=13 on some row; rows 16ÔÇô19 two separate legs; final painted row two separate feet with a transparent gap between them.
- Keep every hero 18ÔÇô22 rows; peers in the same age tier then render at the same height once Task 3 assigns their width.
- Vary hair shape and colour, clothing colour (`c`, `l`, `r`, `w`) and face/mouth per character so mother, siblings, director, staff and friend are immediately distinguishable; the director gets a distinct silhouette, the siblings and friend smaller-looking hairstyles but the same 16px grid.
- Make Basam's expression and posture progress from withdrawn (stage 1) through cared-for, safe, curious, belonging, confident to hopeful (stage 7), while hair, eye placement and face signature stay identical at every age.
- Derive `HERO_BLINK` from the new rows with the existing `withBlink(rows, HERO_EYES[stage])`; do not hand-edit blink frames.
- Leave `BOWL`, ball, book, diploma, houses, school, hall, cloud and sapling row arrays untouched.

- [ ] **Step 4: Run the sprite and palette tests and confirm GREEN**

Run: `npm test -- tests/storySprites.test.ts tests/palette.test.ts`
Expected: PASS ÔÇö all human invariants hold and no colour outside the approved palette appears.

- [ ] **Step 5: Commit**

```bash
git add src/components/pixel/storySprites.ts tests/storySprites.test.ts
git commit -m "feat: redraw Basam and the village cast as human sprites"
```

---

### Task 3: Normalise character sizes in the scene layers

**Files:**
- Modify: `src/components/pixel/sceneLayers.ts`
- Test: `tests/sceneLayers.test.ts`

**Interfaces:**
- Consumes: the redrawn sprites from Task 2.
- Produces: `export const CHARACTER_WIDTH_CHILD`, `CHARACTER_WIDTH_SCHOOL`, `CHARACTER_WIDTH_ADULT` (all `string`), plus `layersForStage`, `SCENE_LAYERS`, `blinkRows` unchanged. Each human layer uses the width for its age tier; Basam's tier depends on the stage so he always matches his peers.

- [ ] **Step 1: Write the failing test** in `tests/sceneLayers.test.ts`

Extend the `sceneLayers` import with `CHARACTER_WIDTH_ADULT`, `CHARACTER_WIDTH_CHILD`, `CHARACTER_WIDTH_SCHOOL`, then append:

```ts
type Tier = "child" | "school" | "adult";

const HERO_TIER: Record<(typeof STAGES)[number], Tier> = {
  1: "child", 2: "child", 3: "child", 4: "school", 5: "school", 6: "adult", 7: "adult",
};

const CAST_TIER: Record<string, Tier> = {
  "sibling-a": "child", "sibling-b": "child", "child-friend": "child",
  mother: "adult", director: "adult", staff: "adult", "staff-far": "adult",
};

it("sizes children small, school-age children bigger, and adults and high-schoolers biggest", () => {
  const widths = [CHARACTER_WIDTH_CHILD, CHARACTER_WIDTH_SCHOOL, CHARACTER_WIDTH_ADULT];
  for (const width of widths) expect(width).toMatch(/^clamp\(/);
  const minimums = widths.map((width) => Number(width.match(/clamp\((\d+)px/)?.[1]));
  expect(minimums[0]!).toBeLessThan(minimums[1]!);
  expect(minimums[1]!).toBeLessThan(minimums[2]!);
  const byTier: Record<Tier, string> = {
    child: CHARACTER_WIDTH_CHILD,
    school: CHARACTER_WIDTH_SCHOOL,
    adult: CHARACTER_WIDTH_ADULT,
  };
  for (const stage of STAGES) {
    for (const layer of SCENE_LAYERS[stage]) {
      const tier = layer.id === "hero" ? HERO_TIER[stage] : CAST_TIER[layer.id];
      if (tier === undefined) continue;
      expect(layer.width, `${layer.id} at stage ${stage}`).toBe(byTier[tier]);
    }
  }
});
```

- [ ] **Step 2: Run the layer tests and confirm RED**

Run: `npm test -- tests/sceneLayers.test.ts`
Expected: FAIL ÔÇö the three width constants are not exported and current widths do not follow age tiers.

- [ ] **Step 3: Introduce and apply the three age-tier widths**

Add near the `SceneLayer` type:

```ts
export const CHARACTER_WIDTH_CHILD = "clamp(34px, 5.4vw, 56px)";
export const CHARACTER_WIDTH_SCHOOL = "clamp(44px, 7vw, 72px)";
export const CHARACTER_WIDTH_ADULT = "clamp(52px, 8.4vw, 86px)";
```

Apply them as follows:
- `hero()`: `CHARACTER_WIDTH_CHILD` for stages 1ÔÇô3, `CHARACTER_WIDTH_SCHOOL` for stages 4ÔÇô5, `CHARACTER_WIDTH_ADULT` for stages 6ÔÇô7.
- `sibling-a`, `sibling-b`, `child-friend`: `CHARACTER_WIDTH_CHILD`.
- `mother`, `director`, `staff`, `staff-far`: `CHARACTER_WIDTH_ADULT`.

Leave cloud, house, school, hall, tree, sapling, bowl, toy, book and diploma widths, all `id`s, `left`/`bottom`/`zIndex`, class names, ordering and the `byId`/`SCENE_LAYERS`/`layersForStage`/`blinkRows` exports untouched.

- [ ] **Step 4: Run the layer tests and confirm GREEN**

Run: `npm test -- tests/sceneLayers.test.ts`
Expected: PASS, including the existing milestone-order and persistence tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/pixel/sceneLayers.ts tests/sceneLayers.test.ts
git commit -m "feat: size the village cast by age"
```

---

### Task 4: Show narration in the sky and announce it to screen readers

**Files:**
- Modify: `src/components/pixel/VillageScene.tsx`
- Test: `tests/sceneNarration.test.ts` (create)

**Interfaces:**
- Consumes: `t.impact.stageDescriptions` from Task 1, `layersForStage`/`blinkRows` from Task 3.
- Produces: `.scene-narration` visual box inside `.scene`, and a visually hidden `aria-live="polite"` element carrying the identical text; the existing `role="img"` scene root stays.

- [ ] **Step 1: Write the failing source-shape test**

Create `tests/sceneNarration.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/components/pixel/VillageScene.tsx"),
  "utf8",
);

describe("stage narration in the scene", () => {
  it("renders the current narration visually and as a polite live region", () => {
    expect(source).toContain('className="scene-narration"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("stageDescriptions[stage - 1]");
    expect(source).toContain('role="img"');
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- tests/sceneNarration.test.ts`
Expected: FAIL ÔÇö none of the narration markup exists yet.

- [ ] **Step 3: Render the narration twice**

In `VillageScene`: compute `const narration = t.impact.stageDescriptions[stage - 1] ?? "";` next to `stageName`. Wrap the existing scene `<div>` and one new `<p>` in a fragment. Keep the scene root's `className`, `role="img"`, `aria-label`, ground, badge and layer map exactly as they are. Add `<div className="scene-narration">{narration}</div>` inside `.scene` before the layer list (the CSS in Task 5 places it in the sky band). Add `<p className="sr-only" aria-live="polite">{narration}</p>` immediately after the scene root, using the existing `.sr-only` utility so it is announced but not visible.

- [ ] **Step 4: Run the test and confirm GREEN**

Run: `npm test -- tests/sceneNarration.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/pixel/VillageScene.tsx tests/sceneNarration.test.ts
git commit -m "feat: narrate Basam's journey in the scene sky"
```

---

### Task 5: Restructure Tab 1 into one mobile surface with the bar in the panel

**Files:**
- Modify: `src/components/tabs/ImpactTab.tsx`, `src/app/globals.css`
- Test: `tests/impactLayout.test.ts` (create)

**Interfaces:**
- Consumes: `.scene-narration` from Task 4.
- Produces: class names `.scene-card` and `.sim-panel` on the two children of `.sim-grid`; a single `.progress` element inside `.sim-panel`; CSS for the taller scene, the sky narration box and the Ôëñ640px merged surface.

- [ ] **Step 1: Write the failing source-shape test**

Create `tests/impactLayout.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const tab = readFileSync(join(process.cwd(), "src/components/tabs/ImpactTab.tsx"), "utf8");
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("Tab 1 mobile layout", () => {
  it("keeps one progress bar in the control panel and narration in the scene", () => {
    expect(tab.match(/className="progress"/g)).toHaveLength(1);
    expect(tab.indexOf('className="progress"')).toBeGreaterThan(tab.indexOf("t.impact.amountLabel"));
    expect(tab).not.toContain("stageDescriptions");
    expect(tab).toContain('className="card scene-card stack"');
    expect(tab).toContain('className="card sim-panel stack"');
  });

  it("reserves sky space and merges the two cards on narrow screens", () => {
    expect(css).toContain(".scene-narration {");
    expect(css).toContain(".sim-grid > .card");
    expect(css).toContain("inset-inline: 0");
    expect(css).toContain("margin-inline: auto");
    expect(css).toContain(".scene--overcast");
    expect(css).toContain(".scene-narration { font-size: 0.7rem; padding: 6px 10px; }");
    const narrationRule = css.match(/\.scene-narration \{[^}]*\}/)?.[0] ?? "";
    expect(narrationRule).not.toContain("animation");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- tests/impactLayout.test.ts`
Expected: FAIL ÔÇö classes and CSS rules do not exist and the progress bar is in the scene card.

- [ ] **Step 3: Restructure `ImpactTab.tsx` without changing state logic**

- Change the first card's class to `card scene-card stack` and the second to `card sim-panel stack`.
- Remove the `.progress` `<div>` and the `<p className="small muted">{t.impact.stageDescriptions[stage - 1]}</p>` from the scene card. Leave `VillageScene` and the `.spread` badge/next-stage text there.
- Insert the same `.progress` element as the first child of `.sim-panel`, before the amount title, preserving every `role`, `aria-*` attribute, `aria-valuenow` expression and inline `width` style verbatim.
- Do not touch `useState`, `addContribution`, `reset`, `activeAmount`, `remaining`, `annual`, `atMax`, chips, field, buttons, stats, status element, or anything below `.sim-grid`.

- [ ] **Step 4: Add the CSS**

In `src/app/globals.css`, keep the existing scene variables and all animation rules, and:

- Change `.scene` to `min-height: 380px; aspect-ratio: 16 / 10;` and `.scene-ground` height to `26%` so the floor is taller.
- Add `.scene-narration` after `.scene-badge`: `position: absolute; z-index: 7; inset-block-start: 54px; inset-inline: 0; margin-inline: auto; max-width: min(88%, 340px); background: rgba(255,255,255,0.94); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 8px 12px; color: var(--ink-soft); font-size: 0.78rem; line-height: 1.35; text-align: start; box-shadow: 0 8px 20px -16px rgba(29,55,104,0.6);`. Declare no `animation`. Use only the approved palette colours and opacity.
- In `@media (max-width: 640px)`: set `.scene { aspect-ratio: auto; min-height: 440px; }` (replacing the existing `4 / 3` / `300px` pair); add `.scene-narration { inset-block-start: 52px; max-width: calc(100% - 24px); font-size: 0.74rem; }`; and merge the cards with `.sim-grid { gap: 0; background: var(--white); border: 1px solid var(--line); border-radius: var(--radius-xl); box-shadow: var(--shadow-card); overflow: hidden; }`, `.sim-grid > .card { border: 0; border-radius: 0; box-shadow: none; background: transparent; padding: 0; }`, `.sim-grid > .scene-card { padding: 12px 12px 0; }`, `.sim-grid > .sim-panel { padding: 16px; gap: 14px; }`.
- In `@media (max-width: 380px)`, add `.scene-narration { font-size: 0.7rem; padding: 6px 10px; }` so it clears the badge.
- Leave `.scene--overcast`, `.scene-item`, `.scene-pop`, `.bob`, `.sway`, `.drift`, `.hide-sm` and the reduced-motion block intact.

- [ ] **Step 5: Run the full checks sequentially and confirm GREEN**

Run, one at a time:
- `npm test`
- `npm run lint`
- `npm run build`

Expected: all pass (all eleven existing test files plus the two new narration/layout files, clean type check, successful production build).

- [ ] **Step 6: Commit**

```bash
git add src/components/tabs/ImpactTab.tsx src/app/globals.css tests/impactLayout.test.ts
git commit -m "feat: merge Tab 1 scene and controls on mobile"
```

---

### Task 6: Final verification and app smoke check

**Files:** none expected; commit only if verification forces a fix.

**Interfaces:**
- Consumes: all tasks above.

- [ ] **Step 1: Run the full suite sequentially**

Run: `npm test`, then `npm run lint`, then `npm run build` as three separate commands.
Expected: green test suite, clean `tsc --noEmit`, successful build. No phantom logo error (see Global Constraints).

- [ ] **Step 2: Run the targeted regression suites**

Run: `npm test -- tests/domain.test.ts tests/impactStages.test.ts tests/validation.test.ts tests/sceneLayers.test.ts`
Expected: PASS ÔÇö seven-stage order, cap, amounts and reset logic are unchanged.

Run: `npm test -- tests/palette.test.ts tests/sprites.test.ts tests/storySprites.test.ts tests/i18n.test.ts`
Expected: PASS ÔÇö six-colour palette intact, sprites valid, all three dictionaries aligned.

- [ ] **Step 3: Smoke-check the running app**

Start `npm run dev` in the background with a generous timeout, then fetch `http://localhost:3000` until HTTP 200. Confirm the HTML contains `scene-narration`, `aria-live="polite"`, the stage-1 narration text, `├ëtape 1 / 7` and `Encore 2 geste(s)`, and contains no `Application error` / `Internal Server Error` markers. Stop the dev server and confirm the port is closed.

- [ ] **Step 4: Record the outcome and, if any fix was needed, commit it**

No commit is required when no code changed. If a fix was needed, commit only the corrected files with a focused `fix:` message.
