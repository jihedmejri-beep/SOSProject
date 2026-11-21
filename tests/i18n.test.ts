import { describe, expect, it } from "vitest";
import { ar } from "@/lib/i18n/ar";
import { en } from "@/lib/i18n/en";
import { fr } from "@/lib/i18n/fr";
import { DEFAULT_LANG, LANGS, dirFor, getDictionary, interpolate, isLang } from "@/lib/i18n";

function flatten(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [prefix];
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      flatten(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(strings);
  }
  return [];
}

describe("i18n dictionaries", () => {
  it("defaults to French and exposes exactly three languages", () => {
    expect(DEFAULT_LANG).toBe("fr");
    expect(LANGS).toEqual(["fr", "ar", "en"]);
    expect(isLang("fr")).toBe(true);
    expect(isLang("de")).toBe(false);
    expect(dirFor("ar")).toBe("rtl");
    expect(dirFor("fr")).toBe("ltr");
  });

  it("has identical key structures in fr, ar and en", () => {
    const frKeys = flatten(fr).sort();
    expect(flatten(ar).sort()).toEqual(frKeys);
    expect(flatten(en).sort()).toEqual(frKeys);
  });

  it("has matching array lengths across languages", () => {
    expect(ar.impact.stageNames).toHaveLength(fr.impact.stageNames.length);
    expect(en.impact.stageNames).toHaveLength(fr.impact.stageNames.length);
    expect(ar.impact.stageDescriptions).toHaveLength(fr.impact.stageDescriptions.length);
    expect(fr.pap.steps).toHaveLength(4);
    expect(ar.pap.steps).toHaveLength(fr.pap.steps.length);
    expect(en.pap.steps).toHaveLength(fr.pap.steps.length);
    expect(fr.journey.stages).toHaveLength(10);
    expect(ar.journey.stages).toHaveLength(fr.journey.stages.length);
    expect(en.journey.stages).toHaveLength(fr.journey.stages.length);
    expect(fr.journey.richSims).toHaveLength(10);
    expect(ar.journey.richSims).toHaveLength(10);
    expect(en.journey.richSims).toHaveLength(10);
    expect(ar.journey.richOptions.villages).toHaveLength(fr.journey.richOptions.villages.length);
    expect(en.journey.richOptions.reasons).toHaveLength(fr.journey.richOptions.reasons.length);
    expect(ar.pap.timeline).toHaveLength(fr.pap.timeline.length);
    expect(ar.pap.accountPoints).toHaveLength(fr.pap.accountPoints.length);
    expect(ar.pap.privacyPoints).toHaveLength(fr.pap.privacyPoints.length);
    expect(ar.assistant.suggestions).toHaveLength(fr.assistant.suggestions.length);
    expect(en.assistant.suggestions).toHaveLength(fr.assistant.suggestions.length);
    expect(ar.donate.rows).toHaveLength(fr.donate.rows.length);
  });

  it("has no empty translated strings", () => {
    for (const dictionary of [fr, ar, en]) {
      for (const text of strings(dictionary)) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("falls back to French for unknown languages", () => {
    // @ts-expect-error deliberate invalid input
    expect(getDictionary("de")).toBe(fr);
  });

  it("interpolates placeholders without touching unknown ones", () => {
    expect(interpolate("{amount} DT sur {months} mois", { amount: 10, months: 12 })).toBe(
      "10 DT sur 12 mois",
    );
    expect(interpolate("{missing}", {})).toBe("{missing}");
  });
});
