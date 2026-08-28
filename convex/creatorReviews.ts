import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { clerkOrgId, clerkUserId, requireIdentity } from "./lib/auth";
import {
  barkStatus,
  barkType,
  creatorReviewFields,
  evidenceItem,
} from "./lib/validators";

const reviewDoc = v.object({
  ...creatorReviewFields,
  _id: v.id("creatorReviews"),
  _creationTime: v.number(),
});

async function withResolvedEvidence(
  ctx: QueryCtx,
  review: Doc<"creatorReviews">
): Promise<Doc<"creatorReviews">> {
  const evidence = await Promise.all(
    review.evidence.map(async (item) => {
      if (!item.storageId) return item;
      const fileUrl = await ctx.storage.getUrl(item.storageId);
      return { ...item, url: fileUrl ?? item.url };
    })
  );
  return { ...review, evidence };
}

export const create = mutation({
  args: {
    creatorId: v.id("creators"),
    type: barkType,
    title: v.string(),
    body: v.string(),
    status: barkStatus,
    evidence: v.array(evidenceItem),
  },
  returns: v.object({ code: v.string() }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const authorClerkId = clerkUserId(identity);
    const creator = await ctx.db.get(args.creatorId);
    if (!creator || creator.status !== "approved") {
      throw new Error("Creator not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", authorClerkId))
      .unique();

    const title = args.title.trim();
    const body = args.body.trim();
    if (!title) throw new Error("Title is required");
    if (!body) throw new Error("Body is required");

    const year = new Date().getUTCFullYear();
    let code = "";
    for (let attempt = 0; attempt < 8; attempt++) {
      const n = 1000 + Math.floor(Math.random() * 9000);
      const candidate = `REV-${year}-${String(n).padStart(4, "0")}`;
      const existing = await ctx.db
        .query("creatorReviews")
        .withIndex("by_code", (q) => q.eq("code", candidate))
        .unique();
      if (!existing) {
        code = candidate;
        break;
      }
    }
    if (!code) throw new Error("Could not allocate a review code");

    const excerpt = body.slice(0, 220);
    const evidenceRating = Math.min(100, 55 + args.evidence.length * 8);

    for (const item of args.evidence) {
      const storageId = item.storageId;
      if (!storageId) continue;
      const upload = await ctx.db
        .query("evidenceUploads")
        .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
        .unique();
      if (!upload || upload.uploaderClerkId !== authorClerkId) {
        throw new Error("Evidence file is not yours");
      }
      if (!upload.bound) {
        await ctx.db.patch(upload._id, { bound: true });
      }
    }

    const authorImageUrl = user?.imageUrl ?? identity.pictureUrl;
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("clerkUserId", authorClerkId))
      .unique();
    const country = settings?.country?.trim().toUpperCase();

    await ctx.db.insert("creatorReviews", {
      code,
      creatorId: args.creatorId,
      type: args.type,
      title,
      body,
      excerpt,
      status: args.status,
      authorClerkId,
      authorName:
        user?.name ||
        (typeof identity.name === "string" && identity.name) ||
        "Member",
      ...(authorImageUrl ? { authorImageUrl } : {}),
      orgClerkId: clerkOrgId(identity as unknown as Record<string, unknown>),
      evidence: args.evidence,
      evidenceRating,
      publishedAt: Date.now(),
      replyCount: 0,
      upvotes: 0,
      saves: 0,
      views: 0,
      ...(country ? { country } : {}),
    });

    return { code };
  },
});

export const listPublic = query({
  args: {},
  returns: v.array(reviewDoc),
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query("creatorReviews")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "public"))
      .order("desc")
      .take(50);
    return await Promise.all(
      reviews.map((review) => withResolvedEvidence(ctx, review))
    );
  },
});

export const listByCreator = query({
  args: { creatorId: v.id("creators") },
  returns: v.array(reviewDoc),
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("creatorReviews")
      .withIndex("by_creator_status_publishedAt", (q) =>
        q.eq("creatorId", args.creatorId).eq("status", "public")
      )
      .order("desc")
      .take(50);
    return await Promise.all(
      reviews.map((review) => withResolvedEvidence(ctx, review))
    );
  },
});

export const listPublicByAuthor = query({
  args: { authorClerkId: v.string() },
  returns: v.array(reviewDoc),
  handler: async (ctx, args) => {
    if (!args.authorClerkId) return [];
    const reviews = await ctx.db
      .query("creatorReviews")
      .withIndex("by_author", (q) =>
        q.eq("authorClerkId", args.authorClerkId)
      )
      .order("desc")
      .take(50);
    const published = reviews.filter((r) => r.status === "public");
    return await Promise.all(
      published.map((review) => withResolvedEvidence(ctx, review))
    );
  },
});

export const getByCode = query({
  args: { code: v.string() },
  returns: v.union(reviewDoc, v.null()),
  handler: async (ctx, args) => {
    const code = args.code.trim().toUpperCase();
    if (!code) return null;
    const review = await ctx.db
      .query("creatorReviews")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    if (!review) return null;
    if (review.status !== "public") {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return null;
      const clerkId = clerkUserId(identity);
      if (review.authorClerkId !== clerkId) return null;
    }
    return await withResolvedEvidence(ctx, review);
  },
});
