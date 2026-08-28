"use server";

import { sources } from "@/lib/data";
import {
  applyRemoteMeta,
  detectSource,
  isTikTokShortHost,
  parsePublicUrl,
  type DetectedSource,
} from "@/lib/detect-source";
import {
  remoteMetaIsLimited,
  resolveTikTokUrl,
  unfurlSource,
} from "@/lib/unfurl";

export async function analyzeSourceUrl(
  raw: string
): Promise<DetectedSource | null> {
  let working = raw.trim();
  const parsed = parsePublicUrl(working);
  if (parsed && isTikTokShortHost(parsed.hostname)) {
    working = await resolveTikTokUrl(working);
  }

  const detected = detectSource(working, sources);
  if (!detected) return null;
  if (!detected.source.id.startsWith("detect:")) return detected;

  const meta = await unfurlSource(
    detected.source.url || working,
    detected.source.platform
  );
  if (!meta) return { ...detected, detailsLimited: true };

  return {
    ...applyRemoteMeta(detected, meta),
    detailsLimited: remoteMetaIsLimited(meta),
  };
}
