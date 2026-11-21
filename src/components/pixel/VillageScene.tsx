"use client";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import { blinkRows, layersForStage } from "@/components/pixel/sceneLayers";
import type { Stage } from "@/lib/pap/domain";

export function VillageScene({ stage }: { stage: Stage }) {
  const { t } = useExperience();
  const stageName = t.impact.stageNames[stage - 1] ?? "";
  const narration = t.impact.stageDescriptions[stage - 1] ?? "";
  const layers = layersForStage(stage);

  return (
    <>
      <div
        className={`scene${stage === 1 ? " scene--overcast" : ""}`}
        role="img"
        aria-label={t.impact.sceneLabel}
      >
        <div className="scene-narration">{narration}</div>
        <div className="scene-ground" />
        <div className="scene-badge">
          <strong>
            {t.impact.stage} {stage}
          </strong>
          <span>{stageName}</span>
        </div>

        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`scene-item${layer.className ? ` ${layer.className}` : ""}`}
            style={{
              left: layer.left,
              bottom: layer.bottom,
              width: layer.width,
              zIndex: layer.zIndex,
              animationDelay: `${(index % 5) * 0.12}s`,
            }}
          >
            <PixelSprite
              rows={[...layer.sprite]}
              blinkRows={layer.blink ? [...blinkRows(stage)] : undefined}
              blink={layer.blink}
            />
          </div>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {narration}
      </p>
    </>
  );
}
