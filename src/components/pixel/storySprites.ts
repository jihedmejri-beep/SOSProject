/**
 * Original pixel-art cast for the seven-stage journey. Rows are run-length
 * encoded: numbers are transparent pixels, strings are palette letters.
 * tests/storySprites.test.ts checks every row, colour and face signature.
 */

import { withBlink } from "./sprites";
import type { Stage } from "@/lib/pap/domain";

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

const HERO_WIDTH = 16;

type HumanLook = {
  hair: string;
  shirt: string;
  trousers: string;
  mouth: string;
  crown?: string;
  fringe?: string;
  overrides?: Record<number, Run[]>;
};

function humanRuns(look: HumanLook): Run[][] {
  const hair = look.hair;
  const rows: Run[][] = [
    [16],
    [5, look.crown ?? "nnnnnn", 5],
    [4, hair.repeat(8), 4],
    [4, hair, look.fringe ?? "wwwwww", hair, 4],
    [4, hair, "wnwwnw", hair, 4],
    [4, hair, "wwwwww", hair, 4],
    [4, hair, "wwwwww", hair, 4],
    [4, hair, look.mouth, hair, 4],
    [5, "n", "wwww", "n", 5],
    [4, "nnnnnnnn", 4],
    [2, look.shirt.repeat(12), 2],
    [3, look.shirt.repeat(10), 3],
    [3, look.shirt.repeat(10), 3],
    [4, look.shirt.repeat(8), 4],
    [4, look.shirt.repeat(8), 4],
    [4, look.trousers.repeat(8), 4],
    [5, "nn", 2, "nn", 5],
    [5, look.trousers.repeat(2), 2, look.trousers.repeat(2), 5],
    [5, look.trousers.repeat(2), 2, look.trousers.repeat(2), 5],
    [5, "nnn", 2, "nnn", 3],
  ];
  for (const [index, run] of Object.entries(look.overrides ?? {})) {
    rows[Number(index)] = run;
  }
  return rows;
}

const heroLooks: Record<Stage, HumanLook> = {
  1: {
    hair: "n",
    shirt: "l",
    trousers: "n",
    mouth: "nwwwwn",
    fringe: "nnwwww",
    overrides: { 10: [3, "l".repeat(10), 3] },
  },
  2: { hair: "n", shirt: "c", trousers: "l", mouth: "wwnnww", fringe: "nwwwww" },
  3: { hair: "n", shirt: "c", trousers: "n", mouth: "wwnnww", fringe: "wwwwwn" },
  4: {
    hair: "n",
    shirt: "c",
    trousers: "l",
    mouth: "wwnwww",
    fringe: "nnwwww",
    overrides: { 12: [3, "c", "rrrrcccc", "c", 3] },
  },
  5: {
    hair: "n",
    shirt: "c",
    trousers: "n",
    mouth: "wnnnww",
    fringe: "nwwwwn",
    overrides: { 13: [4, "ccrrrrcc", 4] },
  },
  6: {
    hair: "n",
    shirt: "n",
    trousers: "n",
    mouth: "wwnnnw",
    fringe: "wwwwnn",
    overrides: { 10: [2, "nwwwwwwwwwwn", 2] },
  },
  7: {
    hair: "n",
    shirt: "n",
    trousers: "n",
    mouth: "wnnnnw",
    fringe: "nnnnww",
    overrides: {
      11: [1, "n", "nn", "wwwwwwww", "nn", "n", 1],
      13: [4, "n", "rrrrrr", "n", 4],
    },
  },
};

const heroRuns: Record<Stage, Run[][]> = {
  1: humanRuns(heroLooks[1]),
  2: humanRuns(heroLooks[2]),
  3: humanRuns(heroLooks[3]),
  4: humanRuns(heroLooks[4]),
  5: humanRuns(heroLooks[5]),
  6: humanRuns(heroLooks[6]),
  7: humanRuns(heroLooks[7]),
};

export const HERO_SPRITES: Record<Stage, string[]> = {
  1: heroRuns[1].map((runs) => paint(HERO_WIDTH, runs)),
  2: heroRuns[2].map((runs) => paint(HERO_WIDTH, runs)),
  3: heroRuns[3].map((runs) => paint(HERO_WIDTH, runs)),
  4: heroRuns[4].map((runs) => paint(HERO_WIDTH, runs)),
  5: heroRuns[5].map((runs) => paint(HERO_WIDTH, runs)),
  6: heroRuns[6].map((runs) => paint(HERO_WIDTH, runs)),
  7: heroRuns[7].map((runs) => paint(HERO_WIDTH, runs)),
};

export const HERO_EYES: Record<Stage, Array<[number, number]>> = {
  1: [
    [6, 4],
    [9, 4],
  ],
  2: [
    [6, 4],
    [9, 4],
  ],
  3: [
    [6, 4],
    [9, 4],
  ],
  4: [
    [6, 4],
    [9, 4],
  ],
  5: [
    [6, 4],
    [9, 4],
  ],
  6: [
    [6, 4],
    [9, 4],
  ],
  7: [
    [6, 4],
    [9, 4],
  ],
};

export const HERO_BLINK: Record<Stage, string[]> = {
  1: withBlink(heroRuns[1].map((runs) => paint(HERO_WIDTH, runs)), HERO_EYES[1]),
  2: withBlink(heroRuns[2].map((runs) => paint(HERO_WIDTH, runs)), HERO_EYES[2]),
  3: withBlink(heroRuns[3].map((runs) => paint(HERO_WIDTH, runs)), HERO_EYES[3]),
  4: withBlink(heroRuns[4].map((runs) => paint(HERO_WIDTH, runs)), HERO_EYES[4]),
  5: withBlink(heroRuns[5].map((runs) => paint(HERO_WIDTH, runs)), HERO_EYES[5]),
  6: withBlink(heroRuns[6].map((runs) => paint(HERO_WIDTH, runs)), HERO_EYES[6]),
  7: withBlink(heroRuns[7].map((runs) => paint(HERO_WIDTH, runs)), HERO_EYES[7]),
};

const motherRuns = humanRuns({
  hair: "r",
  shirt: "w",
  trousers: "l",
  mouth: "wwnnww",
  crown: "rrrrrr",
  fringe: "rrrrww",
  overrides: { 12: [3, "w", "rrrrrrrr", "w", 3] },
});

const siblingARuns = humanRuns({
  hair: "n",
  shirt: "l",
  trousers: "c",
  mouth: "wwnwww",
  fringe: "wwwwnn",
});

const siblingBRuns = humanRuns({
  hair: "r",
  shirt: "r",
  trousers: "l",
  mouth: "wnnnww",
  crown: "rrrrrr",
  fringe: "nnwwww",
});

const directorRuns = humanRuns({
  hair: "n",
  shirt: "n",
  trousers: "n",
  mouth: "wwnnnw",
  overrides: { 10: [2, "nwwwwwwwwwwn", 2] },
});

const staffRuns = humanRuns({
  hair: "n",
  shirt: "c",
  trousers: "l",
  mouth: "wwnnww",
  fringe: "nwwwwn",
  overrides: { 12: [3, "c", "rrrrrrrr", "c", 3] },
});

const friendRuns = humanRuns({
  hair: "n",
  shirt: "l",
  trousers: "c",
  mouth: "wnnnww",
});

const bowlRuns: Run[][] = [
  [9],
  [2, "ccccc", 2],
  [1, "ccccccc", 1],
  [1, "c", "wwwww", "c", 1],
  [2, "nnnnn", 2],
];

const ballRuns: Run[][] = [
  [8],
  [2, "rrrr", 2],
  [1, "rrrrrr", 1],
  [1, "rwrrwr", 1],
  [1, "rrrrrr", 1],
  [2, "rrrr", 2],
];

const bookRuns: Run[][] = [
  [9],
  [1, "nnnnnnn", 1],
  [1, "n", "wwwww", "n", 1],
  [1, "n", "ccccc", "n", 1],
  [1, "n", "wwwww", "n", 1],
  [1, "nnnnnnn", 1],
];

const diplomaRuns: Run[][] = [
  [12],
  [2, "nnnnnnnn", 2],
  [1, "n", "wwwwwwww", "n", 1],
  [1, "n", "wrrrrrrw", "n", 1],
  [1, "n", "wwwwwwww", "n", 1],
  [1, "n", "wwccwwww", "n", 1],
  [1, "n", "wwwwwwww", "n", 1],
  [2, "nnnnnnnn", 2],
];

const modestHouseRuns: Run[][] = [
  [20],
  [9, "nn", 9],
  [8, "nccn", 8],
  [7, "nccccn", 7],
  [6, "nccccccn", 6],
  [5, "nccccccccn", 5],
  [4, "nccccccccccn", 4],
  [3, "n", "llllllllllll", "n", 3],
  [3, "n", "wwwwwwwwwwww", "n", 3],
  [3, "n", "wwwwwwwwrrrr", "n", 3],
  [3, "n", "wwwwwwwwrrrr", "n", 3],
  [3, "n", "wwwwwwwwrrrr", "n", 3],
  [3, "n", "wwwwwwwwwwww", "n", 3],
  [2, "n", "llllllllllllll", "n", 2],
];

const sideHouseRuns: Run[][] = [
  [16],
  [7, "nn", 7],
  [6, "nccn", 6],
  [5, "nccccn", 5],
  [4, "nccccccn", 4],
  [3, "nccccccccn", 3],
  [2, "n", "llllllllll", "n", 2],
  [2, "n", "wwwwwwwwww", "n", 2],
  [2, "n", "wwwrrrrwww", "n", 2],
  [2, "n", "wwwrrrrwww", "n", 2],
  [2, "n", "wwwwwwwwww", "n", 2],
  [1, "n", "llllllllllll", "n", 1],
];

const schoolRuns: Run[][] = [
  [24],
  [10, "nnnn", 10],
  [9, "nccccn", 9],
  [8, "nccccccn", 8],
  [7, "nccccccccn", 7],
  [6, "nccccccccccn", 6],
  [5, "n", "llllllllllll", "n", 5],
  [4, "n", "wwwwwwwwwwwwww", "n", 4],
  [4, "n", "wwrrwwwwrrwwww", "n", 4],
  [4, "n", "wwrrwwwwrrwwww", "n", 4],
  [4, "n", "wwwwwwwwwwwwww", "n", 4],
  [3, "n", "llllllllllllllll", "n", 3],
  [4, "n", "wwwwwwwwwwwwww", "n", 4],
  [2, "n", "rrrrrrrrrrrrrrrrrr", "n", 2],
];

const hallRuns: Run[][] = [
  [28],
  [12, "nnnn", 12],
  [12, "nccn", 12],
  [11, "nccccn", 11],
  [10, "nccccccn", 10],
  [9, "nccccccccn", 9],
  [8, "nccccccccccn", 8],
  [6, "n", "llllllllllllll", "n", 6],
  [5, "n", "wwwwwwwwwwwwwwww", "n", 5],
  [5, "n", "wrrrrwwwwwwrrrrw", "n", 5],
  [5, "n", "wrrrrwwwwwwrrrrw", "n", 5],
  [5, "n", "wwwwwwrrrrwwwwww", "n", 5],
  [5, "n", "wwwwwwrrrrwwwwww", "n", 5],
  [5, "n", "wwwwwwwwwwwwwwww", "n", 5],
  [4, "n", "llllllllllllllllll", "n", 4],
];

const overcastRuns: Run[][] = [
  [5, "nnnnnn", 5],
  [3, "n", "llllllll", "n", 3],
  [2, "n", "llllllllll", "n", 2],
  [2, "n", "llllllllll", "n", 2],
  [3, "n", "llllllll", "n", 3],
  [5, "nnnnnn", 5],
];

const saplingRuns: Run[][] = [
  [9],
  [4, "n", 4],
  [3, "n", "c", "n", 3],
  [2, "n", "ccc", "n", 2],
  [3, "n", "c", "n", 3],
  [4, "n", 4],
  [4, "n", 4],
  [4, "n", 4],
  [4, "n", 4],
];

function sprite(width: number, runs: Run[][]): string[] {
  return runs.map((row) => paint(width, row));
}

export const MOTHER = sprite(16, motherRuns);
export const SIBLING_A = sprite(16, siblingARuns);
export const SIBLING_B = sprite(16, siblingBRuns);
export const DIRECTOR = sprite(16, directorRuns);
export const STAFF = sprite(16, staffRuns);
export const CHILD_FRIEND = sprite(16, friendRuns);
export const BOWL = sprite(9, bowlRuns);
export const TOY_BALL = sprite(8, ballRuns);
export const BOOK = sprite(9, bookRuns);
export const DIPLOMA = sprite(12, diplomaRuns);
export const HOUSE_MODEST = sprite(20, modestHouseRuns);
export const HOUSE_SIDE = sprite(16, sideHouseRuns);
export const SCHOOL_BUILDING = sprite(24, schoolRuns);
export const COMMUNITY_HALL = sprite(28, hallRuns);
export const CLOUD_OVERCAST = sprite(16, overcastRuns);
export const SAPLING = sprite(9, saplingRuns);
