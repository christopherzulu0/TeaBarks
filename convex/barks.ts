import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { clerkOrgId, clerkUserId, requireIdentity } from "./lib/auth";
import { recordModerationEvent } from "./lib/moderation";
import {
  notify,
  notifyMany,
  resolveBarkMentionRecipients,
} from "./lib/notify";
import {
  barkCommentFields,
  barkDocFields,
  barkStatus,
  barkStickerId,
  barkType,
  evidenceItem,
  reportCategory,
  sourcePlatform,
} from "./lib/validators";

const barkDoc = v.object({
  ...barkDocFields,
  _id: v.id("barks"),
  _creationTime: v.number(),
});

async function withResolvedEvidence(
  ctx: QueryCtx,
  bark: Doc<"barks">
): Promise<Doc<"barks">> {
  const evidence = await Promise.all(
    bark.evidence.map(async (item) => {
      if (!item.storageId) return item;
      const fileUrl = await ctx.storage.getUrl(item.storageId);
      return { ...item, url: fileUrl ?? item.url };
    })
  );
  return { ...bark, evidence };
}

async function countryForAuthor(
  ctx: QueryCtx,
  authorClerkId: string,
  cache: Map<string, string>
) {
  if (!cache.has(authorClerkId)) {
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("clerkUserId", authorClerkId))
      .unique();
    cache.set(
      authorClerkId,
      settings?.country?.trim().toUpperCase() ?? ""
    );
  }
  return cache.get(authorClerkId) ?? "";
}

async function countryForBark(
  ctx: QueryCtx,
  bark: Doc<"barks">,
  cache: Map<string, string>
) {
  const stamped = bark.country?.trim().toUpperCase() ?? "";
  if (stamped) return stamped;
  return await countryForAuthor(ctx, bark.authorClerkId, cache);
}

export const create = mutation({
  args: {
    type: barkType,
    title: v.string(),
    body: v.string(),
    status: barkStatus,
    sourceUrl: v.string(),
    sourceTitle: v.string(),
    sourcePlatform,
    sourceCreatorName: v.string(),
    sourceCreatorId: v.optional(v.id("creators")),
    sourceThumbnailUrl: v.optional(v.string()),
    evidence: v.array(evidenceItem),
  },
  returns: v.object({ code: v.string() }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const authorClerkId = clerkUserId(identity);
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
      const candidate = `BRK-${year}-${String(n).padStart(4, "0")}`;
      const existing = await ctx.db
        .query("barks")
        .withIndex("by_code", (q) => q.eq("code", candidate))
        .unique();
      if (!existing) {
        code = candidate;
        break;
      }
    }
    if (!code) throw new Error("Could not allocate a bark code");

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

    let sourceCreatorId = args.sourceCreatorId;
    if (sourceCreatorId) {
      const creator = await ctx.db.get(sourceCreatorId);
      if (
        !creator ||
        (creator.status !== "approved" && creator.status !== "unclaimed")
      ) {
        throw new Error("Source creator not found");
      }
    }

    await ctx.db.insert("barks", {
      code,
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
      sourceUrl: args.sourceUrl,
      sourceTitle: args.sourceTitle,
      sourcePlatform: args.sourcePlatform,
      sourceCreatorName: args.sourceCreatorName,
      ...(sourceCreatorId ? { sourceCreatorId } : {}),
      ...(args.sourceThumbnailUrl
        ? { sourceThumbnailUrl: args.sourceThumbnailUrl }
        : {}),
      evidence: args.evidence,
      evidenceRating,
      publishedAt: Date.now(),
      replyCount: 0,
      upvotes: 0,
      saves: 0,
      views: 0,
      ...(country ? { country } : {}),
    });

    if (sourceCreatorId && args.status === "public") {
      const creator = await ctx.db.get(sourceCreatorId);
      if (creator) {
        const priorBarks = await ctx.db
          .query("barks")
          .withIndex("by_sourceCreator_status_publishedAt", (q) =>
            q.eq("sourceCreatorId", sourceCreatorId).eq("status", "public")
          )
          .take(100);
        const sourceUrl = args.sourceUrl.trim();
        const isNewSource = !priorBarks.some(
          (bark) => bark.sourceUrl.trim() === sourceUrl && bark.code !== code
        );
        await ctx.db.patch(sourceCreatorId, {
          totalBarksReceived: creator.totalBarksReceived + 1,
          totalSources: creator.totalSources + (isNewSource ? 1 : 0),
          updatedAt: Date.now(),
        });
      }
    }

    return { code };
  },
});

export const listPublic = query({
  args: {},
  returns: v.array(barkDoc),
  handler: async (ctx) => {
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "public"))
      .order("desc")
      .take(50);
    return await Promise.all(
      barks.map((bark) => withResolvedEvidence(ctx, bark))
    );
  },
});

export const listBySourceCreator = query({
  args: { creatorId: v.id("creators") },
  returns: v.array(barkDoc),
  handler: async (ctx, args) => {
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_sourceCreator_status_publishedAt", (q) =>
        q.eq("sourceCreatorId", args.creatorId).eq("status", "public")
      )
      .order("desc")
      .take(50);
    return await Promise.all(
      barks.map((bark) => withResolvedEvidence(ctx, bark))
    );
  },
});

const countryStatDoc = v.object({
  code: v.string(),
  barkCount: v.number(),
  activeDiscussions: v.number(),
});

export const countryStats = query({
  args: {},
  returns: v.array(countryStatDoc),
  handler: async (ctx) => {
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "public"))
      .order("desc")
      .take(200);

    const settingsByAuthor = new Map<string, string>();
    const counts = new Map<
      string,
      { barkCount: number; activeDiscussions: number }
    >();

    for (const bark of barks) {
      const code = await countryForBark(ctx, bark, settingsByAuthor);
      if (!code) continue;
      const row = counts.get(code) ?? { barkCount: 0, activeDiscussions: 0 };
      row.barkCount += 1;
      if (bark.replyCount > 0) row.activeDiscussions += 1;
      counts.set(code, row);
    }

    return [...counts.entries()].map(([code, stats]) => ({
      code,
      barkCount: stats.barkCount,
      activeDiscussions: stats.activeDiscussions,
    }));
  },
});

export const listPublicByCountry = query({
  args: { country: v.string() },
  returns: v.array(barkDoc),
  handler: async (ctx, args) => {
    const country = args.country.trim().toUpperCase();
    if (!country) return [];
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "public"))
      .order("desc")
      .take(200);
    const settingsByAuthor = new Map<string, string>();
    const matched: Doc<"barks">[] = [];
    for (const bark of barks) {
      const code = await countryForBark(ctx, bark, settingsByAuthor);
      if (code !== country) continue;
      matched.push({ ...bark, country });
      if (matched.length >= 50) break;
    }
    return await Promise.all(
      matched.map((bark) => withResolvedEvidence(ctx, bark))
    );
  },
});

const publicSourceDoc = v.object({
  sourceUrl: v.string(),
  sourceTitle: v.string(),
  sourcePlatform,
  sourceCreatorName: v.string(),
  sourceThumbnailUrl: v.union(v.string(), v.null()),
  barkCount: v.number(),
  replyCount: v.number(),
  evidenceRating: v.number(),
  engagement: v.number(),
  publishedAt: v.number(),
});

export const listPublicSources = query({
  args: {},
  returns: v.array(publicSourceDoc),
  handler: async (ctx) => {
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "public"))
      .order("desc")
      .take(80);

    const grouped = new Map<
      string,
      {
        sourceUrl: string;
        sourceTitle: string;
        sourcePlatform: (typeof barks)[number]["sourcePlatform"];
        sourceCreatorName: string;
        sourceThumbnailUrl: string | null;
        barkCount: number;
        replyCount: number;
        evidenceSum: number;
        engagement: number;
        publishedAt: number;
      }
    >();

    for (const bark of barks) {
      const sourceUrl = bark.sourceUrl.trim();
      if (!sourceUrl) continue;
      const engagement = bark.views + bark.upvotes + bark.saves;
      const existing = grouped.get(sourceUrl);
      if (!existing) {
        grouped.set(sourceUrl, {
          sourceUrl,
          sourceTitle: bark.sourceTitle,
          sourcePlatform: bark.sourcePlatform,
          sourceCreatorName: bark.sourceCreatorName,
          sourceThumbnailUrl: bark.sourceThumbnailUrl ?? null,
          barkCount: 1,
          replyCount: bark.replyCount,
          evidenceSum: bark.evidenceRating,
          engagement,
          publishedAt: bark.publishedAt,
        });
        continue;
      }
      existing.barkCount += 1;
      existing.replyCount += bark.replyCount;
      existing.evidenceSum += bark.evidenceRating;
      existing.engagement += engagement;
    }

    return [...grouped.values()]
      .map((row) => ({
        sourceUrl: row.sourceUrl,
        sourceTitle: row.sourceTitle,
        sourcePlatform: row.sourcePlatform,
        sourceCreatorName: row.sourceCreatorName,
        sourceThumbnailUrl: row.sourceThumbnailUrl,
        barkCount: row.barkCount,
        replyCount: row.replyCount,
        evidenceRating: Math.round(row.evidenceSum / row.barkCount),
        engagement: row.engagement,
        publishedAt: row.publishedAt,
      }))
      .sort((a, b) => {
        if (b.barkCount !== a.barkCount) return b.barkCount - a.barkCount;
        return b.engagement - a.engagement;
      })
      .slice(0, 24);
  },
});

export const listMine = query({
  args: {},
  returns: v.array(barkDoc),
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_author_status_publishedAt", (q) =>
        q.eq("authorClerkId", clerkUserId(identity)).eq("status", "public")
      )
      .order("desc")
      .take(50);
    return await Promise.all(
      barks.map((bark) => withResolvedEvidence(ctx, bark))
    );
  },
});

export const listPublicByAuthor = query({
  args: { authorClerkId: v.string() },
  returns: v.array(barkDoc),
  handler: async (ctx, args) => {
    if (!args.authorClerkId) return [];
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_author_status_publishedAt", (q) =>
        q.eq("authorClerkId", args.authorClerkId).eq("status", "public")
      )
      .order("desc")
      .take(50);
    return await Promise.all(
      barks.map((bark) => withResolvedEvidence(ctx, bark))
    );
  },
});

function barkMatchesCreator(
  bark: Doc<"barks">,
  creator: { name: string; handle: string }
) {
  const name = bark.sourceCreatorName.toLowerCase();
  const handleKey = creator.handle.toLowerCase();
  return (
    bark.sourceCreatorName === creator.name ||
    name === handleKey ||
    name === creator.name.toLowerCase()
  );
}

export const listFollowing = query({
  args: {},
  returns: v.array(barkDoc),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const clerkId = clerkUserId(identity);

    const [authorFollows, creatorFollows] = await Promise.all([
      ctx.db
        .query("userFollows")
        .withIndex("by_user", (q) => q.eq("clerkUserId", clerkId))
        .take(20),
      ctx.db
        .query("creatorFollows")
        .withIndex("by_user", (q) => q.eq("clerkUserId", clerkId))
        .take(20),
    ]);

    const byId = new Map<Id<"barks">, Doc<"barks">>();
    const authorIds = authorFollows.slice(0, 12).map((row) => row.targetClerkId);
    for (const authorClerkId of authorIds) {
      const rows = await ctx.db
        .query("barks")
        .withIndex("by_author_status_publishedAt", (q) =>
          q.eq("authorClerkId", authorClerkId).eq("status", "public")
        )
        .order("desc")
        .take(8);
      for (const row of rows) byId.set(row._id, row);
    }

    const creators = [];
    for (const follow of creatorFollows) {
      const creator = await ctx.db.get(follow.creatorId);
      if (creator && creator.status === "approved") creators.push(creator);
    }
    if (creators.length > 0) {
      const recent = await ctx.db
        .query("barks")
        .withIndex("by_status_publishedAt", (q) => q.eq("status", "public"))
        .order("desc")
        .take(50);
      for (const bark of recent) {
        if (creators.some((creator) => barkMatchesCreator(bark, creator))) {
          byId.set(bark._id, bark);
        }
      }
    }

    const merged = [...byId.values()]
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, 50);
    return await Promise.all(
      merged.map((bark) => withResolvedEvidence(ctx, bark))
    );
  },
});

export const getByCode = query({
  args: { code: v.string() },
  returns: v.union(barkDoc, v.null()),
  handler: async (ctx, args) => {
    const code = args.code.trim().toUpperCase();
    if (!code) return null;
    const bark = await ctx.db
      .query("barks")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    if (!bark) return null;
    if (bark.status !== "public") {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || bark.authorClerkId !== clerkUserId(identity)) {
        return null;
      }
    }
    return await withResolvedEvidence(ctx, bark);
  },
});

async function barkByCode(ctx: QueryCtx | MutationCtx, code: string) {
  return await ctx.db
    .query("barks")
    .withIndex("by_code", (q) => q.eq("code", code))
    .unique();
}

const likeStateDoc = v.object({
  upvotes: v.number(),
  liked: v.boolean(),
});

const commentDoc = v.object({
  ...barkCommentFields,
  _id: v.id("barkComments"),
  _creationTime: v.number(),
  voiceUrl: v.union(v.string(), v.null()),
});

export const likeState = query({
  args: { code: v.string() },
  returns: v.union(likeStateDoc, v.null()),
  handler: async (ctx, args) => {
    const bark = await barkByCode(ctx, args.code);
    if (!bark) return null;
    const identity = await ctx.auth.getUserIdentity();
    let liked = false;
    if (identity) {
      const existing = await ctx.db
        .query("barkLikes")
        .withIndex("by_bark_user", (q) =>
          q.eq("barkId", bark._id).eq("clerkUserId", clerkUserId(identity))
        )
        .unique();
      liked = Boolean(existing);
    }
    return { upvotes: bark.upvotes, liked };
  },
});

export const toggleLike = mutation({
  args: { code: v.string() },
  returns: likeStateDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const bark = await barkByCode(ctx, args.code);
    if (!bark) throw new Error("Reaction not found");
    const clerkId = clerkUserId(identity);
    const existing = await ctx.db
      .query("barkLikes")
      .withIndex("by_bark_user", (q) =>
        q.eq("barkId", bark._id).eq("clerkUserId", clerkId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      const upvotes = Math.max(0, bark.upvotes - 1);
      await ctx.db.patch(bark._id, { upvotes });
      return { upvotes, liked: false };
    }
    await ctx.db.insert("barkLikes", {
      barkId: bark._id,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    const upvotes = bark.upvotes + 1;
    await ctx.db.patch(bark._id, { upvotes });
    return { upvotes, liked: true };
  },
});

const saveStateDoc = v.object({
  saved: v.boolean(),
  saves: v.number(),
});

export const saveState = query({
  args: { code: v.string() },
  returns: v.union(saveStateDoc, v.null()),
  handler: async (ctx, args) => {
    const bark = await barkByCode(ctx, args.code);
    if (!bark) return null;
    const identity = await ctx.auth.getUserIdentity();
    let saved = false;
    if (identity) {
      const existing = await ctx.db
        .query("barkSaves")
        .withIndex("by_bark_user", (q) =>
          q.eq("barkId", bark._id).eq("clerkUserId", clerkUserId(identity))
        )
        .unique();
      saved = Boolean(existing);
    }
    return { saved, saves: bark.saves };
  },
});

export const toggleSave = mutation({
  args: { code: v.string() },
  returns: saveStateDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const bark = await barkByCode(ctx, args.code);
    if (!bark) throw new Error("Reaction not found");
    const clerkId = clerkUserId(identity);
    const existing = await ctx.db
      .query("barkSaves")
      .withIndex("by_bark_user", (q) =>
        q.eq("barkId", bark._id).eq("clerkUserId", clerkId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      const saves = Math.max(0, bark.saves - 1);
      await ctx.db.patch(bark._id, { saves });
      return { saved: false, saves };
    }
    await ctx.db.insert("barkSaves", {
      barkId: bark._id,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    const saves = bark.saves + 1;
    await ctx.db.patch(bark._id, { saves });
    return { saved: true, saves };
  },
});

export const listMineSaved = query({
  args: {},
  returns: v.array(barkDoc),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const rows = await ctx.db
      .query("barkSaves")
      .withIndex("by_user", (q) =>
        q.eq("clerkUserId", clerkUserId(identity))
      )
      .take(50);
    rows.sort((a, b) => b.createdAt - a.createdAt);
    const result = [];
    for (const row of rows) {
      const bark = await ctx.db.get(row.barkId);
      if (bark && bark.status === "public") {
        result.push(await withResolvedEvidence(ctx, bark));
      }
    }
    return result;
  },
});

export const listComments = query({
  args: { code: v.string() },
  returns: v.array(commentDoc),
  handler: async (ctx, args) => {
    const bark = await barkByCode(ctx, args.code);
    if (!bark) return [];
    const rows = await ctx.db
      .query("barkComments")
      .withIndex("by_bark_created", (q) => q.eq("barkId", bark._id))
      .order("desc")
      .take(50);
    const result = [];
    for (const row of rows.reverse()) {
      const voiceUrl = row.voiceStorageId
        ? await ctx.storage.getUrl(row.voiceStorageId)
        : null;
      result.push({ ...row, voiceUrl: voiceUrl ?? null });
    }
    return result;
  },
});

export const addComment = mutation({
  args: {
    code: v.string(),
    body: v.string(),
    parentId: v.optional(v.id("barkComments")),
    stickerId: v.optional(barkStickerId),
    voiceStorageId: v.optional(v.id("_storage")),
    voiceDurationMs: v.optional(v.number()),
  },
  returns: v.id("barkComments"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const bark = await barkByCode(ctx, args.code);
    if (!bark) throw new Error("Reaction not found");
    const body = args.body.trim();
    if (args.voiceStorageId && args.voiceDurationMs === undefined) {
      throw new Error("Voice duration is required");
    }
    if (
      args.voiceDurationMs !== undefined &&
      (args.voiceDurationMs < 1 || args.voiceDurationMs > 60_000)
    ) {
      throw new Error("Voice notes must be 60 seconds or shorter");
    }
    if (!body && !args.stickerId && !args.voiceStorageId) {
      throw new Error("Write a comment, send a sticker, or record a voice note");
    }
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent || parent.barkId !== bark._id) {
        throw new Error("Reply target not found");
      }
      if (parent.parentId) {
        throw new Error("Replies can only be one level deep");
      }
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkUserId(identity)))
      .unique();
    const authorImageUrl = user?.imageUrl ?? identity.pictureUrl;
    const authorClerkId = clerkUserId(identity);
    const authorName =
      user?.name ||
      (typeof identity.name === "string" && identity.name) ||
      "Member";
    const commentId = await ctx.db.insert("barkComments", {
      barkId: bark._id,
      ...(args.parentId ? { parentId: args.parentId } : {}),
      body,
      authorClerkId,
      authorName,
      ...(authorImageUrl ? { authorImageUrl } : {}),
      ...(args.stickerId ? { stickerId: args.stickerId } : {}),
      ...(args.voiceStorageId
        ? {
            voiceStorageId: args.voiceStorageId,
            voiceDurationMs: args.voiceDurationMs,
          }
        : {}),
      createdAt: Date.now(),
    });
    await ctx.db.patch(bark._id, { replyCount: bark.replyCount + 1 });
    const href = `/barks/${bark.code}`;
    const snippet = body
      ? body.length > 140
        ? `${body.slice(0, 137)}…`
        : body
      : args.stickerId
        ? "Sent a sticker"
        : "Sent a voice note";
    const replyTargets = new Set<string>([bark.authorClerkId]);
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (parent) replyTargets.add(parent.authorClerkId);
    }
    await notifyMany(ctx, [...replyTargets], {
      actorClerkId: authorClerkId,
      category: "reply",
      title: `${authorName} replied to your reaction`,
      body: snippet,
      href,
    });
    const mentioned = await resolveBarkMentionRecipients(ctx, bark, body);
    await notifyMany(ctx, mentioned, {
      actorClerkId: authorClerkId,
      category: "mention",
      title: `${authorName} mentioned you`,
      body: snippet,
      href,
    });
    return commentId;
  },
});

export const submitReport = mutation({
  args: {
    code: v.string(),
    targetKind: v.union(v.literal("bark"), v.literal("comment")),
    targetId: v.string(),
    category: reportCategory,
    details: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const bark = await barkByCode(ctx, args.code);
    if (!bark) throw new Error("Reaction not found");
    if (args.targetKind === "comment") {
      const comment = await ctx.db.get(args.targetId as Id<"barkComments">);
      if (!comment || comment.barkId !== bark._id) {
        throw new Error("Comment not found");
      }
    }
    const targetLabel =
      args.targetKind === "comment" ? `${bark.code} comment` : bark.code;
    await ctx.db.insert("barkReports", {
      barkId: bark._id,
      targetKind: args.targetKind,
      targetId: args.targetId,
      category: args.category,
      details: args.details.trim(),
      reporterClerkId: clerkUserId(identity),
      createdAt: Date.now(),
    });
    await recordModerationEvent(ctx, {
      kind: "report",
      actorClerkId: clerkUserId(identity),
      actorName: "System",
      targetLabel,
      note: `Report filed: ${args.category}`,
    });
    return null;
  },
});

async function approvedCreatorFor(
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) {
  const rows = await ctx.db
    .query("creators")
    .withIndex("by_applicant", (q) => q.eq("applicantClerkId", clerkId))
    .take(20);
  return rows.find((row) => row.status === "approved") ?? null;
}

export const respondOfficially = mutation({
  args: {
    code: v.string(),
    content: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const content = args.content.trim();
    if (!content) throw new Error("Write an official response first");

    const bark = await barkByCode(ctx, args.code.trim().toUpperCase());
    if (!bark) throw new Error("Reaction not found");
    if (bark.creatorResponse) {
      throw new Error("This reaction already has an official response");
    }
    if (!bark.sourceCreatorId) {
      throw new Error("This reaction is not linked to a creator profile");
    }

    const creator = await approvedCreatorFor(ctx, clerkUserId(identity));
    if (!creator || creator._id !== bark.sourceCreatorId) {
      throw new Error("Only the named approved creator can respond");
    }

    const now = Date.now();
    await ctx.db.patch(bark._id, {
      creatorResponse: {
        content,
        respondedAt: now,
        verified: true,
      },
    });

    const newCount = (creator.officialResponseCount ?? 0) + 1;
    const responseRate =
      creator.totalBarksReceived > 0
        ? Math.min(
            100,
            Math.round((newCount / creator.totalBarksReceived) * 100)
          )
        : creator.responseRate;
    await ctx.db.patch(creator._id, {
      officialResponseCount: newCount,
      responseRate,
      updatedAt: now,
    });

    const snippet =
      content.length > 140 ? `${content.slice(0, 137)}…` : content;
    await notify(ctx, {
      recipientClerkId: bark.authorClerkId,
      category: "creator-response",
      title: `${creator.name} responded to ${bark.code}`,
      body: snippet,
      href: `/barks/${bark.code}`,
    });
    return null;
  },
});
