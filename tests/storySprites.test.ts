import { describe, expect, it } from "vitest";
import { PIXEL_PALETTE } from "@/lib/theme";
import { STAGES } from "@/lib/pap/domain";
import {
  BOWL,
  BOOK,
  CHILD_FRIEND,
  CLOUD_OVERCAST,
  DIPLOMA,
  DIRECTOR,
  HERO_BLINK,
  HERO_EYES,
  HERO_SPRITES,
  HOUSE_MODEST,
  HOUSE_SIDE,
  MOTHER,
  SAPLING,
  SIBLING_A,
  SIBLING_B,
  SCHOOL_BUILDING,
  STAFF,
  TOY_BALL,
  COMMUNITY_HALL,
} from "@/components/pixel/storySprites";

const SUPPORTING: Array<[string, string[]]> = [
  ["MOTHER", MOTHER],
  ["SIBLING_A", SIBLING_A],
  ["SIBLING_B", SIBLING_B],
  ["DIRECTOR", DIRECTOR],
  ["STAFF", STAFF],
  ["CHILD_FRIEND", CHILD_FRIEND],
  ["BOWL", BOWL],
  ["TOY_BALL", TOY_BALL],
  ["BOOK", BOOK],
  ["DIPLOMA", DIPLOMA],
  ["HOUSE_MODEST", HOUSE_MODEST],
  ["HOUSE_SIDE", HOUSE_SIDE],
  ["SCHOOL_BUILDING", SCHOOL_BUILDING],
  ["COMMUNITY_HALL", COMMUNITY_HALL],
  ["CLOUD_OVERCAST", CLOUD_OVERCAST],
  ["SAPLING", SAPLING],
];

const ALLOWED = new Set([".", ...Object.keys(PIXEL_PALETTE)]);

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

function checkSprite(name: string, rows: string[]): void {
  expect(rows.length, name).toBeGreaterThan(0);
  const width = rows[0]?.length ?? 0;
  expect(width, `${name} width`).toBeGreaterThan(0);
  for (const row of rows) {
    expect(row.length, `${name} row width`).toBe(width);
    for (const char of row) {
      expect(ALLOWED.has(char), `${name} uses ${char}`).toBe(true);
    }
  }
}

describe("story sprites", () => {
  it("are rectangular and use only approved palette letters", () => {
    for (const stage of STAGES) {
      checkSprite(`hero ${stage}`, HERO_SPRITES[stage]);
      checkSprite(`hero blink ${stage}`, HERO_BLINK[stage]);
    }
    for (const [name, rows] of SUPPORTING) checkSprite(name, rows);
  });

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

  it("keeps the same eye signature and blink frame for every age", () => {
    for (const stage of STAGES) {
      const eyes = HERO_EYES[stage];
      expect(eyes.length).toBe(2);
      expect(HERO_BLINK[stage]).toHaveLength(HERO_SPRITES[stage].length);
      for (const [x, y] of eyes) {
        expect(HERO_SPRITES[stage][y]?.[x]).toBe("n");
        expect(HERO_BLINK[stage][y]?.[x]).toBe("w");
      }
    }
  });

  it("gives every supporting sprite visible pixels", () => {
    for (const [name, rows] of SUPPORTING) {
      expect(rows.some((row) => /[^.]/.test(row)), name).toBe(true);
    }
  });
});
