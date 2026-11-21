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

const heroAlone: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [4, "nwwwwwwn", 4],
  [4, "nwnwwnwn", 4],
  [4, "nwwwwwwn", 4],
  [4, "nwwnnwwn", 4],
  [5, "nnnnnn", 5],
  [3, "nn", "cccccc", "nn", 3],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "cccccccccc", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [4, "n", "llllll", "n", 4],
  [5, "n", "llll", "n", 5],
  [6, "n", "ll", "n", 6],
  [5, "n", "nnnn", "n", 5],
  [16],
];

const heroCared: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [4, "nwwwwwwn", 4],
  [4, "nwnwwnwn", 4],
  [4, "nwwwwwwn", 4],
  [4, "nwwnnwwn", 4],
  [5, "nnnnnn", 5],
  [3, "nn", "cccccc", "nn", 3],
  [2, "n", "cccccclccc", "n", 2],
  [2, "n", "ccccccllcc", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "cccccccc", "n", 3],
  [4, "n", "llllll", "n", 4],
  [4, "n", "llllll", "n", 4],
  [5, "n", "llll", "n", 5],
  [6, "n", "ll", "n", 6],
  [5, "n", "nnnn", "n", 5],
  [16],
];

const heroHome: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wwnwwnww", "n", 3],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wwwnnnww", "n", 3],
  [4, "nnnnnnnn", 4],
  [4, "n", "cccccc", "n", 4],
  [3, "n", "cccccccc", "n", 3],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "cccccccccc", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [4, "n", "llllll", "n", 4],
  [4, "n", "llllll", "n", 4],
  [5, "n", "llll", "n", 5],
  [6, "n", "ll", "n", 6],
  [5, "n", "nnnn", "n", 5],
  [16],
];

const heroSchool: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wwnwwnww", "n", 3],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wnwwwwnw", "n", 3],
  [4, "nnnnnnnn", 4],
  [4, "n", "cccccc", "n", 4],
  [3, "n", "cccccccc", "n", 3],
  [2, "n", "cccrrccccc", "n", 2],
  [2, "n", "cccccccccc", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "llllllll", "n", 3],
  [4, "n", "llllll", "n", 4],
  [4, "n", "llllll", "n", 4],
  [5, "n", "llll", "n", 5],
  [6, "n", "ll", "n", 6],
  [5, "n", "nnnn", "n", 5],
  [16],
];

const heroPreteen: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wwnwwnww", "n", 3],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wnwwwwnw", "n", 3],
  [4, "nnnnnnnn", 4],
  [4, "n", "cccccc", "n", 4],
  [3, "n", "cccccccc", "n", 3],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "cccccccccc", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "llllllll", "n", 3],
  [4, "n", "llllll", "n", 4],
  [4, "n", "llllll", "n", 4],
  [4, "n", "llllll", "n", 4],
  [5, "n", "llll", "n", 5],
  [6, "n", "ll", "n", 6],
  [5, "n", "nnnn", "n", 5],
  [16],
];

const heroTeen: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wwnwwnww", "n", 3],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wnwwwwnw", "n", 3],
  [4, "nnnnnnnn", 4],
  [4, "n", "cccccc", "n", 4],
  [3, "n", "ccwwwwcc", "n", 3],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "cclllccccc", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "nnnnnnnn", "n", 3],
  [3, "n", "nnnnnnnn", "n", 3],
  [4, "n", "nnnnnn", "n", 4],
  [4, "n", "nnnnnn", "n", 4],
  [5, "n", "nnnn", "n", 5],
  [6, "n", "nn", "n", 6],
  [5, "n", "nnnn", "n", 5],
  [16],
];

const heroAdult: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wwnwwnww", "n", 3],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wnwwwwnw", "n", 3],
  [4, "nnnnnnnn", 4],
  [4, "n", "cccccc", "n", 4],
  [3, "n", "ccwwwwcc", "n", 3],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "ccnnnncccc", "n", 2],
  [2, "n", "cnnnnnnccc", "n", 2],
  [3, "n", "nnnnnnnn", "n", 3],
  [3, "n", "nnnnnnnn", "n", 3],
  [3, "n", "nnnnnnnn", "n", 3],
  [4, "n", "nnnnnn", "n", 4],
  [4, "n", "nnnnnn", "n", 4],
  [4, "n", "nnnnnn", "n", 4],
  [5, "n", "nnnn", "n", 5],
  [6, "n", "nn", "n", 6],
  [5, "n", "nnnn", "n", 5],
  [16],
];

const heroRuns: Record<Stage, Run[][]> = {
  1: heroAlone,
  2: heroCared,
  3: heroHome,
  4: heroSchool,
  5: heroPreteen,
  6: heroTeen,
  7: heroAdult,
};

export const HERO_SPRITES: Record<Stage, string[]> = {
  1: heroAlone.map((runs) => paint(HERO_WIDTH, runs)),
  2: heroCared.map((runs) => paint(HERO_WIDTH, runs)),
  3: heroHome.map((runs) => paint(HERO_WIDTH, runs)),
  4: heroSchool.map((runs) => paint(HERO_WIDTH, runs)),
  5: heroPreteen.map((runs) => paint(HERO_WIDTH, runs)),
  6: heroTeen.map((runs) => paint(HERO_WIDTH, runs)),
  7: heroAdult.map((runs) => paint(HERO_WIDTH, runs)),
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

const motherRuns: Run[][] = [
  [16],
  [6, "nnnn", 6],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wwnwwnww", "n", 3],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wnwwwwnw", "n", 3],
  [4, "nnnnnnnn", 4],
  [3, "n", "cccccccc", "n", 3],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "ccwwwwwwcc", "n", 2],
  [2, "n", "ccwwwwwwcc", "n", 2],
  [3, "n", "ccwwwwcc", "n", 3],
  [3, "n", "cccccccc", "n", 3],
  [4, "n", "cccccc", "n", 4],
  [5, "n", "cccc", "n", 5],
  [6, "n", "nn", "n", 6],
  [16],
];

const siblingARuns: Run[][] = [
  [12],
  [4, "nnnn", 4],
  [3, "nnnnnn", 3],
  [3, "nwwwwn", 3],
  [3, "n", "wnwn", "n", 3],
  [3, "nwwwwn", 3],
  [3, "nwnnwn", 3],
  [3, "n", "llll", "n", 3],
  [2, "n", "llllll", "n", 2],
  [2, "n", "llllll", "n", 2],
  [3, "n", "llll", "n", 3],
  [4, "n", "nn", "n", 4],
  [12],
];

const siblingBRuns: Run[][] = [
  [12],
  [4, "nnnn", 4],
  [3, "nnnnnn", 3],
  [3, "nwwwwn", 3],
  [3, "n", "wnwn", "n", 3],
  [3, "nwwwwn", 3],
  [3, "n", "nwwn", "n", 3],
  [3, "n", "cccc", "n", 3],
  [2, "n", "cccccc", "n", 2],
  [2, "n", "cccccc", "n", 2],
  [3, "n", "nnnn", "n", 3],
  [4, "n", "nn", "n", 4],
  [12],
];

const directorRuns: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "nwwwwwwn", "n", 3],
  [3, "n", "wwnwwnww", "n", 3],
  [3, "n", "wwwwwwww", "n", 3],
  [3, "n", "wnnnnnww", "n", 3],
  [4, "nnnnnnnn", 4],
  [3, "n", "nnwwnnnn", "n", 3],
  [2, "n", "nnwwwwnnnn", "n", 2],
  [2, "n", "nnwwwwnnnn", "n", 2],
  [3, "n", "nnwwnnnn", "n", 3],
  [3, "n", "nnnnnnnn", "n", 3],
  [4, "n", "nnnnnn", "n", 4],
  [5, "n", "nnnn", "n", 5],
  [6, "n", "nn", "n", 6],
  [16],
];

const staffRuns: Run[][] = [
  [16],
  [5, "nnnnnn", 5],
  [4, "nnnnnnnn", 4],
  [4, "nwwwwwwn", 4],
  [4, "nwnwwnwn", 4],
  [4, "nwwwwwwn", 4],
  [4, "nwnnnwwn", 4],
  [5, "nnnnnn", 5],
  [3, "n", "cccccccc", "n", 3],
  [2, "n", "cccccccccc", "n", 2],
  [2, "n", "ccrrrrcccc", "n", 2],
  [3, "n", "cccccccc", "n", 3],
  [3, "n", "cccccccc", "n", 3],
  [4, "n", "llllll", "n", 4],
  [5, "n", "llll", "n", 5],
  [6, "n", "nn", "n", 6],
  [16],
];

const friendRuns: Run[][] = [
  [12],
  [4, "nnnn", 4],
  [3, "nnnnnn", 3],
  [3, "nwwwwn", 3],
  [3, "n", "wnwn", "n", 3],
  [3, "nwwwwn", 3],
  [3, "n", "nwwn", "n", 3],
  [3, "n", "wwww", "n", 3],
  [2, "n", "cccccc", "n", 2],
  [3, "n", "llll", "n", 3],
  [4, "n", "nn", "n", 4],
  [12],
];

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
export const SIBLING_A = sprite(12, siblingARuns);
export const SIBLING_B = sprite(12, siblingBRuns);
export const DIRECTOR = sprite(16, directorRuns);
export const STAFF = sprite(16, staffRuns);
export const CHILD_FRIEND = sprite(12, friendRuns);
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
