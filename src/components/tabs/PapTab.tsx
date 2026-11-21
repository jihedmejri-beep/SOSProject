"use client";

/**
 * Tab 2 ("pap") of SOSProject displays only the "Projet par défaut" site.
 * The standalone static app lives in /public/projet-par-defaut and is served
 * as-is inside an iframe so its own scripts, styles and state work unchanged.
 */
export function PapTab() {
  return (
    <div className="pap-embed">
      <iframe
        src="/projet-par-defaut/index.html"
        title="Projet par défaut — parcours PAP"
        className="pap-embed__frame"
      />
    </div>
  );
}
