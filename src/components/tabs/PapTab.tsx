"use client";

import { PapStaticApp } from "@/components/pap";

/**
 * Tab 2 ("pap") of SOSProject displays the "Projet par défaut" site.
 * The standalone static app has been ported from its HTML/CSS/JS files to
 * TSX modules and is rendered directly here — no iframe.
 */
export function PapTab() {
  return <PapStaticApp />;
}
