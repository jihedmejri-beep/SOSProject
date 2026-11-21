export interface FollowViewport {
  scrollTop: number;
  height: number;
  margin: number;
}

export function followScrollTop(avatarTop: number, viewport: FollowViewport): number | null {
  const usableMargin = Math.max(0, Math.min(viewport.margin, viewport.height / 2 - 1));
  const safeTop = viewport.scrollTop + usableMargin;
  const safeBottom = viewport.scrollTop + viewport.height - usableMargin;

  if (avatarTop >= safeTop && avatarTop <= safeBottom) return null;

  const target =
    avatarTop < safeTop
      ? avatarTop - usableMargin
      : avatarTop - viewport.height + usableMargin;

  return Math.max(0, target);
}
