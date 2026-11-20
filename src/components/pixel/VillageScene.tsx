"use client";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import {
  BENCH,
  CHILD,
  CHILD_BLINK,
  CHILD_PALETTES,
  CLOUD,
  FLOWER,
  HOUSE,
  HOUSE_LARGE,
  SPROUT,
  TREE,
  type SpriteVariant,
} from "@/components/pixel/sprites";
import type { Stage } from "@/lib/pap/domain";

function Child({
  variant,
  blink,
  delay,
}: {
  variant: SpriteVariant;
  blink?: boolean;
  delay: number;
}) {
  return (
    <div className="bob" style={{ animationDelay: `${delay}s` }}>
      <PixelSprite
        rows={CHILD}
        blinkRows={blink ? CHILD_BLINK : undefined}
        blink={blink}
        palette={CHILD_PALETTES[variant]}
      />
    </div>
  );
}

export function VillageScene({ stage }: { stage: Stage }) {
  const { t } = useExperience();
  const stageName = t.impact.stageNames[stage - 1] ?? "";

  return (
    <div className="scene" role="img" aria-label={t.impact.sceneLabel}>
      <div className="scene-ground" />
      <div className="scene-badge">
        <strong>
          {t.impact.stage} {stage}
        </strong>
        <span>{stageName}</span>
      </div>

      {stage >= 4 ? (
        <div
          className="scene-item drift hide-sm"
          style={{ left: "9%", top: "10%", width: "clamp(46px, 8vw, 84px)" }}
        >
          <PixelSprite rows={CLOUD} />
        </div>
      ) : null}

      {stage >= 5 ? (
        <div
          className="scene-item drift hide-sm"
          style={{
            left: "68%",
            top: "15%",
            width: "clamp(38px, 6.5vw, 70px)",
            animationDelay: "1.4s",
          }}
        >
          <PixelSprite rows={CLOUD} />
        </div>
      ) : null}

      {stage >= 2 ? (
        <div
          className="scene-item scene-pop"
          style={{ left: "5%", bottom: "16%", width: "clamp(94px, 19vw, 172px)" }}
        >
          <PixelSprite rows={HOUSE} />
        </div>
      ) : null}

      {stage >= 4 ? (
        <div
          className="scene-item scene-pop"
          style={{ left: "74%", bottom: "16%", width: "clamp(104px, 21vw, 188px)" }}
        >
          <PixelSprite rows={HOUSE_LARGE} />
        </div>
      ) : null}

      {stage >= 3 ? (
        <div
          className="scene-item scene-pop sway"
          style={{ left: "30%", bottom: "16%", width: "clamp(56px, 10vw, 100px)" }}
        >
          <PixelSprite rows={TREE} />
        </div>
      ) : null}

      {stage >= 5 ? (
        <div
          className="scene-item scene-pop sway hide-sm"
          style={{
            left: "60%",
            bottom: "16%",
            width: "clamp(60px, 11vw, 108px)",
            animationDelay: "0.8s",
          }}
        >
          <PixelSprite rows={TREE} />
        </div>
      ) : null}

      {stage >= 4 ? (
        <div
          className="scene-item scene-pop hide-sm"
          style={{ left: "55%", bottom: "16%", width: "clamp(44px, 7vw, 66px)" }}
        >
          <PixelSprite rows={BENCH} />
        </div>
      ) : null}

      {stage >= 2 ? (
        <>
          <div
            className="scene-item scene-pop"
            style={{ left: "14%", bottom: "15%", width: "clamp(14px, 2.4vw, 22px)" }}
          >
            <PixelSprite rows={FLOWER} />
          </div>
          <div
            className="scene-item scene-pop"
            style={{ left: "34%", bottom: "15%", width: "clamp(12px, 2.2vw, 20px)" }}
          >
            <PixelSprite rows={FLOWER} />
          </div>
          <div
            className="scene-item scene-pop hide-sm"
            style={{ left: "69%", bottom: "15%", width: "clamp(14px, 2.4vw, 22px)" }}
          >
            <PixelSprite rows={FLOWER} />
          </div>
          <div
            className="scene-item scene-pop hide-sm"
            style={{ left: "90%", bottom: "15%", width: "clamp(12px, 2.2vw, 20px)" }}
          >
            <PixelSprite rows={FLOWER} />
          </div>
        </>
      ) : null}

      <div
        className="scene-item scene-pop"
        style={{ left: "40%", bottom: "12%", width: "clamp(64px, 10.5vw, 106px)", zIndex: 5 }}
      >
        <Child variant="a" blink delay={0} />
      </div>

      {stage >= 3 ? (
        <div
          className="scene-item scene-pop"
          style={{ left: "22%", bottom: "12%", width: "clamp(46px, 7.6vw, 76px)", zIndex: 4 }}
        >
          <Child variant="b" delay={0.6} />
        </div>
      ) : null}

      {stage >= 4 ? (
        <div
          className="scene-item scene-pop"
          style={{ left: "62%", bottom: "12%", width: "clamp(46px, 7.6vw, 76px)", zIndex: 4 }}
        >
          <Child variant="c" blink delay={1.1} />
        </div>
      ) : null}

      {stage >= 5 ? (
        <div
          className="scene-item scene-pop hide-sm"
          style={{ left: "79%", bottom: "12%", width: "clamp(42px, 6.8vw, 68px)", zIndex: 4 }}
        >
          <Child variant="d" delay={1.7} />
        </div>
      ) : null}

      <div
        className="scene-item scene-pop sway"
        style={{ left: "52%", bottom: "12%", width: "clamp(26px, 4.4vw, 42px)", zIndex: 6 }}
      >
        <PixelSprite rows={SPROUT} />
      </div>
    </div>
  );
}
