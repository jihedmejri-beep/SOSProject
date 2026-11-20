"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Brand } from "@/components/Brand";
import { FloatingDock } from "@/components/FloatingDock";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WelcomeModal } from "@/components/WelcomeModal";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { ExternalIcon } from "@/components/icons";
import { AssistantTab } from "@/components/tabs/AssistantTab";
import { DonateTab } from "@/components/tabs/DonateTab";
import { ImpactTab } from "@/components/tabs/ImpactTab";
import { PapTab } from "@/components/tabs/PapTab";
import { QuizTab } from "@/components/tabs/QuizTab";
import { OFFICIAL_LINKS, type TabId } from "@/lib/pap/domain";

const INTERACTIVE =
  'input, textarea, select, button, a, [role="slider"], [contenteditable="true"], .no-swipe, .chat-scroll';

export function AppShell() {
  const { t, tab, setTab, tabOrder, dir } = useExperience();
  const [direction, setDirection] = useState<"next" | "back">("next");
  const touchStart = useRef<{ x: number; y: number; ignore: boolean } | null>(null);

  const go = useCallback(
    (delta: number) => {
      const current = tabOrder.indexOf(tab);
      const nextIndex = Math.max(0, Math.min(tabOrder.length - 1, current + delta));
      const next = tabOrder[nextIndex];
      if (!next || next === tab) return;
      setDirection(delta > 0 ? "next" : "back");
      setTab(next);
    },
    [setTab, tab, tabOrder],
  );

  const navigate = useCallback(
    (next: TabId) => {
      if (next === tab) return;
      setDirection(tabOrder.indexOf(next) > tabOrder.indexOf(tab) ? "next" : "back");
      setTab(next);
    },
    [setTab, tab, tabOrder],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(dir === "rtl" ? -1 : 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(dir === "rtl" ? 1 : -1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dir, go]);

  const onTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const target = event.target as HTMLElement;
    const first = event.touches[0];
    if (!first) return;
    touchStart.current = {
      x: first.clientX,
      y: first.clientY,
      ignore: Boolean(target.closest(INTERACTIVE)),
    };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || start.ignore) return;
    const end = event.changedTouches[0];
    if (!end) return;
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    const forward = dir === "rtl" ? dx > 0 : dx < 0;
    go(forward ? 1 : -1);
  };

  const labelFor = (id: TabId) => {
    switch (id) {
      case "impact":
        return t.nav.impactLong;
      case "pap":
        return t.nav.papLong;
      case "quiz":
        return t.nav.quizLong;
      case "assistant":
        return t.nav.assistantLong;
      case "donate":
        return t.nav.donateLong;
    }
  };

  const renderTab = () => {
    switch (tab) {
      case "impact":
        return <ImpactTab />;
      case "pap":
        return <PapTab />;
      case "quiz":
        return <QuizTab />;
      case "assistant":
        return <AssistantTab />;
      case "donate":
        return <DonateTab />;
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        {t.a11y.skip}
      </a>

      <header className="topbar">
        <Brand />
        <LanguageSelector />
      </header>

      <main
        id="main"
        className="main"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <section
          key={tab}
          className="tab-panel"
          data-dir={direction}
          aria-label={labelFor(tab)}
        >
          {renderTab()}
        </section>

        <footer className="footer">
          <div className="stack" style={{ gap: 4 }}>
            <p>{t.footer.disclaimer}</p>
            <p>{t.footer.independence}</p>
            <p>{t.footer.madeFor}</p>
          </div>
          <div className="footer-links">
            <a href={OFFICIAL_LINKS.home} target="_blank" rel="noopener noreferrer">
              {t.donate.linkHome}
              <ExternalIcon width={12} height={12} />
            </a>
            <a href={OFFICIAL_LINKS.pap} target="_blank" rel="noopener noreferrer">
              {t.donate.linkPap}
            </a>
            <a href={OFFICIAL_LINKS.donate} target="_blank" rel="noopener noreferrer">
              {t.donate.linkDon}
            </a>
          </div>
        </footer>
      </main>

      <FloatingDock onNavigate={navigate} />
      <WelcomeModal />
    </div>
  );
}
