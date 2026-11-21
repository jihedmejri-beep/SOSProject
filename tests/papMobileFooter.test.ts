import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const shell = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("Tab 2 mobile footer", () => {
  it("pushes the page footer to the bottom of the shell", () => {
    const mainRule = shell.match(/\.main \{[^}]*\}/)?.[0] ?? "";
    expect(mainRule).toContain("display: flex");
    expect(mainRule).toContain("flex-direction: column");
    const footerRule = shell.match(/\.footer \{[^}]*\}/)?.[0] ?? "";
    expect(footerRule).toContain("margin-block-start: auto");
  });
});
