"use client";

import { useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { useReducedMotion } from "@/components/useReducedMotion";
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  ResetIcon,
  ShieldIcon,
  SparkleIcon,
} from "@/components/icons";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import { HOUSE } from "@/components/pixel/sprites";
import { interpolate } from "@/lib/i18n";

type Decision = "idle" | "confirmed" | "cancelled";

const SENT_AT = "10:24";
const ANSWERED_AT = "10:26";

export function ConfirmationSim() {
  const { t, profile } = useExperience();
  const reduced = useReducedMotion();
  const copy = t.quickSim;
  const [decision, setDecision] = useState<Decision>("idle");

  const name = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : copy.guestName;
  const message = interpolate(copy.messageBody, { name });
  const answered = decision !== "idle";

  const goToJourney = () => {
    document.getElementById("pap-journey")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="pap-confirm">
      <div className="pap-confirm__visual">
        <div
          className="confirm-phone"
          role="group"
          aria-label={copy.phoneLabel}
        >
          <span className="confirm-phone__notch" aria-hidden="true" />
          <div className="confirm-phone__status" aria-hidden="true">
            <span>9:41</span>
            <span>
              <ShieldIcon />
              SMS
            </span>
          </div>

          <div className="confirm-phone__head">
            <span className="confirm-avatar" aria-hidden="true">
              <PixelSprite rows={HOUSE} />
            </span>
            <span className="confirm-phone__identity">
              <strong>{copy.sender}</strong>
              <small>
                <ShieldIcon />
                {t.common.simulation}
              </small>
            </span>
            <InfoIcon className="confirm-phone__info" aria-hidden="true" />
          </div>

          <div className="confirm-chat" aria-live="polite">
            <span className="confirm-chat__day">{copy.today}</span>

            <div className="confirm-bubble confirm-bubble--in">
              <span className="confirm-bubble__sender">{copy.sender}</span>
              <p className="confirm-text">{message}</p>
              <span className="confirm-meta">
                {SENT_AT}
                <CheckIcon />
                <CheckIcon />
              </span>
            </div>

            {answered && (
              <div className="confirm-bubble confirm-bubble--out quick-pop">
                <p className="confirm-text">
                  {decision === "confirmed" ? copy.confirm : copy.cancel}
                </p>
                <span className="confirm-meta">{ANSWERED_AT}</span>
              </div>
            )}

            <span className="confirm-label">
              <SparkleIcon />
              {copy.fictional}
            </span>
          </div>

          <span className="confirm-phone__home" aria-hidden="true" />
        </div>
      </div>

      <div className="confirm-decision">
        <span className="kicker">{copy.decisionKicker}</span>

        {decision === "idle" ? (
          <>
            <div className="stack" style={{ gap: 6 }}>
              <h3>{copy.question}</h3>
              <p className="confirm-decision__hint">{copy.questionHint}</p>
            </div>

            <div className="confirm-choice-grid">
              <button
                type="button"
                className="confirm-choice confirm-choice--yes"
                onClick={() => setDecision("confirmed")}
              >
                <span className="confirm-choice__icon" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span className="confirm-choice__label">{copy.confirm}</span>
                <span className="confirm-choice__hint">{copy.confirmHint}</span>
              </button>

              <button
                type="button"
                className="confirm-choice confirm-choice--no"
                onClick={() => setDecision("cancelled")}
              >
                <span className="confirm-choice__icon" aria-hidden="true">
                  <CloseIcon />
                </span>
                <span className="confirm-choice__label">{copy.cancel}</span>
                <span className="confirm-choice__hint">{copy.cancelHint}</span>
              </button>
            </div>
          </>
        ) : (
          <div
            className={`confirm-result confirm-result--${
              decision === "confirmed" ? "success" : "danger"
            }`}
            role="status"
          >
            <span className="confirm-result__icon" aria-hidden="true">
              {decision === "confirmed" ? <CheckIcon /> : <CloseIcon />}
            </span>
            <div>
              <h3>
                {decision === "confirmed"
                  ? copy.confirmedTitle
                  : copy.cancelledTitle}
              </h3>
              <p>
                {decision === "confirmed"
                  ? copy.confirmedBody
                  : copy.cancelledBody}
              </p>
            </div>
          </div>
        )}

        {answered && (
          <div className="row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setDecision("idle")}
            >
              <ResetIcon />
              {copy.reopen}
            </button>
            {decision === "confirmed" && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={goToJourney}
              >
                {copy.continue}
                <ArrowRightIcon />
              </button>
            )}
          </div>
        )}

        <p className="confirm-note">
          <InfoIcon />
          <span>{copy.note}</span>
        </p>
      </div>
    </div>
  );
}
