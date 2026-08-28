import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { sourcePlatform, sourceSaveFields } from "./lib/validators";

const sourceSaveDoc = v.object({
  ...sourceSaveFields,
  _id: v.id("sourceSaves"),
  _creationTime: v.number(),
});

const sourceSaveStateDoc = v.object({
  saved: v.boolean(),
});

export const sourceSaveState = query({
  args: { sourceUrl: v.string() },
  returns: sourceSaveStateDoc,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !args.sourceUrl) return { saved: false };
    const existing = await ctx.db
      .query("sourceSaves")
      .withIndex("by_user_url", (q) =>
        q
          .eq("clerkUserId", clerkUserId(identity))
          .eq("sourceUrl", args.sourceUrl)
      )
      .unique();
    return { saved: Boolean(existing) };
  },
});

export const toggleSaveSource = mutation({
  args: {
    sourceUrl: v.string(),
    sourceTitle: v.string(),
    sourcePlatform,
    sourceCreatorName: v.string(),
    sourceThumbnailUrl: v.optional(v.string()),
  },
  returns: sourceSaveStateDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const clerkId = clerkUserId(identity);
    const sourceUrl = args.sourceUrl.trim();
    if (!sourceUrl) throw new Error("Source URL is required");
    const existing = await ctx.db
      .query("sourceSaves")
      .withIndex("by_user_url", (q) =>
        q.eq("clerkUserId", clerkId).eq("sourceUrl", sourceUrl)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    }
    const thumbnail = args.sourceThumbnailUrl?.trim();
    await ctx.db.insert("sourceSaves", {
      clerkUserId: clerkId,
      sourceUrl,
      sourceTitle: args.sourceTitle.trim() || sourceUrl,
      sourcePlatform: args.sourcePlatform,
      sourceCreatorName: args.sourceCreatorName.trim() || "Unknown",
      ...(thumbnail ? { sourceThumbnailUrl: thumbnail } : {}),
      createdAt: Date.now(),
    });
    return { saved: true };
  },
});

export const listMineSources = query({
  args: {},
  returns: v.array(sourceSaveDoc),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const rows = await ctx.db
      .query("sourceSaves")
      .withIndex("by_user", (q) =>
        q.eq("clerkUserId", clerkUserId(identity))
      )
      .take(50);
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});
