"use client";

import { useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { Journey } from "@/components/journey/Journey";
import { ShieldIcon } from "@/components/icons";

export function PapTab() {
  const { t } = useExperience();
  const [activeTimeline, setActiveTimeline] = useState(0);

  return (
    <>
      <Journey />

      <div className="card stack">
        <span className="badge badge-cyan">{t.pap.definitionKicker}</span>
        <h2 className="card-title">{t.pap.definitionTitle}</h2>
        <p className="card-body">{t.pap.definitionBody}</p>
      </div>

      <div className="card stack">
        <h2 className="card-title">{t.pap.timelineTitle}</h2>
        <p className="card-body">{t.pap.timelineHint}</p>
        <div className="timeline">
          {t.pap.timeline.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className="timeline-item"
              aria-pressed={activeTimeline === index}
              onClick={() => setActiveTimeline(index)}
            >
              <span className="timeline-dot">{index + 1}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="timeline-detail" aria-live="polite">
          {t.pap.timeline[activeTimeline]?.detail ?? ""}
        </div>
      </div>

      <div className="grid-2">
        <div className="card stack">
          <span className="badge badge-cyan">{t.pap.accountTitle}</span>
          <p className="small muted">{t.pap.accountBody}</p>
          <ul className="stack" style={{ gap: 8, paddingInlineStart: 18, margin: 0 }}>
            {t.pap.accountPoints.map((point) => (
              <li key={point} className="small">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="card stack">
          <span className="badge badge-coral">
            <ShieldIcon />
            {t.pap.privacyTitle}
          </span>
          <p className="small muted">{t.pap.privacyBody}</p>
          <ul className="stack" style={{ gap: 8, paddingInlineStart: 18, margin: 0 }}>
            {t.pap.privacyPoints.map((point) => (
              <li key={point} className="small">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
