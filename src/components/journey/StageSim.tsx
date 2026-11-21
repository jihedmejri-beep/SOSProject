"use client";

import { useEffect, useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { useReducedMotion } from "@/components/useReducedMotion";
import { CheckIcon, ResetIcon } from "@/components/icons";
import type { SimMode } from "@/lib/journey/stages";

type Rich = {
  intro: string;
  note: string;
  fill?: string; send?: string; done?: string; name?: string; amount?: string;
  show?: string; confirm?: string; cancel?: string; confirmed?: string; cancelled?: string;
  start?: string; skip?: string; item1?: string; item6?: string;
  activate?: string; deactivate?: string; firstMonth?: string;
  play?: string; date?: string; ref?: string;
  next?: string; prev?: string; paid?: string; pending?: string; jan?: string; feb?: string;
  fail?: string; retry?: string; success?: string; failure?: string; first?: string; second?: string;
  bank?: string; contact?: string; village?: string; submit?: string;
  suspend?: string; reactivate?: string; active?: string; suspended?: string;
  yes?: string; no?: string; reasonTitle?: string; kept?: string;
};

type RichLabels = { demo: string; reset: string; status: string; simulation: string };
type RichOptions = { villages: readonly string[]; reasons: readonly string[] };

function Result({ text, reset, label }: { text: string; reset: () => void; label: string }) {
  return (
    <div className="stage-sim__done">
      <span className="success-mark" aria-hidden="true"><CheckIcon /></span>
      <p className="small">{text}</p>
      <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
        <ResetIcon />
        {label}
      </button>
    </div>
  );
}

function Pill({ children, tone = "cyan" }: { children: React.ReactNode; tone?: "cyan" | "coral" }) {
  return <span className={`badge ${tone === "coral" ? "badge-coral" : "badge-cyan"}`}>{children}</span>;
}

function StageFlow({
  index, rich, labels, options, lang,
}: {
  index: number;
  rich: Rich;
  labels: RichLabels;
  options: RichOptions;
  lang: string;
}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [items, setItems] = useState(0);
  const [choice, setChoice] = useState("");
  const [reason, setReason] = useState("");
  const [month, setMonth] = useState(0);
  const [failed, setFailed] = useState(false);

  const reset = () => { setStep(0); setItems(0); setChoice(""); setReason(""); setMonth(0); setFailed(false); };

  useEffect(() => {
    if (index !== 2 || step !== 1) return;
    if (items >= 6) { setStep(2); return; }
    const id = window.setTimeout(() => setItems((v) => v + 1), reduced ? 80 : 420);
    return () => window.clearTimeout(id);
  }, [index, step, items, reduced]);

  if (index === 0) {
    if (step === 2) return <Result text={rich.done ?? ""} reset={reset} label={labels.reset} />;
    return (
      <div className="stack" style={{ gap: 10 }}>
        {step === 0 ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setStep(1)}>
            {rich.fill ?? labels.demo}
          </button>
        ) : (
          <>
            <p className="small">{rich.name}</p>
            <p className="small">{rich.amount}</p>
            <label className="small">
              {rich.village}
              <select
                className="input"
                defaultValue={options.villages[0]}
                onChange={(event) => setChoice(event.target.value)}
              >
                {options.villages.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setStep(2)}>
              {rich.send}
            </button>
          </>
        )}
      </div>
    );
  }

  if (index === 1) {
    if (step === 2) return <Result text={choice === "confirm" ? (rich.confirmed ?? "") : (rich.cancelled ?? "")} reset={reset} label={labels.reset} />;
    return (
      <div className="stack" style={{ gap: 10 }}>
        {step === 0 ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setStep(1)}>{rich.show}</button>
        ) : (
          <>
            <div className="quick-phone"><p className="small">{labels.simulation} — SOS PAP</p></div>
            <div className="row">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { setChoice("confirm"); setStep(2); }}>{rich.confirm}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setChoice("cancel"); setStep(2); }}>{rich.cancel}</button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (index === 2) {
    if (step === 2) return <Result text={rich.done ?? ""} reset={reset} label={labels.reset} />;
    return (
      <div className="stack" style={{ gap: 10 }}>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={6} aria-valuenow={items}>
          <span style={{ width: `${(items / 6) * 100}%` }} />
        </div>
        <p className="small">{items === 0 ? rich.item1 : items >= 6 ? rich.item6 : `${labels.status} ${items} / 6`}</p>
        <div className="row">
          <button type="button" className="btn btn-primary btn-sm" disabled={step === 1} onClick={() => setStep(1)}>{rich.start}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setItems(6); setStep(2); }}>{rich.skip}</button>
        </div>
      </div>
    );
  }

  if (index === 3 || index === 8) {
    const on = index === 3 ? step === 1 : failed;
    return (
      <div className="stack" style={{ gap: 10 }}>
        <p className="small">{index === 3 ? rich.amount : rich.active}</p>
        <p className="small">{index === 3 ? rich.firstMonth : rich.suspended}</p>
        <Pill>{on ? (index === 3 ? (rich.done ?? "") : (rich.done ?? "")) : labels.status}</Pill>
        <div className="row">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => { if (index === 3) setStep(on ? 0 : 1); else setFailed(!failed); }}
          >
            {index === 3 ? (on ? rich.deactivate : rich.activate) : (on ? rich.reactivate : rich.suspend)}
          </button>
          {index === 8 && on && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFailed(false)}>{rich.confirm}</button>
          )}
        </div>
      </div>
    );
  }

  if (index === 4) {
    if (step === 2) return <Result text={rich.done ?? ""} reset={reset} label={labels.reset} />;
    return (
      <div className="stack" style={{ gap: 10 }}>
        <div className="quick-calendar" aria-hidden="true"><strong>25</strong></div>
        {step === 1 && <p className="small">{rich.date} · {rich.ref}</p>}
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setStep(2)}>{rich.play}</button>
      </div>
    );
  }

  if (index === 5) {
    const label = month === 0 ? rich.jan : month === 1 ? rich.feb : new Date(2026, month, 1).toLocaleString(lang, { month: "long" });
    return (
      <div className="stack" style={{ gap: 10 }}>
        <Pill tone={month < 4 ? "cyan" : "coral"}>{month < 4 ? rich.paid : rich.pending}</Pill>
        <p className="small">{label} · {month < 4 ? rich.paid : rich.pending}</p>
        <div className="row">
          <button type="button" className="btn btn-ghost btn-sm" disabled={month === 0} onClick={() => setMonth((v) => v - 1)}>{rich.prev}</button>
          <button type="button" className="btn btn-primary btn-sm" disabled={month === 4} onClick={() => setMonth((v) => v + 1)}>{rich.next}</button>
        </div>
      </div>
    );
  }

  if (index === 6) {
    if (step === 2) return <Result text={successText(rich, choice)} reset={reset} label={labels.reset} />;
    return (
      <div className="stack" style={{ gap: 10 }}>
        <p className="small">{failed ? rich.first : rich.intro}</p>
        {failed ? (
          <div className="row">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { setChoice("success"); setStep(2); }}>{rich.retry}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setChoice("failure"); setStep(2); }}>{rich.failure}</button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setFailed(true)}>{rich.fail}</button>
        )}
        {failed && <p className="small">{rich.second}</p>}
      </div>
    );
  }

  if (index === 7) {
    if (step === 2) return <Result text={rich.done ?? ""} reset={reset} label={labels.reset} />;
    const choices = [rich.amount ?? "", rich.bank ?? "", rich.contact ?? "", rich.village ?? ""];
    return (
      <div className="stack" style={{ gap: 10 }}>
        <div className="chips">
          {choices.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={choice === c} onClick={() => setChoice(c)}>{c}</button>
          ))}
        </div>
        <button type="button" className="btn btn-primary btn-sm" disabled={!choice} onClick={() => setStep(2)}>{rich.submit}</button>
      </div>
    );
  }

  // stage 10
  if (step === 2) return <Result text={choice === "no" ? (rich.kept ?? "") : (rich.done ?? "")} reset={reset} label={labels.reset} />;
  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="row">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setChoice("yes")}>{rich.yes}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setChoice("no"); setStep(2); }}>{rich.no}</button>
      </div>
      {choice === "yes" && (
        <>
          <strong className="small">{rich.reasonTitle}</strong>
          <div className="chips">
            {options.reasons.map((r) => (
              <button key={r} type="button" className="chip" aria-pressed={reason === r} onClick={() => setReason(r)}>{r}</button>
            ))}
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setStep(2)}>{rich.submit}</button>
        </>
      )}
    </div>
  );
}

function successText(rich: Rich, choice: string) {
  return choice === "failure" ? (rich.failure ?? "") : (rich.success ?? "");
}

export function StageSim({ index, mode }: { index: number; mode: SimMode }) {
  const { t, lang } = useExperience();
  const rich = t.journey.richSims[index] as Rich | undefined;
  if (!rich) return null;
  return (
    <div className={`stage-sim stage-sim--${mode}`} data-phase="idle">
      <p className="small">{rich.intro}</p>
      <StageFlow
        index={index}
        rich={rich}
        labels={t.journey.richLabels}
        options={t.journey.richOptions}
        lang={lang}
      />
      <p className="hint">{rich.note}</p>
    </div>
  );
}
