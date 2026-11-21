export type JourneyTag = "fact" | "simulation";

export type JourneyStageMeta = {
  number: number;
  tag: JourneyTag;
};

/** Stage classification carried over from the original 10-stage journey. */
export const JOURNEY_STAGES: readonly JourneyStageMeta[] = [
  { number: 1, tag: "fact" },
  { number: 2, tag: "simulation" },
  { number: 3, tag: "simulation" },
  { number: 4, tag: "fact" },
  { number: 5, tag: "fact" },
  { number: 6, tag: "fact" },
  { number: 7, tag: "fact" },
  { number: 8, tag: "fact" },
  { number: 9, tag: "fact" },
  { number: 10, tag: "fact" },
];
