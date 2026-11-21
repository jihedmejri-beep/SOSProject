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

  it("keeps seven distinct hero sprites that grow without shrinking", () => {
    const heroes = STAGES.map((stage) => HERO_SPRITES[stage]);
    expect(new Set(heroes.map((rows) => rows.join("/"))).size).toBe(7);
    for (let index = 1; index < heroes.length; index += 1) {
      expect(heroes[index]?.length).toBeGreaterThanOrEqual(heroes[index - 1]?.length ?? 0);
    }
    expect(heroes[6]?.length).toBeGreaterThan(heroes[0]?.length ?? 0);
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
