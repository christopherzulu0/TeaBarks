import type { Doc } from "@/convex/_generated/dataModel";
import type { BarkType, CreatorReview, Evidence } from "@/lib/types";

export const reviewKeys = {
  public: ["creatorReviews", "public"] as const,
  detail: (code: string) => ["creatorReviews", code] as const,
};

export function toUiCreatorReview(
  doc: Doc<"creatorReviews">,
  creator?: { name: string; handle: string }
): CreatorReview {
  const evidence: Evidence[] = (doc.evidence ?? []).map((item, i) => {
    const isTimestamp = item.type === "timestamp";
    const looksLikeUrl =
      typeof item.url === "string" && /^https?:\/\//i.test(item.url);
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
      addedAt: doc.publishedAt
        ? new Date(doc.publishedAt).toISOString()
        : new Date().toISOString(),
      verified: false,
    };
  });

  return {
    id: doc._id,
    code: doc.code,
    type: (doc.type || "mixed") as BarkType,
    title: doc.title || "Untitled review",
    creatorId: doc.creatorId,
    creatorName: creator?.name,
    creatorHandle: creator?.handle,
    authorId: doc.authorClerkId,
    authorName: doc.authorName,
    publishedAt: doc.publishedAt
      ? new Date(doc.publishedAt).toISOString()
      : new Date().toISOString(),
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
    country: doc.country ?? "",
    live: true,
  };
}
