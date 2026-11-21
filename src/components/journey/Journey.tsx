"use client";

import { useEffect, useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { useReducedMotion } from "@/components/useReducedMotion";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import { CHILD } from "@/components/pixel/sprites";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ResetIcon,
  SparkleIcon,
} from "@/components/icons";
import { JOURNEY_SCENES } from "@/lib/journey/scenes";
import { JOURNEY_STAGES } from "@/lib/journey/stages";

function Scene({ index, label }: { index: number; label: string }) {
  const svg = JOURNEY_SCENES[index];
  if (!svg) return null;
  return (
    <div
      className="journey-scene"
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function Journey() {
  const { t } = useExperience();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [completed, setCompleted] = useState<readonly number[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  const copy = t.journey;

  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setInterval(
      () => setActive((value) => Math.min(JOURNEY_STAGES.length - 1, value + 1)),
      850,
    );
    return () => window.clearInterval(id);
  }, [playing, reduced]);

  useEffect(() => {
    if (!playing) return;
    setCompleted((prev) =>
      prev.includes(active + 1) ? prev : [...prev, active + 1],
    );
    if (active === JOURNEY_STAGES.length - 1) setPlaying(false);
  }, [active, playing]);

  const play = () => {
    if (reduced) {
      setActive(JOURNEY_STAGES.length - 1);
      setCompleted(JOURNEY_STAGES.map((stage) => stage.number));
      setPlaying(false);
      return;
    }
    setSelected(0);
    setActive(0);
    setCompleted([]);
    setPlaying(true);
  };

  const open = (number: number) => {
    setPlaying(false);
    setSelected(number);
    setCompleted((prev) =>
      prev.includes(number) ? prev : [...prev, number],
    );
  };

  const replay = () => {
    setPlaying(false);
    setSelected(0);
    setActive(0);
    setCompleted([]);
    play();
  };

  const selectedIndex = selected === 0 ? -1 : selected - 1;
  const selectedMeta = JOURNEY_STAGES[selectedIndex];
  const selectedCopy = copy.stages[selectedIndex];
  const progress = Math.round((completed.length / JOURNEY_STAGES.length) * 100);

  return (
    <>
      <div className="page-head">
        <span className="kicker">{copy.kicker}</span>
        <h1>{copy.title}</h1>
        <p className="lede">{copy.subtitle}</p>
      </div>

      <div className="card stack">
        <div className="spread">
          <span className="badge badge-cyan">
            {copy.progress} {completed.length} / {JOURNEY_STAGES.length}
          </span>
          <div className="row">
            <button type="button" className="btn btn-primary btn-sm" onClick={playing ? () => setPlaying(false) : play}>
              <SparkleIcon />
              {playing ? copy.pause : copy.play}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={replay}>
              <ResetIcon />
              {copy.replay}
            </button>
          </div>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label={copy.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        {selectedMeta && selectedCopy ? (
          <div className="journey-detail">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(0)}>
              <ArrowLeftIcon />
              {copy.close}
            </button>
            <div className="journey-detail__grid">
              <Scene index={selectedIndex} label={selectedCopy.title} />
              <div className="stack">
                <span className="badge badge-cyan">
                  {selectedMeta.number} / {JOURNEY_STAGES.length}
                </span>
                <h2>{selectedCopy.title}</h2>
                <p className="small muted">{selectedCopy.sub}</p>
                <h3 className="mt-1">{copy.what}</h3>
                <p className="small">{selectedCopy.what}</p>
                <h3 className="mt-1">{copy.actors}</h3>
                <p className="small">{selectedCopy.who}</p>
                <p className="note">{selectedCopy.note}</p>
              </div>
            </div>
            <div className="spread">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={selected === 1}
                onClick={() => open(selected - 1)}
              >
                <ArrowLeftIcon />
                <span>{copy.previous}</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={selected === JOURNEY_STAGES.length}
                onClick={() => open(selected + 1)}
              >
                <span>{copy.next}</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        ) : (
          <div className="journey-board">
            {JOURNEY_STAGES.map((stage, index) => {
              const stageCopy = copy.stages[index];
              const state = completed.includes(stage.number)
                ? "done"
                : (playing && active === index) || selected === stage.number
                  ? "active"
                  : "upcoming";
              const stateLabel =
                state === "done" ? copy.done : state === "active" ? copy.active : copy.upcoming;
              return (
                <button
                  key={stage.number}
                  type="button"
                  className={`journey-card journey-card--${state}`}
                  data-state={state}
                  onClick={() => open(stage.number)}
                >
                  <span className="journey-card__top">
                    <span className="journey-card__num">
                      {String(stage.number).padStart(2, "0")}
                    </span>
                    <span className={`badge ${stage.tag === "fact" ? "badge-cyan" : "badge-coral"}`}>
                      {stage.tag === "fact" ? copy.fact : copy.simulation}
                    </span>
                  </span>
                  <Scene index={index} label={stageCopy?.title ?? ""} />
                  <strong className="journey-card__title">{stageCopy?.title}</strong>
                  <span className="journey-card__sub">{stageCopy?.sub}</span>
                  <span className="journey-card__foot">
                    <span>{stateLabel}</span>
                    {state === "done" ? (
                      <CheckIcon />
                    ) : playing && active === index ? (
                      <PixelSprite rows={CHILD} className="journey-runner" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="note">{copy.demoNote}</p>
      </div>
    </>
  );
}
