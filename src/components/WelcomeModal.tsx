"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CloseIcon } from "@/components/icons";
import {
  useExperience,
  type OnboardingMode,
  type Profile,
} from "@/components/experience/ExperienceProvider";
import {
  validateProfile,
  type FieldErrorCode,
  type ProfileErrors,
} from "@/lib/pap/validation";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function WelcomeModal() {
  const {
    onboardingOpen,
    onboardingMode,
    closeOnboarding,
    completeProfile,
    continueAsGuest,
    t,
  } = useExperience();

  const [mode, setMode] = useState<OnboardingMode>(onboardingMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [created, setCreated] = useState<Profile | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!onboardingOpen) return;
    setMode(onboardingMode);
    setCreated(null);
    setErrors({});
  }, [onboardingOpen, onboardingMode]);

  useEffect(() => {
    if (!onboardingOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      if (mode === "profile") firstFieldRef.current?.focus();
      else dialogRef.current?.focus();
    }, 60);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [onboardingOpen, mode]);

  const saveAndClose = () => {
    if (created) {
      completeProfile(created);
    } else {
      closeOnboarding();
    }
  };

  useEffect(() => {
    if (!onboardingOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        saveAndClose();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  if (!onboardingOpen) return null;

  const messageFor = (field: "firstName" | "lastName" | "phone", code?: FieldErrorCode) => {
    if (!code) return null;
    if (field === "phone") {
      return code === "required"
        ? t.welcome.errors.phoneRequired
        : t.welcome.errors.phoneInvalid;
    }
    if (code === "required") {
      return field === "firstName"
        ? t.welcome.errors.firstNameRequired
        : t.welcome.errors.lastNameRequired;
    }
    return field === "firstName"
      ? t.welcome.errors.firstNameShort
      : t.welcome.errors.lastNameShort;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateProfile({ firstName, lastName, phone });
    setErrors(result.errors);
    if (result.ok && result.value) {
      setCreated(result.value);
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) saveAndClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-subtitle"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="modal-close"
          onClick={saveAndClose}
          aria-label={t.a11y.closeDialog}
        >
          <CloseIcon />
        </button>

        {created ? (
          <div className="modal-success">
            <span className="success-mark" aria-hidden="true">
              <CheckIcon />
            </span>
            <h2 id="welcome-title">{t.welcome.profileCreatedTitle}</h2>
            <p className="sub" id="welcome-subtitle">
              {t.welcome.profileCreatedBody.replace(
                "{name}",
                `${created.firstName} ${created.lastName}`,
              )}
            </p>
            <p className="modal-note">{t.welcome.profileNote}</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={saveAndClose}>
                {t.welcome.startExploring}
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="badge badge-cyan">{t.welcome.badge}</span>
            <h2 id="welcome-title">{t.welcome.title}</h2>
            <p className="sub" id="welcome-subtitle">
              {t.welcome.subtitle}
            </p>

            <div className="modal-tabs" role="tablist" aria-label={t.welcome.dialogLabel}>
              <button
                type="button"
                role="tab"
                id="tab-profile"
                aria-selected={mode === "profile"}
                aria-controls="panel-profile"
                className="modal-tab"
                onClick={() => setMode("profile")}
              >
                {t.welcome.profileTab}
              </button>
              <button
                type="button"
                role="tab"
                id="tab-guest"
                aria-selected={mode === "guest"}
                aria-controls="panel-guest"
                className="modal-tab"
                onClick={() => setMode("guest")}
              >
                {t.welcome.guestTab}
              </button>
            </div>

            {mode === "profile" ? (
              <form
                className="modal-form"
                id="panel-profile"
                role="tabpanel"
                aria-labelledby="tab-profile"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="grid-2">
                  <div className="field">
                    <label htmlFor="welcome-first">{t.welcome.firstName}</label>
                    <input
                      ref={firstFieldRef}
                      id="welcome-first"
                      className="input"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder={t.welcome.firstNamePlaceholder}
                      autoComplete="off"
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? "err-first" : undefined}
                    />
                    {errors.firstName ? (
                      <span className="error" id="err-first">
                        {messageFor("firstName", errors.firstName)}
                      </span>
                    ) : null}
                  </div>
                  <div className="field">
                    <label htmlFor="welcome-last">{t.welcome.lastName}</label>
                    <input
                      id="welcome-last"
                      className="input"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder={t.welcome.lastNamePlaceholder}
                      autoComplete="off"
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby={errors.lastName ? "err-last" : undefined}
                    />
                    {errors.lastName ? (
                      <span className="error" id="err-last">
                        {messageFor("lastName", errors.lastName)}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="welcome-phone">{t.welcome.phone}</label>
                  <input
                    id="welcome-phone"
                    className="input"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={t.welcome.phonePlaceholder}
                    autoComplete="off"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "err-phone" : "hint-phone"}
                  />
                  {errors.phone ? (
                    <span className="error" id="err-phone">
                      {messageFor("phone", errors.phone)}
                    </span>
                  ) : (
                    <span className="hint" id="hint-phone">
                      {t.welcome.phoneHint}
                    </span>
                  )}
                </div>
                <p className="modal-note">{t.welcome.profileNote}</p>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {t.welcome.createProfile}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={continueAsGuest}
                  >
                    {t.welcome.continueGuest}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className="stack"
                id="panel-guest"
                role="tabpanel"
                aria-labelledby="tab-guest"
              >
                <p className="modal-note">{t.welcome.guestNote}</p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={continueAsGuest}
                  >
                    {t.welcome.continueGuest}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
