"use client";

import {
  AssistantIcon,
  DonateIcon,
  ImpactIcon,
  PapIcon,
  QuizIcon,
} from "@/components/icons";
import { useExperience } from "@/components/experience/ExperienceProvider";
import type { TabId } from "@/lib/pap/domain";

const ICONS: Record<TabId, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  impact: ImpactIcon,
  pap: PapIcon,
  quiz: QuizIcon,
  assistant: AssistantIcon,
  donate: DonateIcon,
};

export function FloatingDock({
  onNavigate,
}: {
  onNavigate?: (tab: TabId) => void;
}) {
  const { tab, setTab, t, tabOrder } = useExperience();

  const labels: Record<TabId, { short: string; long: string }> = {
    impact: { short: t.nav.impact, long: t.nav.impactLong },
    pap: { short: t.nav.pap, long: t.nav.papLong },
    quiz: { short: t.nav.quiz, long: t.nav.quizLong },
    assistant: { short: t.nav.assistant, long: t.nav.assistantLong },
    donate: { short: t.nav.donate, long: t.nav.donateLong },
  };

  return (
    <nav className="dock" aria-label={t.a11y.navLabel}>
      {tabOrder.map((id) => {
        const Icon = ICONS[id];
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            className="dock-item"
            onClick={() => (onNavigate ? onNavigate(id) : setTab(id))}
            aria-current={active ? "page" : undefined}
            aria-label={labels[id].long}
            title={labels[id].long}
          >
            <Icon />
            <span className="dock-label">{labels[id].short}</span>
          </button>
        );
      })}
    </nav>
  );
}
