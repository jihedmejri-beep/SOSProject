"use client";

import { PixelSprite, type PixelPalette } from "@/components/pixel/PixelSprite";
import { CHILD, SPROUT } from "@/components/pixel/sprites";

const WHITE_SILHOUETTE: PixelPalette = {
  n: "white",
  w: "white",
  c: "white",
  l: "white",
  r: "white",
};

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <PixelSprite rows={CHILD} palette={WHITE_SILHOUETTE} className="brand-child" />
        <PixelSprite
          rows={SPROUT}
          palette={{ n: "white", c: "white" }}
          className="brand-sprout"
        />
        <PixelSprite
          rows={CHILD}
          palette={WHITE_SILHOUETTE}
          className="brand-child brand-child-2"
        />
      </span>
      <span className="brand-text">
        <span className="brand-name">SOS Villages d&apos;Enfants</span>
        <span className="brand-sub">Tunisie · PAP Revolution</span>
      </span>
    </div>
  );
}
