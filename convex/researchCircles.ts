import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { clerkUserId, requireIdentity } from "./lib/auth";
import {
  caseCategory,
  researchCircleFields,
  researchCircleMemberFields,
  researchCirclePostFields,
} from "./lib/validators";

const MAX_MEMBERS = 40;

const circleDoc = v.object({
  ...researchCircleFields,
  _id: v.id("researchCircles"),
  _creationTime: v.number(),
  memberCount: v.number(),
  myRole: v.union(v.literal("owner"), v.literal("member"), v.null()),
});

async function requireMember(
  ctx: QueryCtx | MutationCtx,
  circleId: Id<"researchCircles">,
  clerkId: string
) {
  const membership = await ctx.db
    .query("researchCircleMembers")
    .withIndex("by_circle_user", (q) =>
      q.eq("circleId", circleId).eq("clerkUserId", clerkId)
    )
    .unique();
  if (!membership) throw new Error("Not a member of this circle");
  return membership;
}

export const listMine = query({
  args: {},
  returns: v.array(circleDoc),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const me = clerkUserId(identity);
    const memberships = await ctx.db
      .query("researchCircleMembers")
      .withIndex("by_user", (q) => q.eq("clerkUserId", me))
      .take(40);
    const result = [];
    for (const membership of memberships) {
      const circle = await ctx.db.get(membership.circleId);
      if (!circle) continue;
      const members = await ctx.db
        .query("researchCircleMembers")
        .withIndex("by_circle_user", (q) => q.eq("circleId", circle._id))
        .take(MAX_MEMBERS);
      result.push({
        ...circle,
        memberCount: members.length,
        myRole: membership.role,
      });
    }
    return result.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { circleId: v.id("researchCircles") },
  returns: v.union(
    v.object({
      circle: circleDoc,
      members: v.array(
        v.object({
          ...researchCircleMemberFields,
          _id: v.id("researchCircleMembers"),
          _creationTime: v.number(),
          name: v.string(),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const me = clerkUserId(identity);
    const circle = await ctx.db.get(args.circleId);
    if (!circle) return null;
    const membership = await ctx.db
      .query("researchCircleMembers")
      .withIndex("by_circle_user", (q) =>
        q.eq("circleId", circle._id).eq("clerkUserId", me)
      )
      .unique();
    if (!membership) return null;

    const memberRows = await ctx.db
      .query("researchCircleMembers")
      .withIndex("by_circle_user", (q) => q.eq("circleId", circle._id))
      .take(MAX_MEMBERS);
    const members = [];
    for (const row of memberRows) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", row.clerkUserId))
        .unique();
      members.push({
        ...row,
        name: user?.name || row.clerkUserId.slice(0, 12),
      });
    }

    return {
      circle: {
        ...circle,
        memberCount: members.length,
        myRole: membership.role,
      },
      members,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    anchorKind: v.union(v.literal("case"), v.literal("topic")),
    caseCode: v.optional(v.string()),
    topic: v.optional(caseCategory),
  },
  returns: v.id("researchCircles"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const me = clerkUserId(identity);
    const name = args.name.trim();
    if (!name) throw new Error("Name is required");
    if (name.length > 80) throw new Error("Name is too long");
    const description = args.description?.trim();

    if (args.anchorKind === "case") {
      const code = args.caseCode?.trim().toUpperCase();
      if (!code) throw new Error("Case code is required");
      const accountabilityCase = await ctx.db
        .query("cases")
        .withIndex("by_code", (q) => q.eq("code", code))
        .unique();
      if (!accountabilityCase) throw new Error("Case not found");
    } else if (!args.topic) {
      throw new Error("Topic is required");
    }

    const circleId = await ctx.db.insert("researchCircles", {
      name,
      ...(description ? { description } : {}),
      anchorKind: args.anchorKind,
      ...(args.anchorKind === "case"
        ? { caseCode: args.caseCode!.trim().toUpperCase() }
        : { topic: args.topic }),
      ownerClerkId: me,
      createdAt: Date.now(),
    });

    await ctx.db.insert("researchCircleMembers", {
      circleId,
      clerkUserId: me,
      role: "owner",
      joinedAt: Date.now(),
    });

    return circleId;
  },
});

export const inviteByUsername = mutation({
  args: {
    circleId: v.id("researchCircles"),
    username: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const me = clerkUserId(identity);
    const membership = await requireMember(ctx, args.circleId, me);
    if (membership.role !== "owner") {
      throw new Error("Only the owner can invite members");
    }

    const members = await ctx.db
      .query("researchCircleMembers")
      .withIndex("by_circle_user", (q) => q.eq("circleId", args.circleId))
      .take(MAX_MEMBERS);
    if (members.length >= MAX_MEMBERS) {
      throw new Error("Circle is full (40 members)");
    }

    const username = args.username.trim();
    if (!username) throw new Error("Username is required");
    const lowered = username.toLowerCase();
    let user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", lowered))
      .unique();
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", username))
        .unique();
    }
    if (!user) throw new Error("User not found");
    if (user.clerkId === me) throw new Error("You are already a member");

    const existing = await ctx.db
      .query("researchCircleMembers")
      .withIndex("by_circle_user", (q) =>
        q.eq("circleId", args.circleId).eq("clerkUserId", user.clerkId)
      )
      .unique();
    if (existing) throw new Error("Already a member");

    await ctx.db.insert("researchCircleMembers", {
      circleId: args.circleId,
      clerkUserId: user.clerkId,
      role: "member",
      joinedAt: Date.now(),
    });
    return null;
  },
});

export const leave = mutation({
  args: { circleId: v.id("researchCircles") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const me = clerkUserId(identity);
    const membership = await requireMember(ctx, args.circleId, me);
    if (membership.role === "owner") {
      throw new Error("Owner cannot leave — transfer or delete the circle first");
    }
    await ctx.db.delete(membership._id);
    return null;
  },
});

export const remove = mutation({
  args: { circleId: v.id("researchCircles") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const me = clerkUserId(identity);
    const circle = await ctx.db.get(args.circleId);
    if (!circle || circle.ownerClerkId !== me) {
      throw new Error("Only the owner can delete this circle");
    }
    const members = await ctx.db
      .query("researchCircleMembers")
      .withIndex("by_circle_user", (q) => q.eq("circleId", args.circleId))
      .take(MAX_MEMBERS);
    for (const member of members) await ctx.db.delete(member._id);
    const posts = await ctx.db
      .query("researchCirclePosts")
      .withIndex("by_circle_created", (q) => q.eq("circleId", args.circleId))
      .take(200);
    for (const post of posts) await ctx.db.delete(post._id);
    await ctx.db.delete(circle._id);
    return null;
  },
});

const postDoc = v.object({
  ...researchCirclePostFields,
  _id: v.id("researchCirclePosts"),
  _creationTime: v.number(),
});

export const listPosts = query({
  args: { circleId: v.id("researchCircles") },
  returns: v.array(postDoc),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const me = clerkUserId(identity);
    const membership = await ctx.db
      .query("researchCircleMembers")
      .withIndex("by_circle_user", (q) =>
        q.eq("circleId", args.circleId).eq("clerkUserId", me)
      )
      .unique();
    if (!membership) return [];
    const posts = await ctx.db
      .query("researchCirclePosts")
      .withIndex("by_circle_created", (q) => q.eq("circleId", args.circleId))
      .order("desc")
      .take(80);
    return posts;
  },
});

export const addPost = mutation({
  args: {
    circleId: v.id("researchCircles"),
    body: v.string(),
  },
  returns: v.id("researchCirclePosts"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const me = clerkUserId(identity);
    await requireMember(ctx, args.circleId, me);
    const body = args.body.trim();
    if (!body) throw new Error("Write a post first");
    if (body.length > 4000) throw new Error("Post is too long");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", me))
      .unique();
    const authorName =
      user?.name ||
      (typeof identity.name === "string" && identity.name) ||
      "Member";
    return await ctx.db.insert("researchCirclePosts", {
      circleId: args.circleId,
      authorClerkId: me,
      authorName,
      body,
      createdAt: Date.now(),
    });
  },
});
