import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/components/pixel/VillageScene.tsx"),
  "utf8",
);

describe("stage narration in the scene", () => {
  it("renders the current narration visually and as a polite live region", () => {
    expect(source).toContain('className="scene-narration"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("stageDescriptions[stage - 1]");
    expect(source).toContain('role="img"');
  });
});
