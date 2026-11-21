/**
 * Positioned art for each stage of the child's journey. Layers are ordered
 * back to front; ids are stable so a scene can grow without replacing what
 * came before. tests/sceneLayers.test.ts pins the milestone order.
 */

import type { Stage } from "@/lib/pap/domain";
import type { ImpactStageId } from "@/lib/pap/impactStages";
import { CLOUD, TREE } from "./sprites";
import {
  BOOK,
  BOWL,
  CHILD_FRIEND,
  CLOUD_OVERCAST,
  COMMUNITY_HALL,
  DIPLOMA,
  DIRECTOR,
  HERO_BLINK,
  HERO_SPRITES,
  HOUSE_MODEST,
  HOUSE_SIDE,
  MOTHER,
  SAPLING,
  SCHOOL_BUILDING,
  SIBLING_A,
  SIBLING_B,
  STAFF,
  TOY_BALL,
} from "./storySprites";

export const CHARACTER_WIDTH_CHILD = "clamp(34px, 5.4vw, 56px)";
export const CHARACTER_WIDTH_SCHOOL = "clamp(44px, 7vw, 72px)";
export const CHARACTER_WIDTH_ADULT = "clamp(52px, 8.4vw, 86px)";

export type SceneLayer = {
  readonly id: string;
  readonly sprite: readonly string[];
  readonly left: string;
  readonly bottom: string;
  readonly width: string;
  readonly zIndex: number;
  readonly className?: string;
  readonly blink?: boolean;
};

function layer(
  id: string,
  sprite: readonly string[],
  left: string,
  bottom: string,
  width: string,
  zIndex: number,
  className?: string,
  blink?: boolean,
): SceneLayer {
  return { id, sprite, left, bottom, width, zIndex, className, blink };
}

const heroWidth = (stage: Stage): string =>
  stage <= 3
    ? CHARACTER_WIDTH_CHILD
    : stage <= 5
      ? CHARACTER_WIDTH_SCHOOL
      : CHARACTER_WIDTH_ADULT;

const hero = (stage: Stage): SceneLayer =>
  layer("hero", HERO_SPRITES[stage], "44%", "12%", heroWidth(stage), 5, "bob", true);

const blinkRows = (stage: Stage): readonly string[] => HERO_BLINK[stage];

const alone: readonly SceneLayer[] = [
  layer(
    "cloud-overcast",
    CLOUD_OVERCAST,
    "10%",
    "76%",
    "clamp(40px, 7vw, 70px)",
    1,
    "drift",
  ),
  layer(
    "cloud-overcast-far",
    CLOUD_OVERCAST,
    "64%",
    "70%",
    "clamp(30px, 5vw, 52px)",
    1,
    "drift hide-sm",
  ),
  hero(1),
];

const firstCare: readonly SceneLayer[] = [
  layer(
    "cloud-overcast",
    CLOUD_OVERCAST,
    "10%",
    "76%",
    "clamp(40px, 7vw, 70px)",
    1,
    "drift",
  ),
  layer(
    "cloud-overcast-far",
    CLOUD_OVERCAST,
    "64%",
    "70%",
    "clamp(30px, 5vw, 52px)",
    1,
    "drift hide-sm",
  ),
  layer("bowl", BOWL, "35%", "18%", "clamp(18px, 3vw, 30px)", 4, "scene-pop"),
  hero(2),
];

const home: readonly SceneLayer[] = [
  layer(
    "cloud-overcast",
    CLOUD_OVERCAST,
    "10%",
    "76%",
    "clamp(40px, 7vw, 70px)",
    1,
    "drift",
  ),
  layer(
    "house-modest",
    HOUSE_MODEST,
    "8%",
    "16%",
    "clamp(86px, 17vw, 150px)",
    2,
    "scene-pop",
  ),
  layer("sapling", SAPLING, "66%", "15%", "clamp(16px, 2.6vw, 28px)", 2, "sway"),
  layer(
    "mother",
    MOTHER,
    "30%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
    "scene-pop",
  ),
  hero(3),
];

const playSchool: readonly SceneLayer[] = [
  layer("cloud", CLOUD, "10%", "76%", "clamp(44px, 8vw, 76px)", 1, "drift"),
  layer(
    "house-modest",
    HOUSE_MODEST,
    "8%",
    "16%",
    "clamp(86px, 17vw, 150px)",
    2,
  ),
  layer(
    "school",
    SCHOOL_BUILDING,
    "72%",
    "16%",
    "clamp(80px, 15vw, 140px)",
    1,
    "scene-pop hide-sm",
  ),
  layer("tree", TREE, "66%", "16%", "clamp(38px, 7vw, 68px)", 2, "scene-pop sway"),
  layer(
    "mother",
    MOTHER,
    "30%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
  ),
  layer("book", BOOK, "55%", "14%", "clamp(18px, 3vw, 30px)", 5, "scene-pop"),
  layer("toy", TOY_BALL, "63%", "13%", "clamp(16px, 2.6vw, 26px)", 5, "bob"),
  hero(4),
];

const family: readonly SceneLayer[] = [
  layer("cloud", CLOUD, "10%", "76%", "clamp(44px, 8vw, 76px)", 1, "drift"),
  layer(
    "house-modest",
    HOUSE_MODEST,
    "8%",
    "16%",
    "clamp(86px, 17vw, 150px)",
    2,
  ),
  layer(
    "school",
    SCHOOL_BUILDING,
    "72%",
    "16%",
    "clamp(80px, 15vw, 140px)",
    1,
    "hide-sm",
  ),
  layer("tree", TREE, "66%", "16%", "clamp(38px, 7vw, 68px)", 2, "sway"),
  layer(
    "mother",
    MOTHER,
    "30%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
  ),
  layer("book", BOOK, "55%", "14%", "clamp(18px, 3vw, 30px)", 5),
  layer("toy", TOY_BALL, "63%", "13%", "clamp(16px, 2.6vw, 26px)", 5, "bob"),
  layer(
    "sibling-a",
    SIBLING_A,
    "59%",
    "12%",
    CHARACTER_WIDTH_CHILD,
    4,
    "scene-pop bob",
  ),
  layer(
    "sibling-b",
    SIBLING_B,
    "71%",
    "12%",
    CHARACTER_WIDTH_CHILD,
    4,
    "scene-pop bob hide-sm",
  ),
  hero(5),
];

const village: readonly SceneLayer[] = [
  layer("cloud", CLOUD, "10%", "76%", "clamp(44px, 8vw, 76px)", 1, "drift"),
  layer(
    "house-side",
    HOUSE_SIDE,
    "18%",
    "16%",
    "clamp(58px, 10vw, 100px)",
    1,
    "scene-pop hide-sm",
  ),
  layer(
    "house-modest",
    HOUSE_MODEST,
    "8%",
    "16%",
    "clamp(86px, 17vw, 150px)",
    2,
  ),
  layer(
    "school",
    SCHOOL_BUILDING,
    "72%",
    "16%",
    "clamp(80px, 15vw, 140px)",
    1,
  ),
  layer(
    "house-side-far",
    HOUSE_SIDE,
    "86%",
    "17%",
    "clamp(46px, 8vw, 84px)",
    1,
    "scene-pop hide-sm",
  ),
  layer("tree", TREE, "66%", "16%", "clamp(38px, 7vw, 68px)", 2, "sway"),
  layer(
    "mother",
    MOTHER,
    "30%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
  ),
  layer("book", BOOK, "55%", "14%", "clamp(18px, 3vw, 30px)", 5),
  layer("toy", TOY_BALL, "63%", "13%", "clamp(16px, 2.6vw, 26px)", 5, "bob"),
  layer(
    "sibling-a",
    SIBLING_A,
    "59%",
    "12%",
    CHARACTER_WIDTH_CHILD,
    4,
    "bob",
  ),
  layer(
    "sibling-b",
    SIBLING_B,
    "71%",
    "12%",
    CHARACTER_WIDTH_CHILD,
    4,
    "bob hide-sm",
  ),
  layer(
    "director",
    DIRECTOR,
    "79%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
    "scene-pop hide-sm",
  ),
  hero(6),
];

const future: readonly SceneLayer[] = [
  layer("cloud", CLOUD, "10%", "76%", "clamp(44px, 8vw, 76px)", 1, "drift"),
  layer(
    "community-hall",
    COMMUNITY_HALL,
    "6%",
    "16%",
    "clamp(96px, 18vw, 160px)",
    1,
    "scene-pop",
  ),
  layer(
    "house-side",
    HOUSE_SIDE,
    "18%",
    "16%",
    "clamp(58px, 10vw, 100px)",
    1,
    "hide-sm",
  ),
  layer(
    "house-modest",
    HOUSE_MODEST,
    "8%",
    "16%",
    "clamp(86px, 17vw, 150px)",
    2,
  ),
  layer(
    "school",
    SCHOOL_BUILDING,
    "72%",
    "16%",
    "clamp(80px, 15vw, 140px)",
    1,
  ),
  layer(
    "house-side-far",
    HOUSE_SIDE,
    "86%",
    "17%",
    "clamp(46px, 8vw, 84px)",
    1,
    "hide-sm",
  ),
  layer("tree", TREE, "66%", "16%", "clamp(38px, 7vw, 68px)", 2, "sway"),
  layer(
    "mother",
    MOTHER,
    "30%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
  ),
  layer(
    "staff",
    STAFF,
    "24%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
    "scene-pop hide-sm",
  ),
  layer("book", BOOK, "55%", "14%", "clamp(18px, 3vw, 30px)", 5),
  layer("toy", TOY_BALL, "63%", "13%", "clamp(16px, 2.6vw, 26px)", 5, "bob"),
  layer(
    "sibling-a",
    SIBLING_A,
    "59%",
    "12%",
    CHARACTER_WIDTH_CHILD,
    4,
    "bob",
  ),
  layer(
    "sibling-b",
    SIBLING_B,
    "71%",
    "12%",
    CHARACTER_WIDTH_CHILD,
    4,
    "bob hide-sm",
  ),
  layer(
    "director",
    DIRECTOR,
    "79%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
  ),
  layer(
    "child-friend",
    CHILD_FRIEND,
    "67%",
    "12%",
    CHARACTER_WIDTH_CHILD,
    4,
    "scene-pop bob hide-sm",
  ),
  layer(
    "staff-far",
    STAFF,
    "90%",
    "12%",
    CHARACTER_WIDTH_ADULT,
    4,
    "scene-pop hide-sm",
  ),
  hero(7),
  layer(
    "diploma",
    DIPLOMA,
    "50%",
    "22%",
    "clamp(20px, 3.4vw, 34px)",
    6,
    "bob",
  ),
];

const byId: Record<ImpactStageId, readonly SceneLayer[]> = {
  alone,
  "first-care": firstCare,
  home,
  "play-school": playSchool,
  family,
  village,
  future,
};

export const SCENE_LAYERS: Record<Stage, readonly SceneLayer[]> = {
  1: byId.alone,
  2: byId["first-care"],
  3: byId.home,
  4: byId["play-school"],
  5: byId.family,
  6: byId.village,
  7: byId.future,
};

export function layersForStage(stage: Stage): readonly SceneLayer[] {
  return SCENE_LAYERS[stage];
}

export { blinkRows };
