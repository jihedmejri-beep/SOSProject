import { describe, expect, it } from "vitest";
import { COLORS, COLOR_NAMES, PIXEL_PALETTE } from "@/lib/theme";
import {
  BENCH,
  CHILD,
  CHILD_BLINK,
  CHILD_EYES,
  CHILD_PALETTES,
  CLOUD,
  FLOWER,
  GUIDE,
  GUIDE_BLINK,
  HOUSE,
  HOUSE_LARGE,
  SPROUT,
  TREE,
  withBlink,
} from "@/components/pixel/sprites";

const SPRITES: Array<[string, string[]]> = [
  ["CHILD", CHILD],
  ["GUIDE", GUIDE],
  ["SPROUT", SPROUT],
  ["TREE", TREE],
  ["HOUSE", HOUSE],
  ["HOUSE_LARGE", HOUSE_LARGE],
  ["CLOUD", CLOUD],
  ["FLOWER", FLOWER],
  ["BENCH", BENCH],
];

const ALLOWED_CHARS = new Set([".", ...Object.keys(PIXEL_PALETTE)]);

describe("pixel sprites", () => {
  it("are non-empty and rectangular", () => {
    for (const [name, rows] of SPRITES) {
      expect(rows.length, name).toBeGreaterThan(0);
      const width = rows[0]?.length ?? 0;
      expect(width, name).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.length, `${name} row width`).toBe(width);
      }
    }
  });

  it("only use transparent or approved palette letters", () => {
    for (const [name, rows] of SPRITES) {
      for (const row of rows) {
        for (const char of row) {
          expect(ALLOWED_CHARS.has(char), `${name} uses ${char}`).toBe(true);
        }
      }
    }
  });

  it("map every child palette override to one of the six colours", () => {
    for (const palette of Object.values(CHILD_PALETTES)) {
      for (const color of Object.values(palette)) {
        expect(COLOR_NAMES).toContain(color);
      }
    }
  });

  it("keeps blink frames aligned with the base sprite", () => {
    expect(CHILD_BLINK).toHaveLength(CHILD.length);
    expect(GUIDE_BLINK).toHaveLength(GUIDE.length);
    for (let y = 0; y < CHILD.length; y += 1) {
      expect(CHILD_BLINK[y]?.length).toBe(CHILD[y]?.length);
    }
    for (const [x, y] of CHILD_EYES) {
      expect(CHILD_BLINK[y]?.[x]).toBe("w");
    }
  });

  it("withBlink changes only the requested eye pixels", () => {
    const rows = ["abc", "def", "ghi"];
    const blinked = withBlink(rows, [[1, 1]]);
    expect(blinked).toEqual(["abc", "dwf", "ghi"]);
    expect(rows).toEqual(["abc", "def", "ghi"]);
  });

  it("exposes exactly the six approved colours", () => {
    expect(COLOR_NAMES.sort()).toEqual(
      ["coral", "cyan", "lightBlue", "navy", "paleBlue", "white"].sort(),
    );
    expect(new Set(Object.values(COLORS)).size).toBe(6);
  });
});
