import { describe, expect, it } from "vitest";
import {
  OFFICIAL_LINKS,
  PAP,
  STAGE_THRESHOLDS,
  annualProjection,
  computeStage,
  experienceProgress,
  formatAmount,
  gesturesToNextStage,
  isTabId,
  tabFromHash,
  thirtyDayExample,
} from "@/lib/pap/domain";

describe("village stage progression", () => {
  it("starts at stage 1 and reaches stage 5 at 8 gestures", () => {
    expect(computeStage(0)).toBe(1);
    expect(computeStage(1)).toBe(1);
    expect(computeStage(2)).toBe(2);
    expect(computeStage(3)).toBe(2);
    expect(computeStage(4)).toBe(3);
    expect(computeStage(5)).toBe(3);
    expect(computeStage(6)).toBe(4);
    expect(computeStage(7)).toBe(4);
    expect(computeStage(8)).toBe(5);
    expect(computeStage(100)).toBe(5);
  });

  it("never goes below stage 1 for negative input", () => {
    expect(computeStage(-4)).toBe(1);
  });

  it("computes remaining gestures to the next stage", () => {
    expect(gesturesToNextStage(0)).toBe(2);
    expect(gesturesToNextStage(1)).toBe(1);
    expect(gesturesToNextStage(7)).toBe(1);
    expect(gesturesToNextStage(8)).toBeNull();
    expect(STAGE_THRESHOLDS[5]).toBe(8);
  });

  it("keeps experience progress within 0..1", () => {
    expect(experienceProgress(0)).toBe(0);
    expect(experienceProgress(4)).toBe(0.5);
    expect(experienceProgress(8)).toBe(1);
    expect(experienceProgress(40)).toBe(1);
  });
});

describe("simulation figures", () => {
  it("projects annual amounts without implying a real cost", () => {
    expect(annualProjection(20)).toBe(240);
    expect(annualProjection(1)).toBe(12);
    expect(annualProjection(12.5)).toBe(150);
  });

  it("computes the 30-day illustrative example", () => {
    expect(thirtyDayExample(1)).toBe(30);
    expect(thirtyDayExample(2.5)).toBe(75);
  });

  it("formats amounts per language", () => {
    expect(formatAmount(1000, "fr")).toBe("1 000 DT");
    expect(formatAmount(20, "fr")).toBe("20 DT");
    expect(formatAmount(20, "ar")).toBe("20 د.ت");
    expect(formatAmount(20, "en")).toBe("TND 20");
    expect(formatAmount(12.5, "fr")).toBe("12,5 DT");
  });

  it("keeps the published debit days and amount choices", () => {
    expect(PAP.debitDay).toBe(25);
    expect(PAP.retryDay).toBe(5);
    expect([...PAP.amounts]).toEqual([1, 2, 5, 10]);
  });
});

describe("navigation hashes", () => {
  it("maps hashes to the five tabs only", () => {
    expect(tabFromHash("#impact")).toBe("impact");
    expect(tabFromHash("#/pap")).toBe("pap");
    expect(tabFromHash("#quiz")).toBe("quiz");
    expect(tabFromHash("#ia")).toBe("assistant");
    expect(tabFromHash("#don")).toBe("donate");
    expect(tabFromHash("#unknown")).toBeNull();
    expect(isTabId("assistant")).toBe(true);
    expect(isTabId("settings")).toBe(false);
  });

  it("keeps the official URLs exact", () => {
    expect(OFFICIAL_LINKS.donate).toBe("https://www.sosve.tn/fr/don-en-ligne/");
    expect(OFFICIAL_LINKS.pap).toBe("https://www.sosve.tn/fr/parrainez-aujourdhui/");
    expect(OFFICIAL_LINKS.inscription).toBe("https://inscription.sos-tunisie.org/");
  });
});
