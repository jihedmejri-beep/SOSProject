"use client";

import { useEffect, useRef } from "react";

type EmbedMessage =
  | { type: "pap-embed-height"; height: number }
  | { type: "pap-embed-avatar"; y: number };

function isEmbedMessage(value: unknown): value is EmbedMessage {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Record<string, unknown>;
  if (message.type === "pap-embed-height") {
    return typeof message.height === "number" && Number.isFinite(message.height);
  }
  if (message.type === "pap-embed-avatar") {
    return typeof message.y === "number" && Number.isFinite(message.y);
  }
  return false;
}

/**
 * Tab 2 ("pap") of SOSProject displays only the "Projet par défaut" site.
 * The standalone static app lives in /public/projet-par-defaut and is served
 * as-is inside an iframe so its own scripts, styles and state work unchanged.
 */
export function PapTab() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const setHeight = (height: number) => {
      const next = `${Math.ceil(height)}px`;
      if (frame.style.height !== next) frame.style.height = next;
    };

    const syncHeight = () => {
      const doc = frame.contentDocument;
      if (doc) setHeight(doc.documentElement.scrollHeight);
    };

    const followAvatar = (y: number) => {
      const frameTop = frame.getBoundingClientRect().top + window.scrollY;
      const avatarTop = frameTop + y;
      const margin = Math.min(220, window.innerHeight * 0.3);
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;
      if (avatarTop < viewportTop + margin) {
        window.scrollTo({ top: Math.max(0, avatarTop - margin), behavior: "instant" });
      } else if (avatarTop > viewportBottom - margin) {
        window.scrollTo({ top: avatarTop - window.innerHeight + margin, behavior: "instant" });
      }
    };

    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== frame.contentWindow) return;
      if (event.origin !== window.location.origin) return;
      if (!isEmbedMessage(event.data)) return;
      if (event.data.type === "pap-embed-height") {
        setHeight(event.data.height);
      } else {
        followAvatar(event.data.y);
      }
    };

    frame.addEventListener("load", syncHeight);
    window.addEventListener("message", onMessage);

    return () => {
      frame.removeEventListener("load", syncHeight);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div className="pap-embed">
      <iframe
        ref={frameRef}
        src="/projet-par-defaut/index.html"
        title="Projet par défaut — parcours PAP"
        className="pap-embed__frame"
      />
    </div>
  );
}
