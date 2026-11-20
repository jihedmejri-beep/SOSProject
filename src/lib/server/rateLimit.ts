export type RateLimiter = {
  allow: (key: string) => boolean;
};

/**
 * Small in-memory fixed-window limiter. Enough to blunt casual abuse on a
 * stateless deployment; a shared store would be needed for multi-instance
 * guarantees.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = () => Date.now(),
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    allow(key: string): boolean {
      const current = now();
      const cutoff = current - windowMs;
      const recent = (hits.get(key) ?? []).filter((time) => time > cutoff);

      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }

      recent.push(current);
      hits.set(key, recent);

      if (hits.size > 500) {
        for (const [entryKey, times] of hits) {
          const alive = times.filter((time) => time > cutoff);
          if (alive.length === 0) hits.delete(entryKey);
          else hits.set(entryKey, alive);
        }
      }

      return true;
    },
  };
}
