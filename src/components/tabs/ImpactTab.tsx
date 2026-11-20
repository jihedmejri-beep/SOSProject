"use client";

import { useMemo, useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { VillageScene } from "@/components/pixel/VillageScene";
import { ArrowRightIcon, InfoIcon, ResetIcon, SparkleIcon } from "@/components/icons";
import { interpolate } from "@/lib/i18n";
import {
  PAP,
  annualProjection,
  computeStage,
  experienceProgress,
  formatAmount,
  gesturesToNextStage,
} from "@/lib/pap/domain";
import { parseCustomAmount } from "@/lib/pap/validation";

export function ImpactTab() {
  const { t, lang, setTab } = useExperience();

  const [amount, setAmount] = useState<number>(1);
  const [custom, setCustom] = useState("");
  const [customActive, setCustomActive] = useState(false);
  const [customError, setCustomError] = useState(false);
  const [total, setTotal] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const parsedCustom = useMemo(() => parseCustomAmount(custom), [custom]);
  const activeAmount = customActive && parsedCustom.ok ? parsedCustom.value : amount;
  const stage = computeStage(interactions);
  const remaining = gesturesToNextStage(interactions);
  const annual = annualProjection(activeAmount);
  const atMax = interactions >= PAP.maxInteractions;

  const addContribution = () => {
    if (customActive && !parsedCustom.ok) {
      setCustomError(true);
      return;
    }
    const contribution = customActive && parsedCustom.ok ? parsedCustom.value : amount;
    const nextInteractions = Math.min(PAP.maxInteractions, interactions + 1);
    setTotal((value) => Math.round((value + contribution) * 100) / 100);
    setInteractions(nextInteractions);
    setAnnouncement(
      interpolate(t.impact.addAnnounce, { stage: computeStage(nextInteractions) }),
    );
  };

  const reset = () => {
    setAmount(1);
    setCustom("");
    setCustomActive(false);
    setCustomError(false);
    setTotal(0);
    setInteractions(0);
    setAnnouncement("");
  };

  return (
    <>
      <div className="page-head">
        <span className="kicker">{t.impact.kicker}</span>
        <h1>{t.impact.title}</h1>
        <p className="lede">{t.impact.subtitle}</p>
      </div>

      <div className="sim-grid">
        <div className="card stack" style={{ gap: 14 }}>
          <VillageScene stage={stage} />
          <div className="spread">
            <span className="badge badge-cyan">
              {t.impact.stage} {stage} / 5
            </span>
            <span className="tiny muted">
              {remaining === null
                ? t.impact.maxStage
                : interpolate(t.impact.nextStage, { count: remaining })}
            </span>
          </div>
          <div className="progress" role="progressbar" aria-label={t.a11y.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(experienceProgress(interactions) * 100)}>
            <span style={{ width: `${experienceProgress(interactions) * 100}%` }} />
          </div>
          <p className="small muted">{t.impact.stageDescriptions[stage - 1]}</p>
        </div>

        <div className="card stack">
          <div>
            <h2 className="card-title">{t.impact.amountLabel}</h2>
            <p className="card-body">{t.impact.amountNote}</p>
          </div>

          <div className="chips" role="group" aria-label={t.impact.amountLabel}>
            {PAP.amounts.map((value) => (
              <button
                key={value}
                type="button"
                className="chip"
                aria-pressed={!customActive && amount === value}
                onClick={() => {
                  setAmount(value);
                  setCustomActive(false);
                  setCustomError(false);
                }}
              >
                {formatAmount(value, lang)}
              </button>
            ))}
          </div>

          <div className="field">
            <label htmlFor="custom-amount">{t.impact.customLabel}</label>
            <input
              id="custom-amount"
              className="input"
              inputMode="decimal"
              value={custom}
              placeholder={t.impact.customPlaceholder}
              aria-invalid={customError}
              aria-describedby={customError ? "custom-error" : undefined}
              onFocus={() => setCustomActive(true)}
              onChange={(event) => {
                setCustom(event.target.value);
                setCustomActive(true);
                setCustomError(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addContribution();
                }
              }}
            />
            {customError ? (
              <span className="error" id="custom-error">
                {t.impact.customError}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={addContribution}
            disabled={atMax}
          >
            <SparkleIcon />
            {t.impact.add}
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={reset}>
            <ResetIcon />
            {t.impact.reset}
          </button>

          <div className="stats" aria-live="polite">
            <div className="stat">
              <div className="stat-value">{formatAmount(total, lang)}</div>
              <div className="stat-label">{t.impact.totalLabel}</div>
            </div>
            <div className="stat stat-coral">
              <div className="stat-value">{interactions}</div>
              <div className="stat-label">{t.impact.interactionsLabel}</div>
            </div>
            <div className="stat">
              <div className="stat-value">
                {stage}
                <span className="small muted"> / 5</span>
              </div>
              <div className="stat-label">{t.impact.stageLabel}</div>
            </div>
          </div>

          <p className="sr-only" role="status">
            {announcement}
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-tight stack">
          <span className="badge">{t.impact.annualTitle}</span>
          <p className="small muted">
            {interpolate(t.impact.annualBody, {
              amount: formatAmount(activeAmount, lang),
              annual: formatAmount(annual, lang),
            })}
          </p>
          <hr className="hr" />
          <strong className="small">{t.impact.dailyTitle}</strong>
          <p className="small muted">{t.impact.dailyBody}</p>
          <p className="note">{t.impact.dailyNote}</p>
        </div>

        <div className="stack">
          <div className="callout">
            <span className="callout-icon" aria-hidden="true">
              <InfoIcon />
            </span>
            <div>
              <strong>{t.impact.disclaimerTitle}</strong>
              <p>{t.impact.disclaimer}</p>
            </div>
          </div>
          <div className="callout callout-coral">
            <span className="callout-icon" aria-hidden="true">
              <SparkleIcon />
            </span>
            <div>
              <strong>{t.common.simulation}</strong>
              <p>{t.impact.symbolNote}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setTab("pap")}
          >
            {t.impact.cta}
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </>
  );
}
