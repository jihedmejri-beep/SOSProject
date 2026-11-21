/* ------------------------------------------------------------------
   TS port of the six stylesheets of the static app. The CSS text is
   identical to the original files; only document-level selectors are
   mapped to the scoped DOM wrappers (:root/html -> .pap-root,
   body -> .pap-app) so the styles stay inside the component.
   ------------------------------------------------------------------ */

export const stylesBase = `/* ============================================================
   Base: tokens, reset, layout, header, nav, footer, controls
   ============================================================ */
.pap-root {
  --cyan: #08A9E0;
  --navy: #1D3768;
  --coral: #E2556A;
  --pale: #EFFAFF;
  --light: #CFEAF5;
  --white: #FFFFFF;

  --line: rgba(29, 55, 104, 0.16);
  --line-strong: rgba(29, 55, 104, 0.34);
  --ink-soft: rgba(29, 55, 104, 0.72);
  --ink-faint: rgba(29, 55, 104, 0.55);
  --cyan-soft: rgba(8, 169, 224, 0.12);
  --coral-soft: rgba(226, 85, 106, 0.12);
  --shadow: 0 8px 0 rgba(29, 55, 104, 0.08);
  --shadow-soft: 0 14px 34px rgba(29, 55, 104, 0.08);
  --radius: 18px;
  --radius-sm: 12px;
  --font-.pap-app: "Nunito", "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-pixel: "Press Start 2P", "Courier New", monospace;
  --max: 1320px;
}

* { box-sizing: border-box; }

.pap-root { scroll-behavior: smooth; }

.pap-app {
  margin: 0;
  font-family: var(--font-.pap-app);
  color: var(--navy);
  background-color: var(--pale);
  background-image: radial-gradient(rgba(29, 55, 104, 0.09) 1px, transparent 1px);
  background-size: 24px 24px;
  line-height: 1.55;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

h1, h2, h3, h4, p, ul, ol, dl, dd, figure { margin: 0; }
ul, ol { padding: 0; list-style: none; }
button, input, select, textarea { font: inherit; color: inherit; }
button { background: none; border: 0; }
a { color: inherit; }
img, svg { max-width: 100%; }
code { font-family: ui-monospace, "Cascadia Mono", monospace; font-size: 0.95em; }

:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 3px;
  border-radius: 8px;
}

.skip-link {
  position: absolute;
  inset-inline-start: 12px;
  top: -80px;
  z-index: 200;
  background: var(--white);
  border: 2px solid var(--navy);
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 800;
  transition: top 0.18s ease;
}
.skip-link:focus { top: 12px; }

.sr-only {
  position: absolute;
  left: 0; top: 0;
  width: 1px; height: 1px;
  padding: 0; margin: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* donor type switch */
.seg {
  display: inline-flex;
  padding: 4px;
  gap: 4px;
  background: var(--pale);
  border: 1px solid var(--line);
  border-radius: 14px;
}
.seg__btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px 5px 6px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--ink-soft);
  cursor: pointer;
  border: 1px solid transparent;
}
.seg__btn:hover { background: var(--white); }
.seg__btn.is-on {
  background: var(--white);
  color: var(--navy);
  border-color: var(--cyan);
  box-shadow: 0 2px 0 rgba(8, 169, 224, 0.25);
}
.seg__art { width: 24px; height: 28px; display: block; }
.seg__art .pix { width: 100%; height: 100%; }

.lang {
  display: inline-flex;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  background: var(--white);
}
.lang__btn {
  padding: 6px 9px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  cursor: pointer;
}
.lang__btn + .lang__btn { border-inline-start: 1px solid var(--line); }
.lang__btn.is-on { background: var(--navy); color: var(--white); }

.icon-btn {
  display: inline-grid;
  place-items: center;
  width: 40px; height: 40px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--white);
  color: var(--navy);
  cursor: pointer;
  position: relative;
}
.icon-btn:hover { border-color: var(--cyan); color: var(--cyan); }
.bell__badge {
  position: absolute;
  top: -6px; inset-inline-end: -6px;
  min-width: 20px; height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--coral);
  color: var(--white);
  font-size: 0.68rem;
  font-weight: 800;
  display: grid;
  place-items: center;
  border: 2px solid var(--white);
}

/* ---------- nav ---------- */
.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(6px);
  border-bottom: 2px solid rgba(29, 55, 104, 0.12);
}
.nav__inner {
  max-width: var(--max);
  margin: 0 auto;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--light) transparent;
}
.nav__inner::-webkit-scrollbar { height: 6px; }
.nav__inner::-webkit-scrollbar-thumb { background: var(--light); border-radius: 99px; }
.nav__btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--ink-soft);
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
}
.nav__btn:hover { background: var(--pale); color: var(--navy); }
.nav__btn.is-active {
  background: var(--navy);
  color: var(--white);
}
.nav__btn--stage { padding-inline-start: 7px; }
.nav__num {
  display: grid;
  place-items: center;
  width: 21px; height: 21px;
  border-radius: 7px;
  background: var(--pale);
  color: var(--navy);
  font-size: 0.68rem;
  font-weight: 900;
}
.nav__btn.is-active .nav__num { background: var(--cyan); color: var(--white); }
.nav__stage-title {
  max-width: 138px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav__badge {
  font-style: normal;
  background: var(--coral);
  color: var(--white);
  border-radius: 999px;
  padding: 0 5px;
  font-size: 0.64rem;
}
.nav__done { color: var(--cyan); display: inline-flex; }
.nav__btn.is-active .nav__done { color: var(--white); }
.nav__sep {
  width: 1px;
  align-self: stretch;
  background: var(--line);
  margin: 2px 4px;
  flex: none;
}

/* ---------- layout ---------- */
.main {
  flex: 1;
  width: 100%;
  max-width: var(--max);
  margin: 0 auto;
  padding: 30px 22px 56px;
  outline: none;
}
.screen { animation: screen-in 0.28s ease both; }
@keyframes screen-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
.screen-head { margin-bottom: 24px; max-width: 880px; }
.screen-head h1 { font-size: clamp(1.9rem, 3.6vw, 2.7rem); line-height: 1.12; margin: 6px 0 10px; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.lead { font-size: 1.06rem; color: var(--ink-soft); max-width: 72ch; }
.muted { color: var(--ink-soft); font-size: 0.9rem; }
.hint { font-size: 0.82rem; color: var(--ink-faint); }
.row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.row-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 14px; }
.stack { display: flex; flex-direction: column; gap: 16px; }
.stack--tight { gap: 8px; }

/* ---------- buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 2px solid transparent;
  font-weight: 800;
  font-size: 0.94rem;
  line-height: 1.2;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
}
.btn .ico { flex: none; }
.btn--primary {
  background: var(--cyan);
  color: var(--white);
  border-color: var(--navy);
  box-shadow: 0 4px 0 rgba(29, 55, 104, 0.24);
}
.btn--primary:hover { transform: translateY(-1px); box-shadow: 0 6px 0 rgba(29, 55, 104, 0.24); }
.btn--primary:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(29, 55, 104, 0.24); }
.btn--ghost {
  background: var(--white);
  color: var(--navy);
  border-color: rgba(29, 55, 104, 0.26);
}
.btn--ghost:hover { border-color: var(--cyan); background: var(--pale); }
.btn--quiet {
  background: transparent;
  color: var(--navy);
  border-color: transparent;
  padding-inline: 8px;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
  text-decoration-color: rgba(29, 55, 104, 0.25);
}
.btn--quiet:hover { text-decoration-color: var(--cyan); color: var(--cyan); }
.btn--danger {
  background: var(--coral);
  color: var(--white);
  border-color: var(--navy);
  box-shadow: 0 4px 0 rgba(29, 55, 104, 0.24);
}
.btn--danger:hover { transform: translateY(-1px); }
.btn--lg { padding: 14px 22px; font-size: 1.04rem; border-radius: 14px; }
.btn--sm { padding: 7px 11px; font-size: 0.82rem; border-radius: 10px; }
.btn--wide { width: 100%; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none; }
.btn.is-loading { pointer-events: none; }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ---------- badges / panels ---------- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  border: 1px solid var(--line-strong);
  white-space: nowrap;
}
.badge--fact { background: var(--cyan-soft); border-color: rgba(8, 169, 224, 0.5); color: var(--navy); }
.badge--sim { background: var(--coral-soft); border-color: rgba(226, 85, 106, 0.42); color: var(--navy); }
.badge--soft { background: var(--white); color: var(--ink-soft); }

.panel {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 20px 22px;
  box-shadow: var(--shadow-soft);
}
.panel__title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 1.02rem;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.panel__title .badge { margin-inline-start: auto; }
.panel__title--spaced { margin-top: 22px; }
.panel__subtitle { display: flex; gap: 8px; align-items: center; margin: 18px 0 6px; font-size: 0.96rem; }
.panel--note { border-width: 2px; }
.panel--fact { border-color: rgba(8, 169, 224, 0.45); background: linear-gradient(180deg, rgba(239, 250, 255, 0.9), var(--white)); }
.panel--sim { border-color: rgba(226, 85, 106, 0.32); background: linear-gradient(180deg, rgba(226, 85, 106, 0.05), var(--white)); }
.note {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.86rem;
  border: 1px solid var(--line);
  background: var(--pale);
  color: var(--ink-soft);
}
.note .ico { flex: none; margin-top: 2px; color: var(--navy); }
.note--fact { background: var(--cyan-soft); border-color: rgba(8, 169, 224, 0.35); color: var(--navy); }
.note--warn { background: var(--coral-soft); border-color: rgba(226, 85, 106, 0.4); color: var(--navy); }
.note--soft { background: var(--white); }
.role-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 10px; }
.role-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 5px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--pale);
  font-size: 0.78rem;
  font-weight: 700;
}
.role-chip__art { width: 22px; height: 22px; display: block; }
.tick-list { display: flex; flex-direction: column; gap: 8px; }
.tick-list li { display: flex; gap: 9px; align-items: flex-start; font-size: 0.9rem; color: var(--ink-soft); }
.tick-list .ico { color: var(--cyan); flex: none; margin-top: 3px; }
.tick-list--two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 22px; }

/* ---------- progress / kv / status ---------- */
.bar {
  height: 12px;
  border-radius: 999px;
  background: var(--light);
  overflow: hidden;
  border: 1px solid rgba(29, 55, 104, 0.1);
}
.bar > span {
  display: block;
  height: 100%;
  width: 0;
  background: repeating-linear-gradient(90deg, var(--cyan) 0 10px, rgba(8, 169, 224, 0.82) 10px 20px);
  border-radius: 999px;
  transition: width 0.6s ease;
}
.bar--thin { height: 8px; }
.bar--thick { height: 14px; }

.kv { display: grid; gap: 0; }
.kv > div {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 9px 0;
  border-bottom: 1px dashed var(--line);
}
.kv > div:last-child { border-bottom: 0; }
.kv dt { font-size: 0.82rem; color: var(--ink-faint); font-weight: 700; }
.kv dd { font-weight: 800; text-align: end; }
.kv--big dd { font-size: 1.1rem; }
.kv--inline { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.kv--inline > span { display: inline-flex; align-items: center; gap: 6px; font-size: 0.86rem; }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
  border: 1px solid var(--line-strong);
  background: var(--white);
  white-space: nowrap;
}
.status-pill.is-on { border-color: var(--cyan); background: var(--cyan-soft); }
.status-pill.is-wait { border-color: rgba(29, 55, 104, 0.28); background: var(--pale); color: var(--ink-soft); }
.status-pill.is-off { border-color: var(--coral); background: var(--coral-soft); }

.result-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid var(--line);
  background: var(--white);
  margin-top: 14px;
}
.result-card__icon {
  width: 44px; height: 44px;
  flex: none;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--cyan);
  color: var(--white);
}
.result-card h3 { font-size: 1rem; margin-bottom: 3px; }
.result-card p { font-size: 0.88rem; color: var(--ink-soft); }
.result-card--success { border-color: rgba(8, 169, 224, 0.5); background: var(--cyan-soft); }
.result-card--danger { border-color: rgba(226, 85, 106, 0.5); background: var(--coral-soft); }
.result-card--danger .result-card__icon { background: var(--coral); }

/* ---------- form basics ---------- */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 18px; }
.field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.field label { font-size: 0.82rem; font-weight: 800; display: flex; gap: 4px; }
.req { color: var(--coral); }
.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid var(--line);
  border-radius: 10px;
  background: var(--white);
  font-size: 0.94rem;
  font-weight: 600;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.field input:hover, .field select:hover { border-color: var(--line-strong); }
.field input:focus, .field select:focus, .field textarea:focus {
  outline: none;
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(8, 169, 224, 0.18);
}
.field.is-invalid input,
.field.is-invalid select { border-color: var(--coral); background: rgba(226, 85, 106, 0.05); }
.field__error { font-size: 0.78rem; color: var(--coral); font-weight: 700; min-height: 0; }
.field__error:empty { display: none; }
.input-suffix { display: flex; align-items: stretch; }
.input-suffix input { border-start-end-radius: 0; border-end-end-radius: 0; }
.input-suffix > span {
  display: grid;
  place-items: center;
  padding: 0 12px;
  font-size: 0.8rem;
  font-weight: 800;
  background: var(--pale);
  border: 2px solid var(--line);
  border-inline-start: 0;
  border-start-end-radius: 10px;
  border-end-end-radius: 10px;
}
.input-action { display: flex; gap: 8px; align-items: stretch; }
.input-action input { flex: 1; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 7px; }
.chip {
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: var(--white);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
}
.chip:hover { border-color: var(--cyan); }
.chip.is-on { background: var(--cyan); color: var(--white); border-color: var(--navy); }
.amount-row { display: flex; flex-direction: column; }

.check {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--pale);
  font-size: 0.88rem;
  cursor: pointer;
}
.check input {
  width: 20px; height: 20px;
  margin: 1px 0 0;
  accent-color: var(--cyan);
  flex: none;
  cursor: pointer;
}

/* ---------- dialog ---------- */
.pap-dialog {
  border: 0;
  padding: 0;
  background: transparent;
  max-width: min(640px, calc(100vw - 28px));
  width: 100%;
  color: var(--navy);
}
.pap-dialog--wide { max-width: min(980px, calc(100vw - 28px)); }
.pap-dialog::backdrop { background: rgba(29, 55, 104, 0.45); backdrop-filter: blur(2px); }
.dialog-card {
  background: var(--white);
  border: 2px solid var(--navy);
  border-radius: 20px;
  box-shadow: 0 18px 0 rgba(29, 55, 104, 0.18);
  overflow: hidden;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}
.dialog-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 22px 12px;
  border-bottom: 1px solid var(--line);
}
.dialog-title { font-size: 1.3rem; margin-top: 3px; }
.dialog-.pap-app { padding: 18px 22px; overflow: auto; }
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 22px 18px;
  border-top: 1px solid var(--line);
  background: var(--pale);
}
.dialog-x { flex: none; }

/* ---------- toasts ---------- */
.toast-root {
  position: fixed;
  inset-inline-end: 18px;
  bottom: 18px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(390px, calc(100vw - 36px));
}
.toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 12px 12px 13px;
  background: var(--white);
  border: 2px solid var(--navy);
  border-radius: 14px;
  box-shadow: 0 6px 0 rgba(29, 55, 104, 0.16);
  animation: toast-in 0.25s ease both;
}
.toast.is-leaving { animation: toast-out 0.22s ease both; }
.toast--success { border-color: var(--cyan); }
.toast--error { border-color: var(--coral); }
.toast__icon {
  width: 28px; height: 28px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--pale);
  flex: none;
  color: var(--navy);
}
.toast--success .toast__icon { background: var(--cyan); color: var(--white); }
.toast--error .toast__icon { background: var(--coral); color: var(--white); }
.toast__text { font-size: 0.86rem; font-weight: 700; line-height: 1.4; }
.toast__close { margin-inline-start: auto; cursor: pointer; color: var(--ink-faint); display: grid; place-items: center; }
@keyframes toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes toast-out { to { opacity: 0; transform: translateY(6px); } }

/* ---------- footer ---------- */
.footer {
  background: var(--navy);
  color: var(--white);
  margin-top: auto;
}
.footer__inner {
  max-width: var(--max);
  margin: 0 auto;
  padding: 26px 22px 34px;
  display: grid;
  gap: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.82);
}
.footer__inner p { display: flex; gap: 8px; align-items: flex-start; }
.footer__inner .ico { flex: none; margin-top: 2px; color: var(--light); }
.footer__brand { align-items: center; font-size: 0.86rem; color: var(--white); }
.footer__brand .pix { width: 28px; height: 28px; }

.empty-state {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed var(--line-strong);
  color: var(--ink-faint);
  font-size: 0.9rem;
}`;

export const stylesMap = `/* ============================================================
   Pixel-art map, scene illustrations, level cards, detail card
   ============================================================ */

/* ---------- map header ---------- */
.map-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.map-head h1 {
  font-size: clamp(2rem, 4.2vw, 3.1rem);
  line-height: 1.04;
  margin: 6px 0 10px;
  letter-spacing: -0.02em;
}
.map-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.map-progress {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 13px 17px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-soft);
  max-width: 620px;
}
.map-progress__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 8px;
}
.map-progress__label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.map-progress__top strong { font-size: 0.98rem; }
.map-progress__hint {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 9px;
  font-size: 0.8rem;
  color: var(--ink-faint);
}
.map-progress__hint .ico { color: var(--coral); }

/* ---------- board ---------- */
.board-wrap {
  border: 2px solid var(--navy);
  border-radius: 24px;
  background: var(--white);
  padding: 14px;
  box-shadow: 8px 9px 0 rgba(29, 55, 104, 0.1);
}
.board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 46px 16px;
  padding: 38px 26px 52px;
  border-radius: 16px;
  background-color: var(--pale);
  background-image:
    radial-gradient(rgba(29, 55, 104, 0.1) 1px, transparent 1px),
    linear-gradient(180deg, rgba(8, 169, 224, 0.06), transparent 42%);
  background-size: 20px 20px, 100% 100%;
  overflow: hidden;
  isolation: isolate;
}

/* serpentine: top row 1→5, bottom row 6→10 right-to-left */
.board .level { grid-row: 1; }
.board .level[data-level="1"] { grid-column: 1; }
.board .level[data-level="2"] { grid-column: 2; }
.board .level[data-level="3"] { grid-column: 3; }
.board .level[data-level="4"] { grid-column: 4; }
.board .level[data-level="5"] { grid-column: 5; }
.board .level[data-level="6"] { grid-column: 5; grid-row: 2; }
.board .level[data-level="7"] { grid-column: 4; grid-row: 2; }
.board .level[data-level="8"] { grid-column: 3; grid-row: 2; }
.board .level[data-level="9"] { grid-column: 2; grid-row: 2; }
.board .level[data-level="10"] { grid-column: 1; grid-row: 2; }

.board__route {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}
.route-path {
  stroke: var(--navy);
  stroke-opacity: 0.26;
  stroke-width: 7;
  stroke-linecap: round;
  stroke-dasharray: 0.5 15;
}
.board.is-playing .route-path { animation: route-move 1.1s linear infinite; }
@keyframes route-move { to { stroke-dashoffset: -31; } }
.route-arrow { fill: var(--cyan); opacity: 0.9; }

.board__avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 46px;
  height: 56px;
  z-index: 6;
  opacity: 0;
  pointer-events: none;
  will-change: transform;
  filter: drop-shadow(0 3px 0 rgba(29, 55, 104, 0.16));
}
.board__avatar .pix { width: 100%; height: 100%; animation: avatar-idle 2.6s ease-in-out infinite; }
.board__avatar::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 26px;
  height: 7px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(29, 55, 104, 0.16);
}
@keyframes avatar-idle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.board.is-playing .board__avatar .pix { animation: avatar-walk 0.42s steps(2, end) infinite; }
@keyframes avatar-walk {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-5px) rotate(3deg); }
}

.board__edge {
  position: absolute;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--white);
  border: 1px solid var(--line-strong);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-soft);
  pointer-events: none;
  white-space: nowrap;
}
#routeStart { color: var(--cyan); border-color: rgba(8, 169, 224, 0.5); }
#routeEnd { color: var(--coral); border-color: rgba(226, 85, 106, 0.45); }

/* ---------- level cards ---------- */
.level {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  text-align: start;
  padding: 9px 9px 10px;
  background: var(--white);
  border: 2px solid rgba(29, 55, 104, 0.22);
  border-radius: 15px;
  box-shadow: 3px 4px 0 rgba(29, 55, 104, 0.09);
  cursor: pointer;
  transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}
.level::before {
  content: "";
  position: absolute;
  inset-inline: 16px;
  top: -2px;
  height: 4px;
  border-radius: 0 0 5px 5px;
  background: var(--cyan);
}
.level--sim::before { background: var(--coral); }
.level:hover {
  transform: translateY(-4px);
  border-color: var(--cyan);
  box-shadow: 4px 9px 0 rgba(29, 55, 104, 0.13);
}
.level:hover .level__open { background: var(--cyan); color: var(--white); border-color: var(--navy); }
.level:active { transform: translateY(0); box-shadow: 2px 2px 0 rgba(29, 55, 104, 0.12); }
.level.is-travel {
  border-color: var(--coral);
  box-shadow: 0 0 0 4px rgba(226, 85, 106, 0.18), 4px 8px 0 rgba(29, 55, 104, 0.12);
}

.level__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 6px;
}
.level__num {
  font-family: var(--font-pixel);
  font-size: 0.66rem;
  color: var(--navy);
  letter-spacing: 0.02em;
}
.level__state {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  white-space: nowrap;
  border: 1px solid transparent;
}
.state--done { background: var(--cyan-soft); color: var(--navy); border-color: rgba(8, 169, 224, 0.4); }
.state--active { background: var(--coral); color: var(--white); }
.state--upcoming { background: var(--pale); color: var(--ink-faint); border-color: var(--line); }

.level__scene { display: block; margin-bottom: 8px; }
.level__scene .scene { aspect-ratio: 4 / 3; }
.level__body { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.level__title {
  font-size: 0.9rem;
  font-weight: 900;
  line-height: 1.2;
  color: var(--navy);
}
.level__sub {
  font-size: 0.73rem;
  line-height: 1.35;
  color: var(--ink-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.level__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 7px;
}
.mini-roles { display: flex; gap: 2px; flex-wrap: wrap; }
.mini-role {
  width: 22px;
  height: 22px;
  display: block;
  padding: 2px;
  border-radius: 6px;
  background: var(--pale);
  border: 1px solid var(--line);
}
.mini-role .pix { width: 100%; height: 100%; }
.level__open {
  width: 26px;
  height: 26px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid var(--line-strong);
  color: var(--navy);
  background: var(--white);
  transition: background 0.15s ease, color 0.15s ease;
}

/* ---------- map foot ---------- */
.map-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 22px;
  margin-top: 18px;
  padding: 12px 16px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 14px;
}
.legend { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
.legend__title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
}
.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--ink-soft);
}
.legend__item.state--done,
.legend__item.state--active,
.legend__item.state--upcoming {
  background: none;
  border: 0;
  padding: 0;
  color: var(--ink-soft);
}
.legend__item.state--done .ico { color: var(--cyan); }
.legend__item.state--active .ico { color: var(--coral); }
.legend__sep { width: 1px; align-self: stretch; background: var(--line); }
.map-foot__note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--ink-faint);
}
.map-foot__note .ico { color: var(--navy); flex: none; }
.map-foot__note--soft { font-style: italic; }

/* ---------- scene illustrations ---------- */
.scene {
  position: relative;
  aspect-ratio: 28 / 21;
  border-radius: 10px;
  border: 1px solid var(--line);
  background:
    radial-gradient(rgba(29, 55, 104, 0.08) 1px, transparent 1px) 0 0 / 14px 14px,
    linear-gradient(180deg, var(--pale), var(--light));
  overflow: hidden;
}
.scene-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  padding: 3%;
}
.scene-part {
  position: absolute;
  z-index: 2;
  display: block;
  pointer-events: none;
}
.scene-part .pix { width: 100%; height: auto; display: block; }
.scene__tag {
  position: absolute;
  z-index: 3;
  inset-inline-end: 5px;
  bottom: 5px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--line);
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.scene__tag .ico { color: var(--coral); }
.scene--stage { aspect-ratio: 28 / 21; }
.scene--detail { aspect-ratio: 28 / 21; }
.scene--hero { aspect-ratio: 4 / 3; box-shadow: 6px 7px 0 rgba(29, 55, 104, 0.12); border: 2px solid var(--navy); }

/* scene part animations */
.anim-pen { animation: anim-write 2.8s ease-in-out infinite; transform-origin: 12% 88%; }
@keyframes anim-write {
  0%, 100% { transform: rotate(-7deg) translateY(0); }
  45% { transform: rotate(7deg) translateY(-5%); }
}
.anim-check { animation: anim-pop 2.6s ease-in-out infinite; }
@keyframes anim-pop {
  0%, 12%, 100% { transform: scale(0.55); opacity: 0.35; }
  35%, 78% { transform: scale(1); opacity: 1; }
}
.anim-token { animation: anim-token 2.6s ease-in-out infinite; }
@keyframes anim-token {
  0%, 100% { transform: translate(-16%, 8%) scale(0.9); }
  50% { transform: translate(16%, -8%) scale(1.08); }
}
.anim-coin-drop { animation: anim-drop 2.8s cubic-bezier(0.5, 0, 0.7, 1) infinite; }
@keyframes anim-drop {
  0% { transform: translateY(-120%); opacity: 0; }
  35% { opacity: 1; }
  70%, 100% { transform: translateY(40%); opacity: 0.9; }
}
.anim-bell { animation: anim-ring 2.4s ease-in-out infinite; transform-origin: 50% 10%; }
@keyframes anim-ring {
  0%, 60%, 100% { transform: rotate(0); }
  66% { transform: rotate(13deg); }
  72% { transform: rotate(-11deg); }
  78% { transform: rotate(8deg); }
  84% { transform: rotate(-5deg); }
}
.anim-gear { animation: anim-turn 7s linear infinite; }
@keyframes anim-turn { to { transform: rotate(360deg); } }
.anim-flag { animation: anim-wave 2.6s ease-in-out infinite; transform-origin: 0 50%; }
@keyframes anim-wave {
  0%, 100% { transform: skewY(0) scaleX(1); }
  50% { transform: skewY(-4deg) scaleX(0.93); }
}

/* ---------- level detail card ---------- */
.detail { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 22px; }
.detail__visual { display: flex; flex-direction: column; gap: 12px; }
.detail__avatar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 8px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--pale);
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--ink-soft);
}
.detail__avatar .pix { width: 34px; height: 42px; flex: none; }
.detail__info { min-width: 0; }
.detail__meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.step-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--navy);
  color: var(--white);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.detail__title { font-size: 1.5rem; line-height: 1.15; margin-bottom: 5px; }
.detail__sub { font-size: 0.92rem; color: var(--ink-soft); margin-bottom: 16px; }
.detail__block { padding: 12px 0; border-top: 1px dashed var(--line); }
.detail__block h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin-bottom: 6px;
}
.detail__block h4 .ico { color: var(--cyan); }
.detail__block p { font-size: 0.9rem; }
.detail__flow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 0; border-top: 1px dashed var(--line); }
.detail__flow p { font-size: 0.84rem; color: var(--ink-soft); margin-top: 5px; }
.flow-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.64rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 2px 7px;
  border-radius: 999px;
}
.flow-label--out { background: var(--cyan-soft); color: var(--navy); }
.flow-label--in { background: var(--coral-soft); color: var(--navy); }
.detail__note {
  margin-top: 12px;
  padding: 11px 13px;
  border-radius: 10px;
  background: var(--pale);
  border: 1px solid var(--line);
  font-size: 0.82rem;
  color: var(--ink-soft);
}

@media (max-width: 760px) {
  .detail { grid-template-columns: 1fr; }
  .detail__visual { max-width: 360px; }
  .detail__flow { grid-template-columns: 1fr; }
}
`;

export const stylesStages = `/* ============================================================
   Stage shell + steps 1 to 4
   ============================================================ */

/* ---------- stage shell ---------- */
.screen--stage { display: flex; flex-direction: column; gap: 20px; }
.stage-head {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}
.stage-head__bar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 10px 16px;
  background: var(--pale);
  border-bottom: 1px solid var(--line);
}
.stage-count { font-size: 0.76rem; font-weight: 700; color: var(--ink-soft); }
.stage-count strong { color: var(--navy); }
.stage-dots { display: flex; gap: 4px; flex-wrap: wrap; margin-inline-start: auto; }
.dot {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--white);
  font-size: 0.66rem;
  font-weight: 900;
  color: var(--ink-faint);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.dot:hover { border-color: var(--cyan); color: var(--navy); }
.dot.is-done { background: var(--cyan-soft); border-color: rgba(8, 169, 224, 0.45); color: var(--navy); }
.dot.is-current {
  background: var(--navy);
  border-color: var(--navy);
  color: var(--white);
  box-shadow: 0 0 0 3px rgba(29, 55, 104, 0.12);
}
.stage-head__main { padding: 18px 22px 20px; }
.stage-head__main h1 { font-size: clamp(1.55rem, 3vw, 2.1rem); line-height: 1.14; margin: 5px 0 7px; }
.stage-head__main .lead { font-size: 0.98rem; }
.stage-head__meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
.stage-head__hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.76rem;
  color: var(--ink-faint);
}
.stage-head__hint .ico { color: var(--coral); }

.stage-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 20px;
  align-items: start;
}
.stage-aside { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 62px; }
.stage-aside .panel { padding: 14px 16px; box-shadow: 0 6px 18px rgba(29, 55, 104, 0.06); }
.stage-aside .panel__title { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-faint); }
.stage-aside .panel__title .ico { color: var(--cyan); }
.stage-aside p { font-size: 0.82rem; color: var(--ink-soft); }
.panel--scene { padding: 12px 12px 10px; }
.panel--scene .scene { aspect-ratio: 28 / 21; }
.panel--scene .eyebrow { margin-bottom: 8px; }
.scene-caption { margin-top: 8px; font-size: 0.78rem; color: var(--ink-faint); text-align: center; }
.stage-main { min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.stage-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 18px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
}
.stage-actions__mid { display: flex; gap: 8px; margin-inline: auto; }

/* ---------- STEP 1 : form ---------- */
.pap-form { display: flex; flex-direction: column; gap: 16px; }
.form-panel { padding: 18px 20px; }
.form-panel .panel__title .ico { color: var(--cyan); }
.type-switch { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 8px 0 18px; }
.type-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 2px solid var(--line);
  border-radius: 13px;
  background: var(--white);
  text-align: start;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}
.type-card:hover { border-color: var(--line-strong); transform: translateY(-1px); }
.type-card.is-on { border-color: var(--cyan); background: var(--cyan-soft); box-shadow: 0 3px 0 rgba(8, 169, 224, 0.2); }
.type-card__art { width: 40px; height: 48px; flex: none; }
.type-card__art .pix { width: 100%; height: 100%; }
.type-card__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.type-card__text strong { font-size: 0.9rem; }
.type-card__text small { font-size: 0.72rem; color: var(--ink-soft); line-height: 1.3; }
.type-card__tick {
  margin-inline-start: auto;
  width: 22px;
  height: 22px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--white);
  border: 1px solid var(--line);
  color: var(--cyan);
}
.type-card.is-on .type-card__tick { background: var(--cyan); border-color: var(--navy); color: var(--white); }

.sign-wrap {
  position: relative;
  border: 2px dashed var(--line-strong);
  border-radius: 12px;
  background:
    repeating-linear-gradient(0deg, transparent 0 39px, rgba(29, 55, 104, 0.05) 39px 40px),
    var(--white);
  overflow: hidden;
  margin-bottom: 6px;
}
.sign-wrap canvas { display: block; width: 100%; height: 150px; touch-action: none; cursor: crosshair; }
.sign-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--ink-faint);
  pointer-events: none;
}
.sign-placeholder .ico { color: var(--cyan); }
.sign-placeholder.is-hidden { display: none; }
.sign-clear { position: absolute; top: 7px; inset-inline-end: 7px; background: rgba(255, 255, 255, 0.92); }

.form-submit {
  border: 2px solid var(--navy);
  border-radius: 16px;
  background: var(--pale);
  padding: 16px 18px;
  box-shadow: 5px 6px 0 rgba(29, 55, 104, 0.1);
}
.form-submit__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--ink-soft);
  margin-bottom: 12px;
}
.form-submit__note .ico { color: var(--cyan); flex: none; margin-top: 2px; }
.form-submit__actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.form-submit__hint { margin-top: 10px; text-align: end; }

/* ---------- shared phone ---------- */
.phone-wrap { display: flex; justify-content: center; align-items: flex-start; }
.phone {
  width: 100%;
  max-width: 340px;
  background: var(--white);
  border: 8px solid var(--navy);
  border-radius: 34px;
  box-shadow: 7px 9px 0 rgba(29, 55, 104, 0.14);
  overflow: hidden;
  position: relative;
}
.phone__notch {
  height: 18px;
  background: var(--navy);
  border-radius: 0 0 14px 14px;
  width: 44%;
  margin: 0 auto;
}
.phone__status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 14px 4px;
  font-size: 0.62rem;
  font-weight: 800;
  color: var(--ink-faint);
}
.phone__status span { display: inline-flex; align-items: center; gap: 4px; }
.phone__app { background: var(--pale); padding: 0 0 12px; }
.phone__head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  background: var(--white);
  border-bottom: 1px solid var(--line);
}
.phone__head div { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
.phone__head strong { font-size: 0.8rem; }
.phone__head small { display: inline-flex; align-items: center; gap: 3px; font-size: 0.62rem; color: var(--ink-faint); }
.phone__head > .ico { margin-inline-start: auto; color: var(--ink-faint); }
.avatar-dot {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  background: var(--light);
  border: 1px solid var(--line-strong);
  display: grid;
  place-items: center;
  padding: 4px;
}
.avatar-dot .pix { width: 100%; height: 100%; }

/* ---------- STEP 2 : chat ---------- */
.stage-2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; align-items: start; }
.chat {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 14px 12px 10px;
  min-height: 320px;
}
.chat-day {
  align-self: center;
  padding: 2px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--line);
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.chat-bubble {
  position: relative;
  max-width: 92%;
  padding: 9px 11px 6px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--white);
  box-shadow: 0 2px 0 rgba(29, 55, 104, 0.05);
  animation: bubble-in 0.35s ease both;
}
@keyframes bubble-in { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: none; } }
.chat-bubble--in { align-self: flex-start; border-start-start-radius: 4px; }
.chat-bubble--out {
  align-self: flex-end;
  background: var(--cyan);
  border-color: var(--navy);
  color: var(--white);
  border-start-end-radius: 4px;
}
.chat-bubble__sender {
  display: block;
  font-size: 0.62rem;
  font-weight: 900;
  color: var(--cyan);
  margin-bottom: 3px;
}
.chat-text { font-size: 0.79rem; line-height: 1.45; white-space: pre-line; }
.chat-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1px;
  font-size: 0.56rem;
  color: var(--ink-faint);
  margin-top: 3px;
}
.chat-bubble--out .chat-meta { color: rgba(255, 255, 255, 0.8); }
.chat-label {
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: auto;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--white);
  border: 1px dashed var(--line-strong);
  font-size: 0.58rem;
  font-weight: 800;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.chat-label .ico { color: var(--coral); }
.stage-2__side { display: flex; flex-direction: column; gap: 14px; }
.decision-panel { border: 2px solid var(--line); }
.question { font-size: 0.92rem; font-weight: 800; margin-bottom: 12px; }
.choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border-radius: 14px;
  border: 2px solid var(--line-strong);
  background: var(--white);
  font-size: 0.84rem;
  font-weight: 800;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}
.choice:hover { transform: translateY(-2px); }
.choice__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--pale);
}
.choice--yes:hover { border-color: var(--cyan); background: var(--cyan-soft); }
.choice--yes .choice__icon { background: var(--cyan); color: var(--white); border-color: var(--navy); }
.choice--no:hover { border-color: var(--coral); background: var(--coral-soft); }
.choice--no .choice__icon { background: var(--coral); color: var(--white); border-color: var(--navy); }

/* ---------- STEP 3 : automatic checkpoints ---------- */
.cp-layout { display: grid; grid-template-columns: minmax(0, 1fr) 230px; gap: 18px; align-items: start; }
.cp-panel { padding: 18px 20px; }
.cp-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.live-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--navy);
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--coral);
  box-shadow: 0 0 0 0 rgba(226, 85, 106, 0.5);
  animation: live-pulse 1.8s ease-out infinite;
}
@keyframes live-pulse {
  0% { box-shadow: 0 0 0 0 rgba(226, 85, 106, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(226, 85, 106, 0); }
  100% { box-shadow: 0 0 0 0 rgba(226, 85, 106, 0); }
}
.cp-count { font-family: var(--font-pixel); font-size: 0.66rem; color: var(--ink-soft); }
.pop-up {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  margin: 14px 0 16px;
  padding: 14px 16px;
  border: 2px solid var(--navy);
  border-radius: 14px;
  background: var(--pale);
  box-shadow: 4px 5px 0 rgba(29, 55, 104, 0.1);
  min-height: 118px;
}
.pop-up.is-pop { animation: pop-in 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.3) both; }
@keyframes pop-in { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: none; } }
.pop-up__num {
  width: 42px;
  height: 42px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--cyan);
  border: 2px solid var(--navy);
  color: var(--white);
  font-family: var(--font-pixel);
  font-size: 0.72rem;
}
.pop-up__eyebrow {
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin-bottom: 3px;
}
.pop-up h3 { font-size: 0.98rem; line-height: 1.25; margin-bottom: 4px; }
.pop-up p { font-size: 0.83rem; color: var(--ink-soft); line-height: 1.5; }
.pop-up.is-static .pop-up__num { background: var(--cyan); }
.checklist { display: flex; flex-direction: column; gap: 6px; }
.check-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: var(--white);
  font-size: 0.82rem;
  color: var(--ink-soft);
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.check-item__box {
  width: 21px;
  height: 21px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 6px;
  border: 2px solid var(--line-strong);
  background: var(--white);
  color: transparent;
}
.check-item.is-done { border-color: rgba(8, 169, 224, 0.4); background: var(--cyan-soft); color: var(--navy); font-weight: 700; }
.check-item.is-done .check-item__box { background: var(--cyan); border-color: var(--navy); color: var(--white); }
.check-item.is-active { border-color: var(--coral); background: var(--coral-soft); color: var(--navy); font-weight: 800; }
.check-item.is-active .check-item__box { border-color: var(--coral); animation: checkbox-pulse 1.2s ease-in-out infinite; }
@keyframes checkbox-pulse { 50% { background: var(--coral-soft); } }
.check-item__text { flex: 1; }
.check-item__badge { display: inline-flex; color: var(--cyan); }
.cp-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 14px; }
.cp-done { margin-top: 16px; }
.cp-done .row-actions { margin-top: 10px; }
.cp-office {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background:
    radial-gradient(rgba(29, 55, 104, 0.07) 1px, transparent 1px) 0 0 / 14px 14px,
    var(--white);
  text-align: center;
}
.cp-office__building { width: 110px; }
.cp-office__clip { width: 76px; margin-top: -16px; }
.cp-office .pix { width: 100%; height: auto; }
.cp-office__label { font-size: 0.66rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-faint); }
.cp-note { grid-column: 1 / -1; font-size: 0.8rem; }

/* ---------- STEP 4 : activation ---------- */
.activation { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.activation__scene { padding: 20px; }
.activation__info { padding: 20px; }
.flow-diagram {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 8px;
  border: 2px solid var(--line-strong);
  border-radius: 14px;
  background: var(--pale);
  text-align: center;
}
.flow-node__art { width: 60px; height: 64px; display: block; }
.flow-node__art .pix { width: 100%; height: 100%; }
.flow-node strong { font-size: 0.8rem; }
.flow-node small { font-size: 0.62rem; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.05em; }
.flow-link { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 74px; }
.flow-link__line {
  width: 100%;
  height: 0;
  border-top: 3px dashed var(--line-strong);
}
.flow-link__coin {
  position: absolute;
  top: -13px;
  left: 0;
  width: 24px;
  height: 24px;
  display: block;
  opacity: 0.85;
}
.flow-link__coin .pix { width: 100%; height: 100%; }
.flow-link__coin.is-moving { animation: coin-travel 1.6s ease-in-out infinite; }
@keyframes coin-travel {
  0% { transform: translateX(0); opacity: 0.3; }
  25% { opacity: 1; }
  75% { opacity: 1; }
  100% { transform: translateX(58px); opacity: 0.25; }
}
.flow-link__label { font-size: 0.58rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-faint); text-align: center; }
.mini-steps { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.mini-steps li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 0.84rem;
  color: var(--ink-faint);
  transition: color 0.2s ease;
}
.mini-step__dot {
  width: 18px;
  height: 18px;
  flex: none;
  border-radius: 6px;
  border: 2px solid var(--line-strong);
  background: var(--white);
  transition: background 0.2s ease, border-color 0.2s ease;
}
.mini-steps li.is-on { color: var(--navy); font-weight: 700; }
.mini-steps li.is-on .mini-step__dot { background: var(--cyan); border-color: var(--navy); }
.activation__status { margin-top: 9px; font-size: 0.84rem; font-weight: 800; color: var(--ink-soft); }
.activation__info .kv { margin-bottom: 12px; }

@media (max-width: 1080px) {
  .stage-grid { grid-template-columns: minmax(0, 1fr); }
  .stage-aside { position: static; display: grid; grid-template-columns: 1fr 1fr; }
  .stage-aside .panel--scene { grid-column: 1 / -1; }
}
@media (max-width: 800px) {
  .stage-2, .activation { grid-template-columns: 1fr; }
  .cp-layout { grid-template-columns: 1fr; }
  .cp-office { flex-direction: row; justify-content: center; }
  .cp-office__building { width: 80px; }
  .cp-office__clip { width: 54px; margin-top: 0; }
  .type-switch { grid-template-columns: 1fr; }
}
@media (max-width: 620px) {
  .stage-head__bar { gap: 8px; padding: 9px 12px; }
  .stage-head__main { padding: 15px 16px 17px; }
  .stage-aside { grid-template-columns: 1fr; }
  .stage-actions { justify-content: center; }
  .stage-actions__mid { order: 3; width: 100%; justify-content: center; }
  .form-grid { grid-template-columns: 1fr; }
  .flow-diagram { grid-template-columns: 1fr; }
  .flow-link { min-height: 34px; }
  .flow-link__line { width: 0; height: 30px; border-top: 0; border-inline-start: 3px dashed var(--line-strong); }
  .flow-link__coin.is-moving { animation: coin-travel-y 1.6s ease-in-out infinite; }
  @keyframes coin-travel-y {
    0% { transform: translateY(0); opacity: 0.3; }
    25% { opacity: 1; }
    75% { opacity: 1; }
    100% { transform: translateY(30px); opacity: 0.25; }
  }
  .choice-grid { grid-template-columns: 1fr; }
}
`;

export const stylesStages2 = `/* ============================================================
   Steps 5 to 10
   ============================================================ */

/* ---------- STEP 5 : first debit ---------- */
.debit-layout { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.debit-scene { padding: 20px; }
.debit-info { padding: 20px; }
.debit-accounts { display: grid; grid-template-columns: 1fr 90px 1fr; align-items: center; gap: 12px; margin-bottom: 18px; }
.account {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 12px 8px;
  border: 2px solid var(--line-strong);
  border-radius: 14px;
  background: var(--pale);
  text-align: center;
}
.account__art { width: 58px; height: 62px; }
.account__art .pix { width: 100%; height: 100%; }
.account strong { font-size: 0.76rem; }
.account small { font-size: 0.64rem; color: var(--ink-faint); letter-spacing: 0.06em; }
.debit-track {
  position: relative;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--white);
  border: 1px solid var(--line);
  overflow: hidden;
}
.debit-track__line {
  position: absolute;
  inset-inline: 10px;
  top: 50%;
  border-top: 3px dashed var(--line-strong);
}
.debit-track__day {
  font-family: var(--font-pixel);
  font-size: 1rem;
  color: var(--navy);
  opacity: 0.18;
}
.debit-track__label {
  position: absolute;
  bottom: 5px;
  font-size: 0.54rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-faint);
}
.debit-token {
  position: absolute;
  top: calc(50% - 13px);
  left: 6px;
  width: 26px;
  height: 26px;
  display: block;
  z-index: 2;
}
.debit-token .pix { width: 100%; height: 100%; }
.debit-token.is-moving { animation: debit-move 2.2s cubic-bezier(0.35, 0, 0.6, 1) forwards; }
.debit-token.is-arrived { left: calc(100% - 34px); }
@keyframes debit-move {
  0% { left: 6px; transform: scale(0.85); opacity: 0.5; }
  15% { opacity: 1; }
  50% { transform: translateY(-7px) scale(1.08); }
  100% { left: calc(100% - 34px); transform: scale(1); opacity: 1; }
}
.cal-mini { border: 2px solid var(--line-strong); border-radius: 14px; background: var(--white); overflow: hidden; }
.cal-mini__head {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  background: var(--navy);
  color: var(--white);
  font-size: 0.76rem;
  font-weight: 800;
}
.cal-mini__month { margin-inline-start: auto; font-size: 0.7rem; color: var(--light); text-transform: capitalize; }
.cal-mini__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  padding: 10px;
}
.cal-cell {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 6px;
  font-size: 0.66rem;
  font-weight: 700;
  color: var(--ink-soft);
  background: var(--pale);
}
.cal-cell.is-25 {
  background: var(--coral);
  color: var(--white);
  font-weight: 900;
  box-shadow: 0 0 0 2px var(--white), 0 0 0 4px var(--coral);
  animation: day-25 2.4s ease-in-out infinite;
}
@keyframes day-25 {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.14); }
}

/* ---------- STEP 6 : monthly follow-up ---------- */
.follow-layout { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.follow-calendar, .month-detail { padding: 18px 20px; }
.follow-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.follow-nav { display: flex; gap: 6px; }
.month-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 14px 0; }
.month-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 9px 10px;
  border: 2px solid var(--line);
  border-radius: 11px;
  background: var(--white);
  cursor: pointer;
  text-align: start;
  transition: transform 0.13s ease, border-color 0.13s ease;
}
.month-card:hover { transform: translateY(-2px); border-color: var(--line-strong); }
.month-card.is-selected { border-color: var(--navy); box-shadow: 0 3px 0 rgba(29, 55, 104, 0.15); }
.month-card__name { font-size: 0.78rem; font-weight: 900; text-transform: capitalize; }
.month-card__status { display: inline-flex; align-items: center; gap: 3px; font-size: 0.62rem; font-weight: 800; color: var(--ink-faint); }
.month-card__amount { font-size: 0.72rem; font-weight: 800; color: var(--ink-soft); }
.month-card.is-paid { background: var(--cyan-soft); border-color: rgba(8, 169, 224, 0.4); }
.month-card.is-paid .month-card__status { color: var(--navy); }
.month-card.is-failed { background: var(--coral-soft); border-color: rgba(226, 85, 106, 0.45); }
.month-card.is-failed .month-card__status { color: var(--coral); }
.month-card.is-pending { background: var(--pale); }
.follow-totals { display: flex; gap: 10px; }
.follow-totals > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 9px 12px;
  border-radius: 11px;
  background: var(--pale);
  border: 1px solid var(--line);
}
.follow-totals span { font-size: 0.68rem; font-weight: 700; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.05em; }
.follow-totals strong { font-size: 1rem; }
.month-detail__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.month-detail__head h3 { font-size: 1.16rem; text-transform: capitalize; }
.month-detail .btn--primary { margin-top: 10px; width: 100%; }
.month-detail .note { margin: 12px 0 8px; }

/* ---------- STEP 7 : payment incidents ---------- */
.incident-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 18px; align-items: start; }
.incident-cal, .incident-steps { padding: 18px 20px; }
.incident-days { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; margin-bottom: 14px; }
.incident-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 14px 8px;
  border: 2px solid var(--line-strong);
  border-radius: 14px;
  background: var(--pale);
  text-align: center;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.incident-day__num { font-family: var(--font-pixel); font-size: 1.3rem; }
.incident-day__label { font-size: 0.68rem; font-weight: 800; color: var(--ink-soft); }
.incident-day__status { display: inline-flex; align-items: center; gap: 3px; font-size: 0.64rem; font-weight: 800; color: var(--ink-faint); }
.incident-day.is-failed { border-color: var(--coral); background: var(--coral-soft); }
.incident-day.is-failed .incident-day__status { color: var(--coral); }
.incident-day.is-paid { border-color: var(--cyan); background: var(--cyan-soft); }
.incident-day.is-paid .incident-day__status { color: var(--navy); }
.incident-arrow { color: var(--ink-faint); display: flex; }
.incident-steps .note { margin-top: 10px; }
.step-block {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--line);
}
.step-block:first-child { padding-top: 0; }
.step-block__num {
  width: 30px;
  height: 30px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--navy);
  color: var(--white);
  font-family: var(--font-pixel);
  font-size: 0.66rem;
}
.step-block h3 { font-size: 0.92rem; margin-bottom: 3px; }
.step-block p { font-size: 0.83rem; color: var(--ink-soft); margin-bottom: 8px; }
.step-block .btn { margin-top: 2px; }
.inline-status { display: inline-flex; align-items: center; gap: 5px; font-size: 0.8rem; font-weight: 800; }
.inline-status.is-failed { color: var(--coral); }
.inline-status.is-paid { color: var(--navy); }

/* ---------- STEP 8 : modification ---------- */
.mod-layout { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.mod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 12px; }
.mod-tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 2px solid var(--line);
  border-radius: 12px;
  background: var(--white);
  text-align: start;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}
.mod-tile:hover { border-color: var(--line-strong); transform: translateY(-2px); }
.mod-tile.is-on { border-color: var(--cyan); background: var(--cyan-soft); box-shadow: 0 3px 0 rgba(8, 169, 224, 0.18); }
.mod-tile__icon {
  width: 38px;
  height: 38px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--pale);
  border: 1px solid var(--line);
  color: var(--navy);
}
.mod-tile.is-on .mod-tile__icon { background: var(--cyan); color: var(--white); border-color: var(--navy); }
.mod-tile__text { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
.mod-tile__text strong { font-size: 0.82rem; }
.mod-tile__text small { font-size: 0.68rem; color: var(--ink-soft); line-height: 1.3; }
.mod-tile__arrow { margin-inline-start: auto; color: var(--ink-faint); flex: none; }
.mod-form {
  margin-top: 12px;
  padding: 14px 15px;
  border: 2px solid var(--navy);
  border-radius: 14px;
  background: var(--pale);
  box-shadow: 4px 5px 0 rgba(29, 55, 104, 0.1);
  animation: pop-in 0.25s ease both;
}
.mod-form .panel__title { font-size: 0.95rem; margin-bottom: 8px; }
.mod-form .panel__title .ico { color: var(--cyan); }
.mod-form__current {
  font-size: 0.8rem;
  color: var(--ink-soft);
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--white);
  border: 1px dashed var(--line-strong);
  margin-bottom: 11px;
}
.mod-form .row-actions { margin-top: 4px; }
.request-list { display: flex; flex-direction: column; gap: 10px; }
.request-list li {
  display: flex;
  gap: 10px;
  padding: 10px 11px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--pale);
}
.request-list__dot {
  width: 24px;
  height: 24px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: var(--cyan);
  color: var(--white);
  border: 1px solid var(--navy);
}
.request-list strong { font-size: 0.82rem; }
.request-list p { font-size: 0.78rem; color: var(--ink-soft); }
.request-list small { font-size: 0.66rem; color: var(--ink-faint); }

/* ---------- STEP 9 : suspension ---------- */
.susp-layout { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.susp-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  border-width: 2px;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.susp-hero.is-active { border-color: rgba(8, 169, 224, 0.5); background: linear-gradient(180deg, var(--cyan-soft), var(--white)); }
.susp-hero.is-suspended { border-color: rgba(226, 85, 106, 0.5); background: linear-gradient(180deg, var(--coral-soft), var(--white)); }
.status-orb {
  width: 70px;
  height: 70px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 3px solid var(--navy);
  background: var(--white);
  color: var(--cyan);
  box-shadow: 0 5px 0 rgba(29, 55, 104, 0.14);
}
.susp-hero.is-suspended .status-orb { color: var(--coral); }
.susp-hero__text { flex: 1; min-width: 180px; }
.susp-hero__text h2 { font-size: 1.4rem; margin: 2px 0 4px; }
.susp-hero .status-pill { margin-inline-start: auto; }

/* ---------- STEP 10 : termination ---------- */
.term-layout { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.term-question { padding: 22px 22px 18px; }
.term-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: var(--coral-soft);
  border: 2px solid var(--coral);
  color: var(--coral);
  margin-bottom: 12px;
}
.term-question h2 { font-size: 1.3rem; line-height: 1.2; margin-bottom: 6px; }
.term-question .choice-grid { margin: 16px 0 12px; }
.term-info { padding: 20px 22px; }
.term-info .kv { margin-bottom: 12px; }
.term-note {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 11px 13px;
  border-radius: 11px;
  background: var(--coral-soft);
  border: 1px solid rgba(226, 85, 106, 0.4);
  font-size: 0.8rem;
  color: var(--navy);
}
.term-note .ico { flex: none; margin-top: 1px; color: var(--coral); }
.reason-list { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.reason {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border: 1px solid var(--line-strong);
  border-radius: 10px;
  background: var(--pale);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}
.reason input { width: 17px; height: 17px; accent-color: var(--coral); flex: none; }
.reason:has(input:checked) { border-color: var(--coral); background: var(--coral-soft); }

.final-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; align-items: start; }
.final-card { padding: 24px 22px; text-align: center; border-width: 2px; border-color: var(--navy); }
.final-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--navy);
  color: var(--white);
  box-shadow: 0 5px 0 rgba(29, 55, 104, 0.18);
}
.final-card h2 { font-size: 1.5rem; margin-bottom: 8px; }
.final-msg { font-size: 0.9rem; color: var(--ink-soft); max-width: 44ch; margin: 0 auto 16px; white-space: pre-line; }
.stop-visual {
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
  padding: 14px 10px;
  border-radius: 12px;
  background: var(--pale);
  border: 1px dashed var(--line-strong);
  position: relative;
  margin-bottom: 12px;
}
.stop-visual > span {
  width: 26px;
  height: 26px;
  display: block;
  opacity: 0.35;
  filter: grayscale(0.4);
  animation: stop-fade 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.12s);
}
.stop-visual .pix { width: 100%; height: 100%; }
@keyframes stop-fade { 0%, 100% { opacity: 0.28; } 50% { opacity: 0.55; } }
.stop-visual__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--coral);
  color: var(--white);
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.summary-card { padding: 20px 22px; }
.summary-card .row-actions { margin-top: 16px; }

@media (max-width: 900px) {
  .debit-layout, .follow-layout, .incident-layout, .mod-layout, .susp-layout, .term-layout, .final-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 620px) {
  .debit-accounts { grid-template-columns: 1fr 54px 1fr; }
  .month-grid { grid-template-columns: repeat(2, 1fr); }
  .mod-grid { grid-template-columns: 1fr; }
  .reason-list { grid-template-columns: 1fr; }
  .incident-days { grid-template-columns: 1fr; }
  .incident-arrow { justify-content: center; transform: rotate(90deg); }
}
`;

export const stylesScreens = `/* ============================================================
   Home, message centre, admin dashboard
   ============================================================ */

/* ---------- home ---------- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 26px;
  align-items: center;
  margin-bottom: 22px;
}
.hero h1 { font-size: clamp(2rem, 4.4vw, 3.2rem); line-height: 1.06; margin: 8px 0 12px; letter-spacing: -0.02em; }
.hero__badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.hero__art { position: relative; }
.hero__avatar {
  position: absolute;
  inset-inline-end: -8px;
  bottom: -14px;
  width: 84px;
  height: 102px;
  display: block;
  padding: 7px;
  border-radius: 16px;
  background: var(--white);
  border: 2px solid var(--navy);
  box-shadow: 5px 6px 0 rgba(29, 55, 104, 0.14);
}
.hero__avatar .pix { width: 100%; height: 100%; }
.home-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.facts-panel, .palette-panel, .levels-panel { margin-bottom: 16px; }
.palette-panel .panel__title .ico,
.facts-panel .panel__title .ico,
.levels-panel .panel__title .ico { color: var(--cyan); }
.swatches { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.swatch {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--white);
}
.swatch__dot { width: 100%; height: 34px; border-radius: 7px; border: 1px solid var(--line-strong); }
.swatch__hex { font-size: 0.62rem; font-weight: 800; color: var(--ink-soft); font-family: ui-monospace, monospace; }
.home-levels { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 10px; }
.home-level {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--white);
  cursor: pointer;
  text-align: start;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}
.home-level:hover { border-color: var(--cyan); background: var(--pale); transform: translateX(2px); }
[dir="rtl"] .home-level:hover { transform: translateX(-2px); }
.home-level__num {
  font-family: var(--font-pixel);
  font-size: 0.6rem;
  color: var(--cyan);
  flex: none;
}
.home-level__title { font-size: 0.82rem; font-weight: 700; flex: 1; }
.home-level .ico { color: var(--ink-faint); flex: none; }
[dir="rtl"] .home-level .ico { transform: scaleX(-1); }

/* ---------- message centre ---------- */
.messages-layout { display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 20px; align-items: start; }
.messages-side { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 62px; }
.messages-side .panel__title { font-size: 0.92rem; }
.phone--tall { max-width: 380px; }
.msg-filters { display: flex; gap: 6px; padding: 9px 12px 0; }
.seg-btn {
  flex: 1;
  padding: 6px 9px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--white);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--ink-soft);
  cursor: pointer;
}
.seg-btn.is-on { background: var(--navy); color: var(--white); border-color: var(--navy); }
.msg-list { display: flex; flex-direction: column; gap: 7px; padding: 10px 10px 4px; }
.msg details {
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--white);
  overflow: hidden;
}
.msg details[open] { border-color: var(--cyan); }
.msg summary {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  cursor: pointer;
  list-style: none;
}
.msg summary::-webkit-details-marker { display: none; }
.msg__icon {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--pale);
  border: 1px solid var(--line);
  color: var(--navy);
}
.msg.is-unread .msg__icon { background: var(--cyan-soft); border-color: rgba(8, 169, 224, 0.45); }
.msg__main { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 1px; }
.msg__main strong { font-size: 0.78rem; }
.msg__preview {
  font-size: 0.7rem;
  color: var(--ink-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.msg__meta { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex: none; }
.msg__meta time { font-size: 0.58rem; color: var(--ink-faint); }
.msg__dot { width: 7px; height: 7px; border-radius: 50%; background: transparent; }
.msg.is-unread .msg__dot { background: var(--coral); }
.msg__body { padding: 0 11px 10px; border-top: 1px dashed var(--line); }
.msg__body p { font-size: 0.78rem; color: var(--ink-soft); padding-top: 8px; white-space: pre-line; }
.msg__fiction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 7px;
  font-size: 0.56rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-faint);
}
.msg__fiction .ico { color: var(--coral); }
.msg__fiction--static { margin-top: 8px; }
.msg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 16px;
  text-align: center;
  color: var(--ink-faint);
}
.msg-empty .ico { color: var(--light); }
.msg-empty p { font-size: 0.8rem; max-width: 24ch; }

/* ---------- admin ---------- */
.banner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line-strong);
  font-size: 0.84rem;
  margin-top: 14px;
}
.banner--demo { background: var(--coral-soft); border-color: rgba(226, 85, 106, 0.4); }
.banner .ico { color: var(--coral); flex: none; }
.banner .btn { margin-inline-start: auto; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
.kpi {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 12px 14px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 13px;
  box-shadow: 0 4px 0 rgba(29, 55, 104, 0.05);
}
.kpi__icon { color: var(--cyan); margin-bottom: 5px; }
.kpi__value { font-size: 1.55rem; font-weight: 900; line-height: 1.1; }
.kpi__label { font-size: 0.68rem; font-weight: 700; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.05em; }
.charts-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 16px; margin-bottom: 16px; }
.chart { width: 100%; height: auto; display: block; overflow: visible; }
.chart-axis { stroke: var(--line-strong); stroke-width: 1.5; }
.bar-rect { fill: var(--cyan); }
.bar-g:hover .bar-rect { fill: var(--navy); }
.bar-value { font-size: 9px; font-weight: 800; fill: var(--navy); }
.bar-label { font-size: 8.5px; font-weight: 700; fill: var(--ink-faint); }
.donut-wrap { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; }
.chart--donut { width: 168px; flex: none; }
.donut-seg { transition: stroke-dasharray 0.4s ease; }
.donut-total { font-size: 30px; font-weight: 900; fill: var(--navy); }
.donut-label { font-size: 8px; font-weight: 700; fill: var(--ink-faint); letter-spacing: 0.06em; text-transform: uppercase; }
.donut-legend { display: flex; flex-direction: column; gap: 7px; min-width: 150px; }
.donut-legend li { display: flex; align-items: center; gap: 7px; font-size: 0.76rem; color: var(--ink-soft); }
.donut-legend strong { margin-inline-start: auto; color: var(--navy); }
.donut-dot { width: 11px; height: 11px; border-radius: 3px; border: 1px solid var(--line-strong); flex: none; }
.table-wrap { overflow-x: auto; margin-top: 10px; border: 1px solid var(--line); border-radius: 12px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; min-width: 560px; }
.data-table th {
  text-align: start;
  padding: 9px 12px;
  background: var(--pale);
  border-bottom: 1px solid var(--line);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.data-table td { padding: 9px 12px; border-bottom: 1px solid var(--line); vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: 0; }
.data-table tbody tr:hover { background: var(--pale); }
.data-table tr.is-you { background: var(--cyan-soft); }
.table-name { display: flex; flex-direction: column; gap: 1px; font-weight: 800; }
.table-name small { font-size: 0.68rem; font-weight: 600; color: var(--ink-faint); }
.you-tag {
  display: inline-block;
  margin-inline-end: 5px;
  padding: 0 5px;
  border-radius: 5px;
  background: var(--navy);
  color: var(--white);
  font-size: 0.56rem;
  font-weight: 900;
  vertical-align: 1px;
  text-transform: uppercase;
}
.data-table .btn { padding: 4px 7px; }
.donor-head { padding-bottom: 10px; border-bottom: 1px dashed var(--line); margin-bottom: 12px; }
.donor-head .kv--inline { gap: 16px; }
.timeline { display: flex; flex-direction: column; gap: 2px; position: relative; }
.timeline__item { display: flex; gap: 11px; align-items: flex-start; padding: 7px 0; position: relative; }
.timeline__item:not(:last-child)::before {
  content: "";
  position: absolute;
  left: 11px;
  top: 30px;
  bottom: -7px;
  width: 2px;
  background: var(--line);
}
[dir="rtl"] .timeline__item:not(:last-child)::before { left: auto; right: 11px; }
.timeline__mark {
  width: 24px;
  height: 24px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 7px;
  border: 1px solid var(--line-strong);
  background: var(--white);
  font-size: 0.64rem;
  font-weight: 900;
  color: var(--ink-faint);
  z-index: 1;
}
.timeline__item.is-done .timeline__mark { background: var(--cyan); border-color: var(--navy); color: var(--white); }
.timeline__item.is-current .timeline__mark { background: var(--coral); border-color: var(--navy); color: var(--white); }
.timeline__item div { display: flex; flex-direction: column; gap: 0; }
.timeline__item strong { font-size: 0.82rem; }
.timeline__item small { font-size: 0.68rem; color: var(--ink-faint); }

@media (max-width: 1080px) {
  .messages-layout { grid-template-columns: 340px minmax(0, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
}
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; }
  .hero__art { max-width: 420px; }
  .messages-layout { grid-template-columns: minmax(0, 1fr); }
  .messages-side { position: static; display: grid; grid-template-columns: 1fr 1fr; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 620px) {
  .home-grid, .home-levels { grid-template-columns: 1fr; }
  .swatches { grid-template-columns: repeat(3, 1fr); }
  .messages-side { grid-template-columns: 1fr; }
  .flow-list { grid-template-columns: 1fr; }
  .phone--tall { max-width: 100%; }
  .kpi { padding: 10px; }
  .kpi__value { font-size: 1.3rem; }
}
`;

export const stylesResponsive = `/* ============================================================
   Responsive, RTL, reduced motion and global helpers
   ============================================================ */

/* pixel sprites */
.pix { display: block; shape-rendering: crispEdges; image-rendering: pixelated; }
.ico { flex: none; vertical-align: -0.15em; }
[hidden] { display: none !important; }

/* Touch-friendly minimums for the small interactive controls. */
.lang__btn, .seg__btn, .icon-btn, .chip, .seg-btn,
.level__open, .dot, .btn--sm, .toast__close {
  min-width: 44px;
  min-height: 44px;
}
.nav__btn { flex: 0 0 auto; min-height: 44px; }
.check { min-height: 44px; }
.check input, .reason input { width: 22px; height: 22px; }

/* ---------- responsive layout ---------- */
@media (max-width: 1180px) {
  .board { gap: 38px 12px; padding: 32px 18px 46px; }
  .level__title { font-size: 0.84rem; }
  .level__sub { font-size: 0.69rem; }
  .nav__stage-title { max-width: 96px; }
}

@media (max-width: 1024px) {
  .main { padding: 24px 16px 46px; }
  .board { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 32px 10px; padding: 28px 12px 42px; }
  .level { padding: 7px 7px 8px; }
  .level__state { font-size: 0.5rem; padding: 1px 4px; }
  .level__scene { margin-bottom: 6px; }
  .level__title { font-size: 0.78rem; }
  .mini-role { width: 18px; height: 18px; padding: 1px; }
  .level__open { width: 22px; height: 22px; }
}

/* Tablets: recompose the winding route into a readable two-column path.
   DOM order 1→10 keeps the connectors and the animated route in sequence. */
@media (min-width: 768px) and (max-width: 1023px) {
  .board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 18px;
    padding: 30px 24px 42px;
  }
  .board .level { grid-column: auto !important; grid-row: auto !important; }
  .board .level .level__scene .scene { aspect-ratio: 16 / 9; }
  .level__title { font-size: 0.92rem; }
  .level__sub { display: -webkit-box; font-size: 0.74rem; }
  .map-head h1 { font-size: 2.4rem; }
}

/* Phones: a single readable column keeps every stage visible and reachable. */
@media (max-width: 767px) {
  .board {
    grid-template-columns: minmax(0, 1fr);
    gap: 34px;
    padding: 30px 38px 40px;
  }
  .board .level { grid-column: 1 !important; grid-row: auto !important; }
  .level__sub { display: block; }
  .level__title { font-size: 0.95rem; }
  .level__scene { max-width: 100%; }
  .level__scene .scene { aspect-ratio: 28 / 17; }
  .level { flex-direction: row; align-items: stretch; gap: 12px; padding: 10px; }
  .level__top { position: absolute; top: 8px; inset-inline-end: 8px; margin: 0; z-index: 2; gap: 4px; }
  .level__top .level__num { background: rgba(255, 255, 255, 0.9); padding: 1px 4px; border-radius: 4px; }
  .level__scene { width: 34%; flex: none; margin: 0; align-self: center; }
  .level__body { justify-content: center; gap: 4px; }
  .level__foot { margin-top: 4px; }
  .level__open { margin-inline-start: auto; }
  .board__avatar { width: 38px; height: 46px; }
  .board__edge { font-size: 0.56rem; }
  .map-head h1 { font-size: 2rem; }
}

@media (max-width: 620px) {
  .nav__inner { padding: 7px 10px; gap: 4px; }
  .nav__btn { padding: 7px 8px; font-size: 0.74rem; }
  .nav__stage-title { display: none; }
  .board { padding: 26px 30px 36px; gap: 30px; }
  .level { flex-direction: column; }
  .level__scene { width: 100%; }
  .level__top { position: static; }
  .map-head { flex-direction: column; align-items: stretch; }
  .map-actions .btn { flex: 1; }
  .map-foot { flex-direction: column; align-items: flex-start; }
  .footer__inner { padding: 20px 16px 28px; }
  .screen-head h1 { font-size: 1.8rem; }
  .dialog-head, .dialog-.pap-app, .dialog-actions { padding-inline: 16px; }
  .pap-dialog { max-width: calc(100vw - 16px); }
  .toast-root { inset-inline: 12px; bottom: 12px; max-width: none; }
  .kv dd { font-size: 0.9rem; }
  .bar { height: 10px; }
  /* Wide data rows become readable labelled cards on phones. */
  .table-wrap { overflow-x: visible; border: 0; background: transparent; }
  .data-table, .data-table tbody, .data-table tr, .data-table td { display: block; width: 100%; min-width: 0; }
  .data-table thead { display: none; }
  .data-table tr {
    margin-bottom: 12px;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--white);
    box-shadow: var(--shadow-soft);
  }
  .data-table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 0;
    border-bottom: 1px solid var(--pale);
    text-align: end;
  }
  .data-table td::before {
    content: attr(data-label);
    flex: none;
    font-size: 0.72rem;
    font-weight: 900;
    color: var(--ink-faint);
    text-align: start;
  }
  .data-table .table-hide { display: flex; }
  .data-table .table-action { padding-bottom: 0; border-bottom: 0; }
  .data-table .table-name { text-align: end; }
}

@media (max-width: 380px) {
  .board { padding: 22px 18px 32px; }
}

/* ---------- RTL ---------- */
[dir="rtl"] .pap-app { font-family: "Segoe UI", "Tahoma", "Noto Naskh Arabic", system-ui, sans-serif; }
[dir="rtl"] .eyebrow,
[dir="rtl"] .stage-count,
[dir="rtl"] .hint { letter-spacing: 0; }
[dir="rtl"] .brand__title { font-family: var(--font-pixel); }
[dir="rtl"] .btn .ico,
[dir="rtl"] .map-head .ico,
[dir="rtl"] .panel__title .ico { transform: none; }
[dir="rtl"] .btn--primary .ico:last-child,
[dir="rtl"] [data-next] .ico:last-child,
[dir="rtl"] .level__open .ico,
[dir="rtl"] .mod-tile__arrow .ico,
[dir="rtl"] .home-level .ico { transform: scaleX(-1); }
[dir="rtl"] .stage-head__hint .ico { transform: scaleX(-1); }
[dir="rtl"] .legend__item .ico,
[dir="rtl"] .tick-list .ico,
[dir="rtl"] .note .ico { transform: none; }
[dir="rtl"] .chat-bubble--out { align-self: flex-start; }
[dir="rtl"] .chat-bubble--in { align-self: flex-end; }
[dir="rtl"] .timeline__item:not(:last-child)::before { left: auto; right: 11px; }
[dir="rtl"] .kv dd { text-align: start; }
[dir="rtl"] .form-submit__hint { text-align: start; }
[dir="rtl"] .flow-label--out .ico,
[dir="rtl"] .flow-label--in .ico { transform: scaleX(-1); }
[dir="rtl"] .data-table th,
[dir="rtl"] .data-table td { text-align: start; }
[dir="rtl"] .level { text-align: start; }
[dir="rtl"] .scene__tag { inset-inline-end: 5px; }
[dir="rtl"] .swatch__hex { direction: ltr; }
[dir="rtl"] .cp-office__label,
[dir="rtl"] .hero__text { text-align: start; }
[dir="rtl"] .hero__avatar { inset-inline-end: -8px; }

/* ---------- motion preferences ---------- */
@media (prefers-reduced-motion: reduce) {
  .pap-root { scroll-behavior: auto; }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .board__avatar .pix,
  .anim-pen, .anim-check, .anim-token, .anim-coin-drop,
  .anim-bell, .anim-gear, .anim-flag,
  .cal-cell.is-25, .live-dot, .stop-visual > span { animation: none !important; }
  .screen { animation: none !important; }
  .toast { animation: none !important; }
  .pop-up.is-pop { animation: none !important; }
  .chat-bubble { animation: none !important; }
}

/* ---------- forced colours / high contrast ---------- */
@media (forced-colors: active) {
  .btn, .panel, .level, .phone, .dialog-card { border: 1px solid CanvasText; }
  .bar > span { background: Highlight; }
  .route-path { stroke: CanvasText; }
}

/* ---------- print ---------- */
@media print {
  .nav, .footer, .toast-root, .stage-actions, .map-actions { display: none !important; }
  .pap-app { background: #fff; }
  .panel, .level { box-shadow: none; }
}
`;

