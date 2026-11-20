import { ar } from "./ar";
import { en } from "./en";
import { fr, type Dictionary } from "./fr";
import { DEFAULT_LANG, LANGS, dirFor, isLang, type Lang } from "./types";

export const dictionaries: Record<Lang, Dictionary> = { fr, ar, en };

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
}

/** Replace `{key}` placeholders in a translated string. */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

export { DEFAULT_LANG, LANGS, dirFor, isLang };
export type { Dictionary, Lang };
