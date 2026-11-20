"use client";

import { useEffect, useMemo, useState } from "react";
import { COLOR_VARS, PIXEL_PALETTE, type ColorName } from "@/lib/theme";
import { useReducedMotion } from "@/components/useReducedMotion";

export type PixelPalette = Partial<Record<string, ColorName>>;

type Rect = { x: number; y: number; width: number; fill: string };

function buildRects(rows: string[], palette: PixelPalette): { width: number; height: number; rects: Rect[] } {
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const rects: Rect[] = [];

  rows.forEach((rawRow, y) => {
    const row = rawRow.padEnd(width, ".");
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      if (!char || char === ".") {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === char) run += 1;
      const colorName = palette[char] ?? PIXEL_PALETTE[char];
      if (colorName) {
        rects.push({ x, y, width: run, fill: COLOR_VARS[colorName] });
      }
      x += run;
    }
  });

  return { width, height: rows.length, rects };
}

type Props = {
  rows: string[];
  blinkRows?: string[];
  palette?: PixelPalette;
  className?: string;
  label?: string;
  blink?: boolean;
};

export function PixelSprite({
  rows,
  blinkRows,
  palette,
  className,
  label,
  blink = false,
}: Props) {
  const reduced = useReducedMotion();
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!blink || !blinkRows || reduced) {
      setClosed(false);
      return;
    }
    let timer = 0;
    let closedTimer = 0;
    let cancelled = false;

    const schedule = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setClosed(true);
        closedTimer = window.setTimeout(() => {
          if (cancelled) return;
          setClosed(false);
          schedule();
        }, 140);
      }, 2600 + Math.random() * 2800);
    };
    schedule();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(closedTimer);
    };
  }, [blink, blinkRows, reduced]);

  const activeRows = closed && blinkRows ? blinkRows : rows;
  const { width, height, rects } = useMemo(
    () => buildRects(activeRows, palette ?? {}),
    [activeRows, palette],
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects.map((rect) => (
        <rect
          key={`${rect.x}-${rect.y}-${rect.width}`}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={1}
          fill={rect.fill}
        />
      ))}
    </svg>
  );
}
