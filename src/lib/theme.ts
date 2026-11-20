/**
 * The six approved SOS colours. No other colour may be introduced anywhere in
 * the interface. Depth is produced with opacity variations of these values.
 */
export const COLORS = {
  cyan: "#08A9E0",
  navy: "#1D3768",
  coral: "#E2556A",
  paleBlue: "#EFFAFF",
  lightBlue: "#CFEAF5",
  white: "#FFFFFF",
} as const;

export type ColorName = keyof typeof COLORS;

export const COLOR_NAMES = Object.keys(COLORS) as ColorName[];

/** CSS custom property names, used by the pixel-art renderer. */
export const COLOR_VARS: Record<ColorName, string> = {
  cyan: "var(--cyan)",
  navy: "var(--navy)",
  coral: "var(--coral)",
  paleBlue: "var(--pale-blue)",
  lightBlue: "var(--light-blue)",
  white: "var(--white)",
};

/**
 * Palette letters used by the ASCII sprites. Every value MUST resolve to one
 * of the six approved colours (see tests/palette.test.ts).
 */
export const PIXEL_PALETTE: Record<string, ColorName> = {
  n: "navy",
  w: "white",
  c: "cyan",
  l: "lightBlue",
  p: "paleBlue",
  r: "coral",
};
