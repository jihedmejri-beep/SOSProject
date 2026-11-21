import { describe, expect, it } from "vitest";
import {
  REFERENCE_FILE,
  loadPapReference,
  parseReferenceSections,
  referenceSection,
} from "@/lib/server/papReference";

describe("PAP reference", () => {
  it("loads the markdown reference from the project root", () => {
    const reference = loadPapReference();
    expect(reference).not.toBeNull();
    expect(reference?.text.length).toBeGreaterThan(1000);
    expect(reference?.sections.length).toBeGreaterThanOrEqual(15);
    expect(reference?.text).toContain("Prélèvement Automatique Permanent");
  });

  it("parses numbered sections with their titles", () => {
    const sections = parseReferenceSections(
      ["# Doc", "## 1. First", "Body one", "## 7. Seventh", "Body seven"].join("\n"),
    );
    expect(sections).toHaveLength(2);
    expect(sections[0]).toMatchObject({ number: 1, title: "First" });
    expect(sections[0]?.markdown).toContain("Body one");
    expect(sections[1]).toMatchObject({ number: 7, title: "Seventh" });
  });

  it("keeps the key published facts and the unconfirmed-minimum caveat", () => {
    const reference = loadPapReference();
    expect(reference).not.toBeNull();
    if (!reference) return;

    const dates = referenceSection(reference, 7);
    expect(dates?.markdown).toContain("25th");
    expect(dates?.markdown).toContain("5th");

    const minimum = referenceSection(reference, 1);
    expect(minimum?.markdown).toContain("TND 10");
    expect(minimum?.markdown.toLowerCase()).toContain("confirm");

    const openItems = referenceSection(reference, 15);
    expect(openItems?.markdown.toLowerCase()).toContain("minimum");
  });

  it("exposes the expected file name", () => {
    expect(REFERENCE_FILE).toBe("sos-tunisie-pap-reference.md");
  });
});
