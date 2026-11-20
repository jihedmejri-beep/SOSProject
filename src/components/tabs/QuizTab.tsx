"use client";

import { useCallback, useMemo, useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import {
  ArrowRightIcon,
  CheckIcon,
  ResetIcon,
  ShieldIcon,
  SparkleIcon,
} from "@/components/icons";
import type { AnswerMode, QuizResponse } from "@/lib/api/types";
import { interpolate } from "@/lib/i18n";
import {
  QUIZ_LENGTH,
  buildQuiz,
  scoreQuiz,
  type QuizQuestion,
} from "@/lib/pap/quiz";

type Phase = "idle" | "loading" | "playing" | "results";

export function QuizTab() {
  const { t, lang, hasProfile, openOnboarding } = useExperience();
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<AnswerMode>("curated");
  const [loadError, setLoadError] = useState(false);

  const start = useCallback(async () => {
    setPhase("loading");
    setLoadError(false);
    let loaded: QuizQuestion[] = [];
    let nextMode: AnswerMode = "curated";

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang }),
      });
      if (response.ok) {
        const data = (await response.json()) as QuizResponse;
        if (
          Array.isArray(data.questions) &&
          data.questions.length === QUIZ_LENGTH &&
          data.questions.every(
            (question) =>
              Array.isArray(question.options) &&
              question.options.length === 4 &&
              Number.isInteger(question.correct),
          )
        ) {
          loaded = data.questions;
          nextMode = data.mode === "ai" ? "ai" : "curated";
        }
      }
    } catch {
      /* Falls back to the verified local bank below. */
    }

    if (loaded.length === 0) {
      loaded = buildQuiz();
      nextMode = "curated";
      setLoadError(true);
    }

    setQuestions(loaded);
    setMode(nextMode);
    setIndex(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers({});
    setPhase("playing");
  }, [lang]);

  const question = questions[index];
  const total = questions.length || QUIZ_LENGTH;
  const result = useMemo(() => scoreQuiz(answers, questions), [answers, questions]);
  const ratio = result.total > 0 ? result.score / result.total : 0;

  if (!hasProfile) {
    return (
      <>
        <div className="page-head">
          <span className="kicker">{t.quiz.kicker}</span>
          <h1>{t.quiz.title}</h1>
          <p className="lede">{t.quiz.subtitle}</p>
        </div>
        <div className="card stack" style={{ alignItems: "flex-start", maxWidth: 620 }}>
          <span className="badge badge-coral">
            <ShieldIcon />
            {t.common.demoProfile}
          </span>
          <h2 className="card-title">{t.quiz.gateTitle}</h2>
          <p className="card-body">{t.quiz.gateBody}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openOnboarding("profile")}
          >
            {t.quiz.gateCta}
          </button>
        </div>
      </>
    );
  }

  if (phase === "idle" || phase === "loading") {
    return (
      <>
        <div className="page-head">
          <span className="kicker">{t.quiz.kicker}</span>
          <h1>{t.quiz.title}</h1>
          <p className="lede">{t.quiz.subtitle}</p>
        </div>
        <div className="card stack" style={{ alignItems: "flex-start", maxWidth: 620 }}>
          <span className="badge badge-cyan">
            <SparkleIcon />
            {t.quiz.modeCurated}
          </span>
          <h2 className="card-title">{t.quiz.startTitle}</h2>
          <p className="card-body">{t.quiz.startBody}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={start}
            disabled={phase === "loading"}
          >
            {phase === "loading" ? t.quiz.generating : t.quiz.startCta}
            <ArrowRightIcon />
          </button>
        </div>
      </>
    );
  }

  if (phase === "results") {
    return (
      <>
        <div className="page-head">
          <span className="kicker">{t.quiz.kicker}</span>
          <h1>{t.quiz.resultsTitle}</h1>
          <p className="lede">
            {interpolate(t.quiz.resultsBody, {
              score: result.score,
              total: result.total,
            })}
          </p>
        </div>
        <div className="card stack center" style={{ alignItems: "center" }}>
          <div
            className="result-ring"
            style={{ ["--result" as string]: `${ratio * 100}%` }}
            role="img"
            aria-label={interpolate(t.quiz.scoreOutOf, {
              score: result.score,
              total: result.total,
            })}
          >
            <strong>
              {result.score} / {result.total}
            </strong>
          </div>
          <p className="card-body" style={{ maxWidth: 520 }}>
            {ratio >= 0.99
              ? t.quiz.verdictPerfect
              : ratio >= 0.5
                ? t.quiz.verdictGood
                : t.quiz.verdictLow}
          </p>
          <span className="badge">{mode === "ai" ? t.quiz.modeAi : t.quiz.modeCurated}</span>
          <button type="button" className="btn btn-primary" onClick={start}>
            <ResetIcon />
            {t.quiz.restart}
          </button>
        </div>
      </>
    );
  }

  if (!question) return null;

  const correct = selected === question.correct;

  const submit = () => {
    if (selected === null) return;
    setSubmitted(true);
    setAnswers((previous) => ({ ...previous, [question.id]: selected }));
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setPhase("results");
    }
  };

  return (
    <>
      <div className="page-head">
        <span className="kicker">{t.quiz.kicker}</span>
        <h1>{t.quiz.title}</h1>
        <p className="lede">{t.quiz.subtitle}</p>
      </div>

      <div className="quiz-shell">
        <div className="card stack">
          <div className="spread">
            <span className="badge badge-cyan">
              {t.quiz.level} · {t.quiz.levels[question.difficulty]}
            </span>
            <span className="small muted">
              {interpolate(t.quiz.questionOf, { current: index + 1, total })}
            </span>
          </div>

          <div
            className="progress"
            role="progressbar"
            aria-label={t.quiz.progressLabel}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index + (submitted ? 1 : 0)}
          >
            <span style={{ width: `${((index + (submitted ? 1 : 0)) / total) * 100}%` }} />
          </div>

          <h2 className="card-title mt-1">{question.question[lang]}</h2>

          <div className="quiz-options" role="group" aria-label={question.question[lang]}>
            {question.options.map((option, optionIndex) => {
              const state = submitted
                ? optionIndex === question.correct
                  ? "correct"
                  : selected === optionIndex
                    ? "wrong"
                    : undefined
                : selected === optionIndex
                  ? "selected"
                  : undefined;
              return (
                <button
                  key={`${question.id}-${optionIndex}`}
                  type="button"
                  className="quiz-option"
                  data-state={state}
                  aria-pressed={selected === optionIndex}
                  disabled={submitted}
                  onClick={() => setSelected(optionIndex)}
                >
                  <i aria-hidden="true">
                    {submitted && optionIndex === question.correct ? (
                      <CheckIcon />
                    ) : (
                      String.fromCharCode(65 + optionIndex)
                    )}
                  </i>
                  <span>{option[lang]}</span>
                </button>
              );
            })}
          </div>

          {submitted ? (
            <div className="quiz-feedback" data-correct={correct}>
              <strong>{correct ? t.quiz.correct : t.quiz.incorrect}</strong>
              <p>{question.explanation[lang]}</p>
              <div className="source-line">
                {t.quiz.source} ·{" "}
                {interpolate(t.quiz.sourcePage, { page: question.sourcePage })}
              </div>
            </div>
          ) : null}

          <div className="row">
            {!submitted ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={submit}
                disabled={selected === null}
              >
                {t.quiz.submit}
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={next}>
                {index < questions.length - 1 ? t.quiz.next : t.quiz.seeResults}
                <ArrowRightIcon />
              </button>
            )}
            <button type="button" className="btn btn-ghost btn-sm" onClick={start}>
              <ResetIcon />
              {t.quiz.restart}
            </button>
          </div>
        </div>

        <div className="stack">
          <div className="card card-tight stack">
            <span className="badge">{mode === "ai" ? t.quiz.modeAi : t.quiz.modeCurated}</span>
            {question.aiGenerated ? (
              <span className="badge badge-coral">{t.quiz.aiBadge}</span>
            ) : null}
            <div className="stat">
              <div className="stat-value">
                {result.score}
                <span className="small muted"> / {total}</span>
              </div>
              <div className="stat-label">{t.quiz.score}</div>
            </div>
            <p className="tiny muted">{t.quiz.chooseAnswer}</p>
          </div>
          {loadError ? (
            <div className="callout">
              <span className="callout-icon" aria-hidden="true">
                <SparkleIcon />
              </span>
              <p>{t.quiz.loadingError}</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
