import { describe, expect, it } from "vitest";
import { STAGE_THRESHOLDS, computeStage } from "@/lib/pap/domain";
import { IMPACT_STAGES, IMPACT_STAGE_COUNT } from "@/lib/pap/impactStages";

describe("impact stage configuration", () => {
  it("exposes seven stable stage ids in order", () => {
    expect(IMPACT_STAGE_COUNT).toBe(7);
    expect(IMPACT_STAGES).toHaveLength(7);
    expect(IMPACT_STAGES.map((stage) => stage.id)).toEqual([
      "alone",
      "first-care",
      "home",
      "play-school",
      "family",
      "village",
      "future",
    ]);
    expect(IMPACT_STAGES.map((stage) => stage.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(IMPACT_STAGES.map((stage) => stage.id)).size).toBe(7);
  });

  it("uses the domain thresholds and matches them to the computed stage", () => {
    for (const stage of IMPACT_STAGES) {
      expect(stage.threshold).toBe(STAGE_THRESHOLDS[stage.number]);
      expect(computeStage(stage.threshold)).toBe(stage.number);
    }
  });
});
