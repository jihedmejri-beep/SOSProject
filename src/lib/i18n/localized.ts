import type { Lang } from "./types";

export type Localized = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;

export function pickLocalized(value: Localized, lang: Lang): string {
  return value[lang] ?? value.fr;
}

export function pickLocalizedList(value: LocalizedList, lang: Lang): string[] {
  return value[lang] ?? value.fr;
}
