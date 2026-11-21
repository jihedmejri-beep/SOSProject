import { STAGE_THRESHOLDS, type Stage } from "./domain";

export const IMPACT_STAGE_IDS = [
  "alone",
  "first-care",
  "home",
  "play-school",
  "family",
  "village",
  "future",
] as const;

export type ImpactStageId = (typeof IMPACT_STAGE_IDS)[number];

export type ImpactStage = {
  readonly number: Stage;
  readonly id: ImpactStageId;
  readonly threshold: number;
};

export const IMPACT_STAGES: readonly ImpactStage[] = IMPACT_STAGE_IDS.map(
  (id, index) => {
    const number = (index + 1) as Stage;
    return { number, id, threshold: STAGE_THRESHOLDS[number] };
  },
);

export const IMPACT_STAGE_COUNT = IMPACT_STAGES.length;
