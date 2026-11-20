"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_LANG,
  dirFor,
  getDictionary,
  isLang,
  type Dictionary,
  type Lang,
} from "@/lib/i18n";
import { TAB_IDS, TAB_SLUGS, tabFromHash, type TabId } from "@/lib/pap/domain";
import type { ValidProfile } from "@/lib/pap/validation";

export type Profile = ValidProfile;
export type OnboardingMode = "profile" | "guest";

type ExperienceContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: "ltr" | "rtl";
  t: Dictionary;
  tab: TabId;
  setTab: (tab: TabId) => void;
  tabOrder: readonly TabId[];
  profile: Profile | null;
  guest: boolean;
  hasProfile: boolean;
  onboardingOpen: boolean;
  onboardingMode: OnboardingMode;
  openOnboarding: (mode?: OnboardingMode) => void;
  closeOnboarding: () => void;
  completeProfile: (profile: Profile) => void;
  continueAsGuest: () => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const LANG_KEY = "sos.pap.lang";
const ONBOARDING_KEY = "sos.pap.onboarded";

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [tab, setTabState] = useState<TabId>("impact");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [guest, setGuest] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>("profile");
  const tabRef = useRef<TabId>("impact");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_KEY);
      if (isLang(stored)) setLangState(stored);
    } catch {
      /* French remains the default. */
    }

    const hashTab = tabFromHash(window.location.hash);
    if (hashTab) {
      tabRef.current = hashTab;
      setTabState(hashTab);
    }

    try {
      if (window.sessionStorage.getItem(ONBOARDING_KEY) !== "1") {
        setOnboardingOpen(true);
      }
    } catch {
      setOnboardingOpen(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirFor(lang);
    document.title = getDictionary(lang).meta.title;
  }, [lang]);

  useEffect(() => {
    const onHashChange = () => {
      const next = tabFromHash(window.location.hash);
      if (next && next !== tabRef.current) {
        tabRef.current = next;
        setTabState(next);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      /* Ignore storage failures: the UI still switches language. */
    }
  }, []);

  const setTab = useCallback((next: TabId) => {
    if (tabRef.current === next) return;
    tabRef.current = next;
    setTabState(next);
    try {
      window.history.replaceState(null, "", `#${TAB_SLUGS[next]}`);
    } catch {
      /* Hash update is a convenience, never a requirement. */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, []);

  const markOnboarded = useCallback(() => {
    try {
      window.sessionStorage.setItem(ONBOARDING_KEY, "1");
    } catch {
      /* Session storage is optional. */
    }
  }, []);

  const openOnboarding = useCallback((mode: OnboardingMode = "profile") => {
    setOnboardingMode(mode);
    setOnboardingOpen(true);
  }, []);

  const closeOnboarding = useCallback(() => setOnboardingOpen(false), []);

  const completeProfile = useCallback(
    (next: Profile) => {
      setProfile(next);
      setGuest(false);
      markOnboarded();
      setOnboardingOpen(false);
    },
    [markOnboarded],
  );

  const continueAsGuest = useCallback(() => {
    setProfile(null);
    setGuest(true);
    markOnboarded();
    setOnboardingOpen(false);
  }, [markOnboarded]);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      lang,
      setLang,
      dir: dirFor(lang),
      t: getDictionary(lang),
      tab,
      setTab,
      tabOrder: TAB_IDS,
      profile,
      guest,
      hasProfile: profile !== null,
      onboardingOpen,
      onboardingMode,
      openOnboarding,
      closeOnboarding,
      completeProfile,
      continueAsGuest,
    }),
    [
      lang,
      setLang,
      tab,
      setTab,
      profile,
      guest,
      onboardingOpen,
      onboardingMode,
      openOnboarding,
      closeOnboarding,
      completeProfile,
      continueAsGuest,
    ],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used inside ExperienceProvider");
  }
  return context;
}
