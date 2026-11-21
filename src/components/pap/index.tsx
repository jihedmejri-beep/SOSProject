"use client";

import { useEffect, useRef } from "react";
import { PAP_MARKUP } from "./markup";
import { createScope } from "./runtime";
import {
  stylesBase,
  stylesMap,
  stylesStages,
  stylesStages2,
  stylesScreens,
  stylesResponsive,
} from "./styles";

/* The original <script> tags from index.html, in their exact load order. */
import i18nFr from "./modules/i18n-fr";
import i18nFr2 from "./modules/i18n-fr2";
import i18nEn from "./modules/i18n-en";
import i18nEn2 from "./modules/i18n-en2";
import i18nAr from "./modules/i18n-ar";
import i18nAr2 from "./modules/i18n-ar2";
import i18nExtra from "./modules/i18n-extra";
import pixel from "./modules/pixel";
import artScenes from "./modules/art-scenes";
import artScenes2 from "./modules/art-scenes2";
import artActors from "./modules/art-actors";
import data from "./modules/data";
import ui from "./modules/ui";
import state from "./modules/state";
import screensMap from "./modules/screens-map";
import screensStageShell from "./modules/screens-stage-shell";
import screensStage1 from "./modules/screens-stage1";
import screensStage2 from "./modules/screens-stage2";
import screensStage34 from "./modules/screens-stage3-4";
import screensStage57 from "./modules/screens-stage5-7";
import screensStage810 from "./modules/screens-stage8-10";
import screensHome from "./modules/screens-home";
import screensMessagesAdmin from "./modules/screens-messages-admin";
import app from "./modules/app";

const MODULES = [
  i18nFr,
  i18nFr2,
  i18nEn,
  i18nEn2,
  i18nAr,
  i18nAr2,
  i18nExtra,
  pixel,
  artScenes,
  artScenes2,
  artActors,
  data,
  ui,
  state,
  screensMap,
  screensStageShell,
  screensStage1,
  screensStage2,
  screensStage34,
  screensStage57,
  screensStage810,
  screensHome,
  screensMessagesAdmin,
  app,
];

const STYLES = [
  stylesBase,
  stylesMap,
  stylesStages,
  stylesStages2,
  stylesScreens,
  stylesResponsive,
];

/**
 * Tab 2 ("pap") — direct TSX port of the "Projet par défaut" static site.
 * No iframe: the original markup, styles and scripts are mounted into a
 * scoped DOM, with their content unchanged.
 */
export function PapStaticApp() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    shadow.innerHTML =
      STYLES.map((css) => `<style>${css}</style>`).join("") +
      `<div class="pap-root" dir="ltr" lang="fr"><div class="pap-app">${PAP_MARKUP}</div></div>`;

    const rootEl = shadow.querySelector(".pap-root") as HTMLElement;
    if (!rootEl) return;
    const scope = createScope(shadow, rootEl);

    // Run the ported scripts in the same order as the original <script> tags.
    MODULES.forEach((run) => run(scope.document));
    // The original app.js waited for DOMContentLoaded; the DOM is already ready.
    scope.flushReady();

    return () => {
      try {
        (window as any).ScreenStage?.cleanup?.();
      } catch {
        /* nothing mounted */
      }
      try {
        (window as any).ScreenMap?.pause?.();
      } catch {
        /* nothing mounted */
      }
      scope.cleanup();
      shadow.innerHTML = "";
    };
  }, []);

  return <div ref={hostRef} className="pap-static-host" />;
}
