import type { Doc } from "@/convex/_generated/dataModel";
import type { Bark, BarkType, Evidence, SourcePlatform } from "@/lib/types";

export const barkKeys = {
  public: ["barks", "public"] as const,
  detail: (code: string) => ["barks", code] as const,
};

export function sortBarksByPublishedAt(barks: Bark[]): Bark[] {
  return [...barks].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function sortBarksByViews(barks: Bark[]): Bark[] {
  return [...barks].sort((a, b) => {
    if (b.views !== a.views) return b.views - a.views;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}

export function toUiBark(doc: Doc<"barks">): Bark {
  const evidence: Evidence[] = (doc.evidence ?? []).map((item, i) => {
    const isTimestamp = item.type === "timestamp";
    const looksLikeUrl = typeof item.url === "string" && /^https?:\/\//i.test(item.url);
    return {
      id: `${doc.code}-ev-${i}`,
      type: item.type,
      title: item.title,
      description: item.title,
      url: !isTimestamp && looksLikeUrl ? item.url : undefined,
      timestamp: isTimestamp ? item.url || undefined : undefined,
      fileName: item.fileName,
      contentType: item.contentType,
      addedById: doc.authorClerkId,
      addedByName: doc.authorName,
      addedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : new Date().toISOString(),
      verified: false,
    };
  });

  return {
    id: doc._id,
    code: doc.code,
    type: (doc.type || "mixed") as BarkType,
    title: doc.title || "Untitled Reaction",
    authorId: doc.authorClerkId,
    sourceId: `convex-source:${doc.code}`,
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : new Date().toISOString(),
    excerpt: doc.excerpt || "",
    content: (doc.body || "")
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((text) => ({ kind: "paragraph" as const, text })),
    evidence,
    evidenceRating: doc.evidenceRating ?? 0,
    replyCount: doc.replyCount ?? 0,
    upvotes: doc.upvotes ?? 0,
    saves: doc.saves ?? 0,
    views: doc.views ?? 0,
    topics: [],
    country: doc.country ?? "",
    authorName: doc.authorName,
    sourceTitle: doc.sourceTitle,
    sourcePlatform: doc.sourcePlatform as SourcePlatform,
    sourceUrl: doc.sourceUrl,
    sourceCreatorName: doc.sourceCreatorName,
    sourceCreatorId: doc.sourceCreatorId,
    sourceThumbnailUrl: doc.sourceThumbnailUrl,
    creatorResponse: doc.creatorResponse
      ? {
          content: doc.creatorResponse.content,
          respondedAt: new Date(doc.creatorResponse.respondedAt).toISOString(),
          verified: doc.creatorResponse.verified,
        }
      : undefined,
    live: true,
  };
}
