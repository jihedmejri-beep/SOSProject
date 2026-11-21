export type JourneyTag = "fact" | "simulation";
export type SimMode = "form" | "message" | "checks" | "link" | "coin" | "calendar" | "alert" | "edit" | "pause" | "finish";

export type JourneyStageMeta = {
  number: number;
  tag: JourneyTag;
  simMode: SimMode;
};

/** Stage classification carried over from the original 10-stage journey. */
export const JOURNEY_STAGES: readonly JourneyStageMeta[] = [
  { number: 1, tag: "fact", simMode: "form" },
  { number: 2, tag: "simulation", simMode: "message" },
  { number: 3, tag: "simulation", simMode: "checks" },
  { number: 4, tag: "fact", simMode: "link" },
  { number: 5, tag: "fact", simMode: "coin" },
  { number: 6, tag: "fact", simMode: "calendar" },
  { number: 7, tag: "fact", simMode: "alert" },
  { number: 8, tag: "fact", simMode: "edit" },
  { number: 9, tag: "fact", simMode: "pause" },
  { number: 10, tag: "fact", simMode: "finish" },
];
