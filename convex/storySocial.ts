import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { recordModerationEvent } from "./lib/moderation";
import {
  displayName,
  notify,
  notifyMany,
  resolveMentionRecipients,
} from "./lib/notify";
import {
  reportCategory,
  storyCommentFields,
} from "./lib/validators";

const likeStateDoc = v.object({
  votes: v.number(),
  liked: v.boolean(),
});

const followStateDoc = v.object({
  followers: v.number(),
  following: v.boolean(),
});

const commentDoc = v.object({
  ...storyCommentFields,
  _id: v.id("storyComments"),
  _creationTime: v.number(),
});

async function storyBySlug(ctx: QueryCtx | MutationCtx, slug: string) {
  return await ctx.db
    .query("stories")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
}

export const likeState = query({
  args: { slug: v.string() },
  returns: v.union(likeStateDoc, v.null()),
  handler: async (ctx, args) => {
    const story = await storyBySlug(ctx, args.slug);
    if (!story) return null;
    const identity = await ctx.auth.getUserIdentity();
    let liked = false;
    if (identity) {
      const existing = await ctx.db
        .query("storyLikes")
        .withIndex("by_story_user", (q) =>
          q.eq("storyId", story._id).eq("clerkUserId", clerkUserId(identity))
        )
        .unique();
      liked = Boolean(existing);
    }
    return { votes: story.votes, liked };
  },
});

export const toggleLike = mutation({
  args: { slug: v.string() },
  returns: likeStateDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const story = await storyBySlug(ctx, args.slug);
    if (!story) throw new Error("Story not found");
    const clerkId = clerkUserId(identity);
    const existing = await ctx.db
      .query("storyLikes")
      .withIndex("by_story_user", (q) =>
        q.eq("storyId", story._id).eq("clerkUserId", clerkId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      const votes = Math.max(0, story.votes - 1);
      await ctx.db.patch(story._id, { votes });
      return { votes, liked: false };
    }
    await ctx.db.insert("storyLikes", {
      storyId: story._id,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    const votes = story.votes + 1;
    await ctx.db.patch(story._id, { votes });
    return { votes, liked: true };
  },
});

export const followState = query({
  args: { writerId: v.id("writers") },
  returns: v.union(followStateDoc, v.null()),
  handler: async (ctx, args) => {
    const writer = await ctx.db.get(args.writerId);
    if (!writer) return null;
    const identity = await ctx.auth.getUserIdentity();
    let following = false;
    if (identity) {
      const existing = await ctx.db
        .query("storyWriterFollows")
        .withIndex("by_writer_user", (q) =>
          q
            .eq("writerId", args.writerId)
            .eq("clerkUserId", clerkUserId(identity))
        )
        .unique();
      following = Boolean(existing);
    }
    return { followers: writer.followers ?? 0, following };
  },
});

export const toggleFollowWriter = mutation({
  args: { writerId: v.id("writers") },
  returns: followStateDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const writer = await ctx.db.get(args.writerId);
    if (!writer) throw new Error("Writer not found");
    const clerkId = clerkUserId(identity);
    const existing = await ctx.db
      .query("storyWriterFollows")
      .withIndex("by_writer_user", (q) =>
        q.eq("writerId", args.writerId).eq("clerkUserId", clerkId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      const followers = Math.max(0, (writer.followers ?? 0) - 1);
      await ctx.db.patch(args.writerId, { followers });
      return { followers, following: false };
    }
    await ctx.db.insert("storyWriterFollows", {
      writerId: args.writerId,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    const followers = (writer.followers ?? 0) + 1;
    await ctx.db.patch(args.writerId, { followers });
    const actorName = await displayName(ctx, clerkId, "Someone");
    await notify(ctx, {
      recipientClerkId: writer.applicantClerkId,
      actorClerkId: clerkId,
      category: "follower",
      title: `${actorName} started following you`,
      body: "A new reader followed you on Stories.",
      href: "/stories/dashboard",
    });
    return { followers, following: true };
  },
});

export const listComments = query({
  args: {
    slug: v.string(),
    chapterNumber: v.optional(v.number()),
  },
  returns: v.array(commentDoc),
  handler: async (ctx, args) => {
    const story = await storyBySlug(ctx, args.slug);
    if (!story) return [];
    const rows = await ctx.db
      .query("storyComments")
      .withIndex("by_story_created", (q) => q.eq("storyId", story._id))
      .order("desc")
      .take(50);
    const filtered =
      args.chapterNumber === undefined
        ? rows
        : rows.filter((row) => row.chapterNumber === args.chapterNumber);
    return filtered.reverse();
  },
});

export const addComment = mutation({
  args: {
    slug: v.string(),
    body: v.string(),
    parentId: v.optional(v.id("storyComments")),
    chapterNumber: v.optional(v.number()),
  },
  returns: v.id("storyComments"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const story = await storyBySlug(ctx, args.slug);
    if (!story || story.visibility !== "public") {
      throw new Error("Story not found");
    }
    const body = args.body.trim();
    if (!body) throw new Error("Write a comment first");
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent || parent.storyId !== story._id) {
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
    const authorClerkId = clerkUserId(identity);
    const authorName =
      user?.name ||
      (typeof identity.name === "string" && identity.name) ||
      "Member";
    const commentId = await ctx.db.insert("storyComments", {
      storyId: story._id,
      ...(args.chapterNumber !== undefined
        ? { chapterNumber: args.chapterNumber }
        : {}),
      ...(args.parentId ? { parentId: args.parentId } : {}),
      body,
      authorClerkId,
      authorName,
      createdAt: Date.now(),
    });
    await ctx.db.patch(story._id, { commentCount: story.commentCount + 1 });
    const href = `/stories/${story.slug}`;
    const snippet = body.length > 140 ? `${body.slice(0, 137)}…` : body;
    const replyTargets = new Set<string>([story.authorClerkId]);
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (parent) replyTargets.add(parent.authorClerkId);
    }
    await notifyMany(ctx, [...replyTargets], {
      actorClerkId: authorClerkId,
      category: "reply",
      title: `${authorName} commented on ${story.title}`,
      body: snippet,
      href,
    });
    const mentioned = await resolveMentionRecipients(ctx, body);
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
    slug: v.string(),
    category: reportCategory,
    details: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const story = await storyBySlug(ctx, args.slug);
    if (!story) throw new Error("Story not found");
    await ctx.db.insert("storyReports", {
      storyId: story._id,
      category: args.category,
      details: args.details.trim(),
      reporterClerkId: clerkUserId(identity),
      createdAt: Date.now(),
    });
    await recordModerationEvent(ctx, {
      kind: "report",
      actorClerkId: clerkUserId(identity),
      actorName: "System",
      targetLabel: story.title,
      note: `Report filed: ${args.category}`,
    });
    return null;
  },
});

export const recordView = mutation({
  args: { slug: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const story = await storyBySlug(ctx, args.slug);
    if (!story || story.visibility !== "public") return null;
    const clerkId = clerkUserId(identity);
    if (clerkId === story.authorClerkId) return null;
    const existing = await ctx.db
      .query("storyReads")
      .withIndex("by_story_user", (q) =>
        q.eq("storyId", story._id).eq("clerkUserId", clerkId)
      )
      .unique();
    if (existing) return null;
    await ctx.db.insert("storyReads", {
      storyId: story._id,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    await ctx.db.patch(story._id, { reads: story.reads + 1 });
    return null;
  },
});
