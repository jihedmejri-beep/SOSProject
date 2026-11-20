"use client";

import { GlobeIcon } from "@/components/icons";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { LANGS, isLang, type Lang } from "@/lib/i18n";

const LABELS: Record<Lang, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export function LanguageSelector() {
  const { lang, setLang, t } = useExperience();

  return (
    <div className="lang">
      <GlobeIcon />
      <label htmlFor="lang-select" className="sr-only">
        {t.a11y.langLabel}
      </label>
      <select
        id="lang-select"
        value={lang}
        onChange={(event) => {
          const next = event.target.value;
          if (isLang(next)) setLang(next);
        }}
        aria-label={t.a11y.langLabel}
      >
        {LANGS.map((code) => (
          <option key={code} value={code} lang={code}>
            {LABELS[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
