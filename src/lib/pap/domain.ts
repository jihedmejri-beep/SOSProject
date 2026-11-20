import type { Lang } from "@/lib/i18n/types";

export const PAP = {
  /** Published normal debit day of the month. */
  debitDay: 25,
  /** Second attempt day, in the following month, when funds were insufficient. */
  retryDay: 5,
  /** Fictional amounts offered by the simulator. */
  amounts: [1, 2, 5, 10] as const,
  maxCustomAmount: 10_000,
  minCustomAmount: 1,
  /** Upper bound for the symbolic counter to keep the scene readable. */
  maxInteractions: 24,
} as const;

export type Stage = 1 | 2 | 3 | 4 | 5;

/** Number of symbolic gestures required to reach each stage. */
export const STAGE_THRESHOLDS: Record<Stage, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 6,
  5: 8,
};

export const STAGES: Stage[] = [1, 2, 3, 4, 5];

export function computeStage(interactions: number): Stage {
  const safe = Math.max(0, Math.min(PAP.maxInteractions, Math.floor(interactions)));
  if (safe >= STAGE_THRESHOLDS[5]) return 5;
  if (safe >= STAGE_THRESHOLDS[4]) return 4;
  if (safe >= STAGE_THRESHOLDS[3]) return 3;
  if (safe >= STAGE_THRESHOLDS[2]) return 2;
  return 1;
}

export function nextStageAt(interactions: number): number | null {
  const stage = computeStage(interactions);
  if (stage === 5) return null;
  const next = (stage + 1) as Stage;
  return STAGE_THRESHOLDS[next];
}

export function gesturesToNextStage(interactions: number): number | null {
  const next = nextStageAt(interactions);
  if (next === null) return null;
  return Math.max(0, next - interactions);
}

/** Progress within the whole experience, 0..1. */
export function experienceProgress(interactions: number): number {
  const safe = Math.max(0, Math.min(PAP.maxInteractions, interactions));
  return Math.min(1, safe / STAGE_THRESHOLDS[5]);
}

export function annualProjection(monthlyAmount: number): number {
  return Math.round(monthlyAmount * 12 * 100) / 100;
}

export function thirtyDayExample(dailyAmount: number): number {
  return Math.round(dailyAmount * 30 * 100) / 100;
}

export function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const [integerPart = "0", decimalPart] = String(rounded).split(".");
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decimalPart ? `${grouped},${decimalPart}` : grouped;
}

export function formatAmount(amount: number, lang: Lang): string {
  const n = formatNumber(amount);
  if (lang === "ar") return `${n} د.ت`;
  if (lang === "en") return `TND ${n}`;
  return `${n} DT`;
}

export const OFFICIAL_LINKS = {
  home: "https://www.sosve.tn/fr/",
  pap: "https://www.sosve.tn/fr/parrainez-aujourdhui/",
  donate: "https://www.sosve.tn/fr/don-en-ligne/",
  inscription: "https://inscription.sos-tunisie.org/",
} as const;

export const TAB_IDS = ["impact", "pap", "quiz", "assistant", "donate"] as const;
export type TabId = (typeof TAB_IDS)[number];

export function isTabId(value: unknown): value is TabId {
  return typeof value === "string" && (TAB_IDS as readonly string[]).includes(value);
}

export const TAB_SLUGS: Record<TabId, string> = {
  impact: "impact",
  pap: "pap",
  quiz: "quiz",
  assistant: "ia",
  donate: "don",
};

export function tabFromHash(hash: string): TabId | null {
  const slug = hash.replace(/^#\/?/, "").trim().toLowerCase();
  const entry = (Object.entries(TAB_SLUGS) as [TabId, string][]).find(
    ([, value]) => value === slug,
  );
  return entry ? entry[0] : null;
}
