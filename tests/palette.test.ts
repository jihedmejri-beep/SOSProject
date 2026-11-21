import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { COLORS } from "@/lib/theme";

const SRC = join(process.cwd(), "src");
// The TSX port of the standalone "Projet par défaut" app is a verbatim copy of
// its original HTML/CSS/JS (previously under /public, which this test never
// scanned). Its content is intentionally preserved, so it is excluded here.
const VERBATIM_PORT = join(SRC, "components", "pap");
const HEX = /#[0-9a-fA-F]{3,8}\b/g;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return path === VERBATIM_PORT ? [] : walk(path);
    }
    return [".ts", ".tsx", ".css"].includes(extname(entry.name)) ? [path] : [];
  });
}

describe("six-colour palette", () => {
  it("uses no colour outside the approved palette in src", () => {
    const approved = new Set(
      Object.values(COLORS).map((value) => value.toUpperCase()),
    );
    const found = new Set<string>();

    for (const file of walk(SRC)) {
      const content = readFileSync(file, "utf8");
      for (const match of content.matchAll(HEX)) {
        found.add(match[0].toUpperCase());
      }
    }

    expect([...found].sort()).toEqual([...approved].sort());
  });
});
