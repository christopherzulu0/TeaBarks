import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { displayName, notify } from "./lib/notify";

const authorFollowStateDoc = v.object({
  following: v.boolean(),
});

const followedAuthor = v.object({
  clerkUserId: v.string(),
  name: v.string(),
  imageUrl: v.union(v.string(), v.null()),
  evidenceScore: v.number(),
});

export const authorFollowState = query({
  args: { authorClerkId: v.string() },
  returns: authorFollowStateDoc,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { following: false };
    const existing = await ctx.db
      .query("userFollows")
      .withIndex("by_target_user", (q) =>
        q
          .eq("targetClerkId", args.authorClerkId)
          .eq("clerkUserId", clerkUserId(identity))
      )
      .unique();
    return { following: Boolean(existing) };
  },
});

export const toggleFollowAuthor = mutation({
  args: { authorClerkId: v.string() },
  returns: authorFollowStateDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const clerkId = clerkUserId(identity);
    if (!args.authorClerkId) throw new Error("Author is required");
    if (args.authorClerkId === clerkId) {
      throw new Error("You cannot follow yourself");
    }
    const existing = await ctx.db
      .query("userFollows")
      .withIndex("by_target_user", (q) =>
        q
          .eq("targetClerkId", args.authorClerkId)
          .eq("clerkUserId", clerkId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { following: false };
    }
    await ctx.db.insert("userFollows", {
      targetClerkId: args.authorClerkId,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    const actorName = await displayName(ctx, clerkId, "Someone");
    await notify(ctx, {
      recipientClerkId: args.authorClerkId,
      actorClerkId: clerkId,
      category: "follower",
      title: `${actorName} started following you`,
      body: `${actorName} is now following your barks.`,
      href: `/profile/${clerkId}`,
    });
    return { following: true };
  },
});

export const listMineAuthors = query({
  args: {},
  returns: v.array(followedAuthor),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const rows = await ctx.db
      .query("userFollows")
      .withIndex("by_user", (q) =>
        q.eq("clerkUserId", clerkUserId(identity))
      )
      .take(20);
    const result = [];
    for (const row of rows) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", row.targetClerkId))
        .unique();
      const barks = await ctx.db
        .query("barks")
        .withIndex("by_author_status_publishedAt", (q) =>
          q.eq("authorClerkId", row.targetClerkId).eq("status", "public")
        )
        .take(20);
      const evidenceScore =
        barks.length === 0
          ? 0
          : Math.round(
              barks.reduce((sum, bark) => sum + bark.evidenceRating, 0) /
                barks.length
            );
      result.push({
        clerkUserId: row.targetClerkId,
        name: user?.name || barks[0]?.authorName || "Member",
        imageUrl: user?.imageUrl ?? barks[0]?.authorImageUrl ?? null,
        evidenceScore,
      });
    }
    return result;
  },
});
