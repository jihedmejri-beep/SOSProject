import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ReferenceSection = {
  number: number;
  title: string;
  markdown: string;
};

export type PapReference = {
  text: string;
  sections: ReferenceSection[];
};

export const REFERENCE_FILE = "sos-tunisie-pap-reference.md";

let cachedReference: PapReference | null = null;

function readReferenceFile(): string | null {
  const candidates = [
    join(process.cwd(), REFERENCE_FILE),
    join(process.cwd(), "..", REFERENCE_FILE),
  ];

  for (const file of candidates) {
    try {
      const text = readFileSync(file, "utf8");
      if (text.trim().length > 0) return text;
    } catch {
      /* Try the next candidate. */
    }
  }
  return null;
}

export function parseReferenceSections(text: string): ReferenceSection[] {
  const sections: ReferenceSection[] = [];
  let current: { number: number; title: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    sections.push({
      number: current.number,
      title: current.title,
      markdown: current.lines.join("\n").trim(),
    });
  };

  for (const line of text.split(/\r?\n/)) {
    const heading = /^##\s+(\d+)\.\s+(.+)$/.exec(line.trim());
    if (heading) {
      flush();
      current = {
        number: Number(heading[1]),
        title: heading[2]?.trim() ?? "",
        lines: [line],
      };
      continue;
    }
    if (current) current.lines.push(line);
  }
  flush();

  return sections;
}

export function loadPapReference(): PapReference | null {
  if (cachedReference) return cachedReference;

  const text = readReferenceFile();
  if (!text) return null;

  cachedReference = { text, sections: parseReferenceSections(text) };
  return cachedReference;
}

export function referenceSection(
  reference: PapReference,
  number: number,
): ReferenceSection | undefined {
  return reference.sections.find((section) => section.number === number);
}
