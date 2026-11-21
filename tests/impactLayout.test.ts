import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const tab = readFileSync(join(process.cwd(), "src/components/tabs/ImpactTab.tsx"), "utf8");
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("Tab 1 mobile layout", () => {
  it("keeps one progress bar in the control panel and narration in the scene", () => {
    expect(tab.match(/className="progress"/g)).toHaveLength(1);
    const panelStart = tab.indexOf('className="card sim-panel stack"');
    const progressAt = tab.indexOf('className="progress"');
    const amountAt = tab.indexOf("t.impact.amountLabel");
    expect(progressAt, "progress after panel opening").toBeGreaterThan(panelStart);
    expect(progressAt, "progress before amount title").toBeLessThan(amountAt);
    expect(tab).not.toContain("stageDescriptions");
    expect(tab).toContain('className="card scene-card stack"');
    expect(tab).toContain('className="card sim-panel stack"');
  });

  it("reserves sky space and merges the two cards on narrow screens", () => {
    expect(css).toContain(".scene-narration {");
    expect(css).toContain(".sim-grid > .card");
    expect(css).toContain("inset-inline: 0");
    expect(css).toContain("margin-inline: auto");
    expect(css).toContain(".scene--overcast");
    expect(css).toContain(".scene-narration { font-size: 0.7rem; padding: 6px 10px; }");
    const narrationRule = css.match(/\.scene-narration \{[^}]*\}/)?.[0] ?? "";
    expect(narrationRule).not.toContain("animation");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
