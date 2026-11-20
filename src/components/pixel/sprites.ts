/**
 * Original pixel-art sprites, hand-authored as run-length rows.
 * Numbers are transparent pixels, strings are palette letters.
 * Every sprite is validated by tests/sprites.test.ts.
 */

import type { PixelPalette } from "./PixelSprite";

type Run = number | string;

function paint(width: number, runs: Run[]): string {
  let out = "";
  for (const run of runs) {
    out += typeof run === "number" ? ".".repeat(run) : run;
  }
  if (out.length !== width) {
    throw new Error(`Sprite row is ${out.length}px wide, expected ${width}px: "${out}"`);
  }
  return out;
}

const CHILD_WIDTH = 16;

const childRuns: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [4, "nnnnnnnn", 4],
  [4, "n", "wwwwww", "n", 4],
  [4, "n", "wnwwnw", "n", 4],
  [4, "n", "wwwwww", "n", 4],
  [4, "n", "wrwwrw", "n", 4],
  [5, "n", "wwww", "n", 5],
  [6, "n", "ww", "n", 6],
  [4, "n", "cccccc", "n", 4],
  [3, "n", "w", "cccccc", "w", "n", 3],
  [2, "n", "w", "cccccccc", "w", "n", 2],
  [2, "n", "w", "cccccccc", "w", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "llllllll", "n", 3],
  [2, "n", "llllllllll", "n", 2],
  [2, "n", "llllllllll", "n", 2],
  [3, "n", "llllllll", "n", 3],
  [5, "n", "w", 2, "w", "n", 5],
  [5, "n", "w", 2, "w", "n", 5],
  [4, "nn", 4, "nn", 4],
];

export const CHILD: string[] = childRuns.map((runs) => paint(CHILD_WIDTH, runs));

const GUIDE_WIDTH = 16;

const guideRuns: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [4, "nnnnnnnn", 4],
  [4, "n", "wwwwww", "n", 4],
  [4, "n", "wnwwnw", "n", 4],
  [4, "n", "wwwwww", "n", 4],
  [4, "n", "wrwwrw", "n", 4],
  [5, "n", "wwww", "n", 5],
  [6, "n", "rr", "n", 6],
  [4, "n", "cccccc", "n", 4],
  [2, "n", "w", "cccccccc", "w", "n", 2],
  [2, "n", "w", "cccccccc", "w", "n", 2],
  [2, "n", "w", "cccccccc", "w", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "nnnnnnnn", "n", 3],
  [3, "n", "llllllll", "n", 3],
  [3, "n", "llllllll", "n", 3],
  [3, "n", "llllllll", "n", 3],
  [4, "n", "llllll", "n", 4],
  [4, "n", "llllll", "n", 4],
  [4, "nll", 2, "lln", 4],
  [4, "nll", 2, "lln", 4],
  [4, "nll", 2, "lln", 4],
  [4, "nnn", 2, "nnn", 4],
];

export const GUIDE: string[] = guideRuns.map((runs) => paint(GUIDE_WIDTH, runs));

const SPROUT_WIDTH = 11;

const sproutRuns: Run[][] = [
  [11],
  [5, "n", 5],
  [4, "n", "c", "n", 4],
  [3, "n", "ccc", "n", 3],
  [2, "n", "ccccc", "n", 2],
  [2, "n", "ccccc", "n", 2],
  [3, "n", "ccc", "n", 3],
  [4, "n", "c", "n", 4],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
  [5, "n", 5],
];

export const SPROUT: string[] = sproutRuns.map((runs) => paint(SPROUT_WIDTH, runs));

const TREE_WIDTH = 20;

const treeRuns: Run[][] = [
  [20],
  [6, "n", "cccccc", "n", 6],
  [4, "n", "cccccccccc", "n", 4],
  [3, "n", "ccrccccccrcc", "n", 3],
  [3, "n", "cccccccccccc", "n", 3],
  [2, "n", "cccrcccccrcccc", "n", 2],
  [2, "n", "cccccccccccccc", "n", 2],
  [3, "n", "cccccccccccc", "n", 3],
  [4, "n", "cccccccccc", "n", 4],
  [6, "n", "cccccc", "n", 6],
  [8, "nccn", 8],
  [9, "nn", 9],
  [9, "nn", 9],
  [9, "nn", 9],
  [9, "nn", 9],
  [9, "nn", 9],
  [9, "nn", 9],
  [9, "nn", 9],
  [9, "nn", 9],
  [8, "nnnn", 8],
  [7, "nnnnnn", 7],
];

export const TREE: string[] = treeRuns.map((runs) => paint(TREE_WIDTH, runs));

const HOUSE_WIDTH = 24;

const houseRuns: Run[][] = [
  [24],
  [11, "nn", 11],
  [10, "nccn", 10],
  [9, "nccccn", 9],
  [8, "nccccccn", 8],
  [7, "nccccccccn", 7],
  [6, "nccccccccccn", 6],
  [5, "nccccccccccccn", 5],
  [4, "nccccccccccccccn", 4],
  [3, "n", "llllllllllllllll", "n", 3],
  [3, "n", "wwwwwwwwwwwwwwww", "n", 3],
  [3, "n", "wllwwwwwwllwwwww", "n", 3],
  [3, "n", "wllwwwwwwllwwwww", "n", 3],
  [3, "n", "wwwwwwwwwwwwwwww", "n", 3],
  [3, "n", "wwwwwwrrrrwwwwww", "n", 3],
  [3, "n", "wwwwwwrrrrwwwwww", "n", 3],
  [3, "n", "wwwwwwrrrrwwwwww", "n", 3],
  [3, "n", "wwwwwwrrrrwwwwww", "n", 3],
  [3, "n", "wwwwwwrrrrwwwwww", "n", 3],
  [3, "n", "wwwwwwwwwwwwwwww", "n", 3],
  [2, "n", "llllllllllllllllll", "n", 2],
];

export const HOUSE: string[] = houseRuns.map((runs) => paint(HOUSE_WIDTH, runs));

const HOUSE_LARGE_WIDTH = 28;

const houseLargeRuns: Run[][] = [
  [28],
  [13, "nn", 13],
  [12, "nccn", 12],
  [11, "nccccn", 11],
  [10, "nccccccn", 10],
  [9, "nccccccccn", 9],
  [8, "nccccccccccn", 8],
  [7, "nccccccccccccn", 7],
  [6, "nccccccccccccccn", 6],
  [5, "nccccccccccccccccn", 5],
  [4, "n", "llllllllllllllllll", "n", 4],
  [3, "n", "wwwwwwwwwwwwwwwwwwww", "n", 3],
  [3, "n", "wllwwwwllwwwwllwwwww", "n", 3],
  [3, "n", "wllwwwwllwwwwllwwwww", "n", 3],
  [3, "n", "wwwwwwwwwwwwwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwwwwwwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwrrrrwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwrrrrwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwrrrrwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwrrrrwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwrrrrwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwwwwwwwwwwwww", "n", 3],
  [2, "n", "llllllllllllllllllllll", "n", 2],
];

export const HOUSE_LARGE: string[] = houseLargeRuns.map((runs) =>
  paint(HOUSE_LARGE_WIDTH, runs),
);

const CLOUD_WIDTH = 16;

const cloudRuns: Run[][] = [
  [6, "nnnn", 6],
  [4, "n", "wwwwww", "n", 4],
  [2, "n", "wwwwwwwwww", "n", 2],
  [2, "n", "wwwwwwwwww", "n", 2],
  [3, "n", "llllllll", "n", 3],
  [5, "nnnnnn", 5],
];

export const CLOUD: string[] = cloudRuns.map((runs) => paint(CLOUD_WIDTH, runs));

const FLOWER_WIDTH = 7;

const flowerRuns: Run[][] = [
  [7],
  [3, "r", 3],
  [2, "rrr", 2],
  [2, "rnr", 2],
  [3, "r", 3],
  [3, "n", 3],
  [3, "n", 3],
  [2, "c", "n", "c", 2],
  [3, "n", 3],
  [3, "n", 3],
];

export const FLOWER: string[] = flowerRuns.map((runs) => paint(FLOWER_WIDTH, runs));

const BENCH_WIDTH = 16;

const benchRuns: Run[][] = [
  [16],
  [2, "n", "llllllllll", "n", 2],
  [2, "n", "llllllllll", "n", 2],
  [2, "n", "nnnnnnnnnn", "n", 2],
  [3, "nn", 2, "nn", 2, "nn", 3],
  [3, "nn", 2, "nn", 2, "nn", 3],
  [3, "nn", 2, "nn", 2, "nn", 3],
];

export const BENCH: string[] = benchRuns.map((runs) => paint(BENCH_WIDTH, runs));

export type SpriteVariant = "a" | "b" | "c" | "d";

/** Palette overrides keep every character inside the six-colour chart. */
export const CHILD_PALETTES: Record<SpriteVariant, PixelPalette> = {
  a: { c: "cyan", l: "lightBlue" },
  b: { c: "lightBlue", l: "cyan" },
  c: { c: "coral", l: "white" },
  d: { c: "white", l: "cyan" },
};

export const CHILD_EYES: Array<[number, number]> = [
  [6, 5],
  [9, 5],
];

export const GUIDE_EYES = CHILD_EYES;

export function withBlink(rows: string[], eyes: Array<[number, number]>): string[] {
  return rows.map((row, y) => {
    const chars = [...row];
    for (const [x, eyeY] of eyes) {
      if (y === eyeY && chars[x] !== undefined) chars[x] = "w";
    }
    return chars.join("");
  });
}

export const CHILD_BLINK = withBlink(CHILD, CHILD_EYES);
export const GUIDE_BLINK = withBlink(GUIDE, GUIDE_EYES);
