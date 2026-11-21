import { describe, expect, it } from "vitest";
import { STAGES } from "@/lib/pap/domain";
import { HERO_SPRITES } from "@/components/pixel/storySprites";
import { SCENE_LAYERS, layersForStage } from "@/components/pixel/sceneLayers";

function ids(stage: (typeof STAGES)[number]): string[] {
  return SCENE_LAYERS[stage].map((layer) => layer.id);
}

describe("scene layers", () => {
  it("puts the age-appropriate hero in every stage exactly once", () => {
    for (const stage of STAGES) {
      const heroes = SCENE_LAYERS[stage].filter((layer) => layer.id === "hero");
      expect(heroes, `stage ${stage}`).toHaveLength(1);
      expect(heroes[0]?.sprite).toBe(HERO_SPRITES[stage]);
    }
  });

  it("keeps stage 1 bare and stage 2 limited to a first act of care", () => {
    const undeveloped = [
      "house-modest",
      "house-side",
      "school",
      "community-hall",
      "sapling",
      "toy",
      "book",
      "mother",
      "sibling-a",
      "sibling-b",
      "director",
      "staff",
      "child-friend",
      "diploma",
      "bowl",
    ];
    for (const id of undeveloped) expect(ids(1)).not.toContain(id);
    expect(ids(2)).toContain("bowl");
    expect(ids(2)).not.toContain("house-modest");
    expect(ids(2)).not.toContain("school");
  });

  it("introduces each milestone in its intended stage", () => {
    expect(ids(3)).toEqual(expect.arrayContaining(["house-modest", "mother"]));
    expect(ids(4)).toEqual(expect.arrayContaining(["school", "book", "toy"]));
    expect(ids(5)).toEqual(expect.arrayContaining(["sibling-a", "sibling-b"]));
    expect(ids(6)).toEqual(expect.arrayContaining(["director", "school", "house-side"]));
    expect(ids(7)).toEqual(
      expect.arrayContaining(["diploma", "staff", "community-hall", "child-friend"]),
    );
  });

  it("makes every stage visually distinct", () => {
    const signatures = STAGES.map((stage) => ids(stage).join(","));
    expect(new Set(signatures).size).toBe(7);
  });

  it("keeps introduced family and village elements in later stages", () => {
    const persistent = [
      "hero",
      "house-modest",
      "mother",
      "school",
      "sibling-a",
      "director",
      "diploma",
    ];
    for (const id of persistent) {
      const first = STAGES.find((stage) => ids(stage).includes(id));
      if (first === undefined) continue;
      for (const stage of STAGES) {
        if (stage >= first) expect(ids(stage), `${id} at stage ${stage}`).toContain(id);
      }
    }
  });

  it("returns the configured array for a stage", () => {
    expect(layersForStage(3)).toBe(SCENE_LAYERS[3]);
  });
});
