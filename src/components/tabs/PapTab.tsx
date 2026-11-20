"use client";

import { useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import { GUIDE, GUIDE_BLINK } from "@/components/pixel/sprites";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  ResetIcon,
  ShieldIcon,
} from "@/components/icons";
import { interpolate } from "@/lib/i18n";
import { formatAmount } from "@/lib/pap/domain";

const MONTHLY_AMOUNTS = [10, 20, 50, 100] as const;

export function PapTab() {
  const { t, lang, setTab } = useExperience();
  const [step, setStep] = useState(0);
  const [monthly, setMonthly] = useState(20);
  const [confirmed, setConfirmed] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);

  const totalSteps = t.pap.steps.length;
  const currentStep = t.pap.steps[step] ?? { title: "", body: "" };
  const isLast = step === totalSteps - 1;

  const restart = () => {
    setStep(0);
    setConfirmed(false);
    setMonthly(20);
    setActiveTimeline(0);
  };

  return (
    <>
      <div className="page-head">
        <span className="kicker">{t.pap.kicker}</span>
        <h1>{t.pap.title}</h1>
        <p className="lede">{t.pap.subtitle}</p>
      </div>

      <div className="card stack">
        <div className="stepper" role="group" aria-label={t.pap.journeyTitle}>
          {t.pap.steps.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className="step-dot"
              data-state={index === step ? "current" : index < step ? "done" : "todo"}
              aria-current={index === step ? "step" : undefined}
              aria-label={interpolate(t.pap.stepLabel, {
                current: index + 1,
                total: totalSteps,
              })}
              onClick={() => setStep(index)}
            >
              <i>{index < step ? "✓" : index + 1}</i>
              <span className="hide-sm">{item.title}</span>
            </button>
          ))}
        </div>

        <div className="guide-grid">
          <div className={`guide-figure${confirmed ? " celebrate" : ""}`}>
            <PixelSprite
              rows={GUIDE}
              blinkRows={GUIDE_BLINK}
              blink
              label={t.pap.guideAlt}
            />
          </div>

          <div className="guide-bubble">
            <span className="badge">
              {interpolate(t.pap.stepLabel, { current: step + 1, total: totalSteps })}
            </span>
            <h3 className="mt-1">{currentStep.title}</h3>
            <p>{currentStep.body}</p>

            {step === 1 ? (
              <div className="stack mt-2">
                <strong className="small">{t.pap.amountTitle}</strong>
                <div className="chips">
                  {MONTHLY_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="chip"
                      aria-pressed={monthly === value}
                      onClick={() => setMonthly(value)}
                    >
                      {formatAmount(value, lang)}
                    </button>
                  ))}
                </div>
                <p className="hint">{t.pap.amountHint}</p>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="stack mt-2">
                <strong className="small">{t.pap.smsTitle}</strong>
                <div className="phone">
                  <div className="phone-notch" />
                  <div className="phone-screen">
                    {confirmed ? (
                      <div className="stack center" style={{ alignItems: "center" }}>
                        <span className="success-mark" aria-hidden="true">
                          <CheckIcon />
                        </span>
                        <strong>{t.pap.smsConfirmedTitle}</strong>
                        <p className="tiny muted">{t.pap.smsConfirmedBody}</p>
                      </div>
                    ) : (
                      <>
                        <div className="sms">
                          <div className="sms-head">
                            <i aria-hidden="true">PAP</i>
                            <span>{t.pap.smsFrom}</span>
                          </div>
                          <p>
                            {interpolate(t.pap.smsBody, {
                              amount: formatAmount(monthly, lang),
                            })}
                          </p>
                          <span className="sms-tag">{t.common.simulation}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm btn-block"
                          onClick={() => setConfirmed(true)}
                        >
                          {t.pap.smsConfirm}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="note">{t.pap.smsDisclaimer}</p>
              </div>
            ) : null}

            <div className="row mt-3">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                disabled={step === 0}
              >
                <ArrowLeftIcon />
                {t.common.back}
              </button>
              {isLast ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setTab("quiz")}
                >
                  {t.pap.cta}
                  <ArrowRightIcon />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setStep((value) => Math.min(totalSteps - 1, value + 1))}
                >
                  {t.common.next}
                  <ArrowRightIcon />
                </button>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={restart}>
                <ResetIcon />
                {t.pap.restart}
              </button>
            </div>
            <p className="sr-only" role="status">
              {interpolate(t.pap.stepAnnounce, {
                current: step + 1,
                title: currentStep.title,
              })}
            </p>
          </div>
        </div>

        <div className="callout callout-coral">
          <span className="callout-icon" aria-hidden="true">
            <InfoIcon />
          </span>
          <div>
            <strong>{t.common.simulation}</strong>
            <p>{t.pap.journeyHint}</p>
          </div>
        </div>
      </div>

      <div className="card stack">
        <div>
          <h2 className="card-title">{t.pap.definitionTitle}</h2>
          <p className="card-body">{t.pap.definitionBody}</p>
        </div>
      </div>

      <div className="card stack">
        <div>
          <h2 className="card-title">{t.pap.timelineTitle}</h2>
          <p className="card-body">{t.pap.timelineHint}</p>
        </div>
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
