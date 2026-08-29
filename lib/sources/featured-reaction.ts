import type { Bark } from "@/lib/types";

function barkEngagement(bark: Bark): number {
  return bark.upvotes + bark.saves + bark.views;
}

/** Top public reaction per source URL by engagement, then recency. */
export function featuredReactionCodeBySourceUrl(
  barks: Bark[]
): Map<string, string> {
  const best = new Map<string, Bark>();

  for (const bark of barks) {
    const url = bark.sourceUrl?.trim();
    if (!url) continue;

    const existing = best.get(url);
    if (!existing) {
      best.set(url, bark);
      continue;
    }

    const score = barkEngagement(bark);
    const existingScore = barkEngagement(existing);
    if (
      score > existingScore ||
      (score === existingScore &&
        new Date(bark.publishedAt).getTime() >
          new Date(existing.publishedAt).getTime())
    ) {
      best.set(url, bark);
    }
  }

  return new Map(
    [...best.entries()].map(([url, bark]) => [url, bark.code])
  );
}
