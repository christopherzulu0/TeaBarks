import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { displayName, notifyMany } from "./lib/notify";
import { messageSubjectKind } from "./lib/validators";

const inboxItem = v.object({
  threadId: v.id("messageThreads"),
  otherClerkId: v.string(),
  otherName: v.string(),
  otherImageUrl: v.union(v.string(), v.null()),
  subjectKind: messageSubjectKind,
  subjectTitle: v.string(),
  subjectHref: v.string(),
  lastPreview: v.string(),
  lastMessageAt: v.number(),
  unreadCount: v.number(),
});

const messageItem = v.object({
  _id: v.id("messages"),
  senderClerkId: v.string(),
  body: v.string(),
  createdAt: v.number(),
  mine: v.boolean(),
  read: v.boolean(),
});

function pairKey(
  clerkA: string,
  clerkB: string,
  kind: "bark" | "case" | "creator",
  subjectId: string
) {
  const [left, right] = clerkA < clerkB ? [clerkA, clerkB] : [clerkB, clerkA];
  return `${left}:${right}:${kind}:${subjectId}`;
}

function previewOf(body: string) {
  const text = body.trim();
  return text.length > 140 ? `${text.slice(0, 137)}…` : text;
}

async function membershipFor(
  ctx: QueryCtx | MutationCtx,
  threadId: Id<"messageThreads">,
  clerkUserIdValue: string
) {
  return await ctx.db
    .query("messageMemberships")
    .withIndex("by_thread_user", (q) =>
      q.eq("threadId", threadId).eq("clerkUserId", clerkUserIdValue)
    )
    .unique();
}

async function subjectMeta(
  ctx: QueryCtx | MutationCtx,
  thread: {
    subjectKind: "bark" | "case" | "creator";
    barkId?: Id<"barks">;
    caseId?: Id<"cases">;
    creatorId?: Id<"creators">;
  }
) {
  if (thread.subjectKind === "bark" && thread.barkId) {
    const bark = await ctx.db.get(thread.barkId);
    if (bark) {
      return {
        subjectTitle: bark.title,
        subjectHref: `/barks/${bark.code}`,
      };
    }
    return { subjectTitle: "Deleted reaction", subjectHref: "/barks" };
  }
  if (thread.subjectKind === "case" && thread.caseId) {
    const accountabilityCase = await ctx.db.get(thread.caseId);
    if (accountabilityCase) {
      return {
        subjectTitle: accountabilityCase.title,
        subjectHref: `/cases/${accountabilityCase.code}`,
      };
    }
    return { subjectTitle: "Deleted case", subjectHref: "/cases" };
  }
  if (thread.subjectKind === "creator" && thread.creatorId) {
    const creator = await ctx.db.get(thread.creatorId);
    if (creator) {
      return {
        subjectTitle: creator.name,
        subjectHref: `/creators/${creator.handle}`,
      };
    }
    return { subjectTitle: "Deleted creator", subjectHref: "/creators" };
  }
  return { subjectTitle: "Conversation", subjectHref: "/messages" };
}

async function resolveOtherParty(
  ctx: MutationCtx,
  me: string,
  args: {
    kind: "bark" | "case" | "creator";
    barkCode?: string;
    caseCode?: string;
    creatorHandle?: string;
  }
) {
  if (args.kind === "bark") {
    const code = args.barkCode?.trim();
    if (!code) throw new Error("Reaction ID is required");
    const bark = await ctx.db
      .query("barks")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    if (!bark || bark.status !== "public") throw new Error("Reaction not found");
    return {
      otherClerkId: bark.authorClerkId,
      barkId: bark._id,
      subjectId: bark._id as string,
    };
  }
  if (args.kind === "creator") {
    const handle = args.creatorHandle?.trim();
    if (!handle) throw new Error("Creator handle is required");
    const creator = await ctx.db
      .query("creators")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .unique();
    if (!creator || creator.status !== "approved") {
      throw new Error("Creator not found");
    }
    return {
      otherClerkId: creator.applicantClerkId,
      creatorId: creator._id,
      subjectId: creator._id as string,
    };
  }
  const code = args.caseCode?.trim();
  if (!code) throw new Error("Case code is required");
  const accountabilityCase = await ctx.db
    .query("cases")
    .withIndex("by_code", (q) => q.eq("code", code))
    .unique();
  if (!accountabilityCase) throw new Error("Case not found");
  let otherClerkId = accountabilityCase.openedByClerkId;
  if (otherClerkId === me) {
    if (!accountabilityCase.creatorHandle) {
      throw new Error("This case has no creator to message");
    }
    const creator = await ctx.db
      .query("creators")
      .withIndex("by_handle", (q) =>
        q.eq("handle", accountabilityCase.creatorHandle)
      )
      .unique();
    if (!creator?.applicantClerkId) {
      throw new Error("This case has no creator to message");
    }
    otherClerkId = creator.applicantClerkId;
  }
  return {
    otherClerkId,
    caseId: accountabilityCase._id,
    subjectId: accountabilityCase._id as string,
  };
}

export const listMine = query({
  args: {},
  returns: v.array(inboxItem),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const clerkId = clerkUserId(identity);
    const rows = await ctx.db
      .query("messageMemberships")
      .withIndex("by_user_last", (q) => q.eq("clerkUserId", clerkId))
      .order("desc")
      .take(50);
    const result = [];
    for (const row of rows) {
      const thread = await ctx.db.get(row.threadId);
      if (!thread) continue;
      const other = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", row.otherClerkId))
        .unique();
      const subject = await subjectMeta(ctx, thread);
      result.push({
        threadId: row.threadId,
        otherClerkId: row.otherClerkId,
        otherName: other?.name?.trim() || "Member",
        otherImageUrl: other?.imageUrl ?? null,
        subjectKind: thread.subjectKind,
        subjectTitle: subject.subjectTitle,
        subjectHref: subject.subjectHref,
        lastPreview: row.lastPreview,
        lastMessageAt: row.lastMessageAt,
        unreadCount: row.unreadCount,
      });
    }
    return result;
  },
});

export const listMessages = query({
  args: { threadId: v.id("messageThreads") },
  returns: v.array(messageItem),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const clerkId = clerkUserId(identity);
    const mine = await membershipFor(ctx, args.threadId, clerkId);
    if (!mine) return [];
    const other = await membershipFor(ctx, args.threadId, mine.otherClerkId);
    const otherReadAt = other?.lastReadAt ?? 0;
    const rows = await ctx.db
      .query("messages")
      .withIndex("by_thread_created", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .take(50);
    return rows.reverse().map((row) => ({
      _id: row._id,
      senderClerkId: row.senderClerkId,
      body: row.body,
      createdAt: row.createdAt,
      mine: row.senderClerkId === clerkId,
      read: row.senderClerkId === clerkId && otherReadAt >= row.createdAt,
    }));
  },
});

export const unreadCount = query({
  args: {},
  returns: v.object({ count: v.number() }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { count: 0 };
    const rows = await ctx.db
      .query("messageMemberships")
      .withIndex("by_user_last", (q) =>
        q.eq("clerkUserId", clerkUserId(identity))
      )
      .order("desc")
      .take(50);
    let count = 0;
    for (const row of rows) count += row.unreadCount;
    return { count };
  },
});

export const startOrOpen = mutation({
  args: {
    kind: messageSubjectKind,
    barkCode: v.optional(v.string()),
    caseCode: v.optional(v.string()),
    creatorHandle: v.optional(v.string()),
  },
  returns: v.id("messageThreads"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const me = clerkUserId(identity);
    const resolved = await resolveOtherParty(ctx, me, args);
    if (resolved.otherClerkId === me) {
      throw new Error("You cannot message yourself");
    }
    const key = pairKey(me, resolved.otherClerkId, args.kind, resolved.subjectId);
    const existing = await ctx.db
      .query("messageThreads")
      .withIndex("by_pairKey", (q) => q.eq("pairKey", key))
      .unique();
    if (existing) return existing._id;
    const now = Date.now();
    const [clerkA, clerkB] =
      me < resolved.otherClerkId
        ? [me, resolved.otherClerkId]
        : [resolved.otherClerkId, me];
    const threadId = await ctx.db.insert("messageThreads", {
      pairKey: key,
      subjectKind: args.kind,
      ...(resolved.barkId ? { barkId: resolved.barkId } : {}),
      ...(resolved.caseId ? { caseId: resolved.caseId } : {}),
      ...(resolved.creatorId ? { creatorId: resolved.creatorId } : {}),
      clerkA,
      clerkB,
      lastMessageAt: now,
      lastPreview: "",
    });
    await ctx.db.insert("messageMemberships", {
      threadId,
      clerkUserId: me,
      otherClerkId: resolved.otherClerkId,
      lastMessageAt: now,
      lastPreview: "",
      unreadCount: 0,
      lastReadAt: now,
    });
    await ctx.db.insert("messageMemberships", {
      threadId,
      clerkUserId: resolved.otherClerkId,
      otherClerkId: me,
      lastMessageAt: now,
      lastPreview: "",
      unreadCount: 0,
      lastReadAt: 0,
    });
    return threadId;
  },
});

export const send = mutation({
  args: {
    threadId: v.id("messageThreads"),
    body: v.string(),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const me = clerkUserId(identity);
    const body = args.body.trim();
    if (!body) throw new Error("Write a message first");
    const mine = await membershipFor(ctx, args.threadId, me);
    if (!mine) throw new Error("Thread not found");
    const other = await membershipFor(ctx, args.threadId, mine.otherClerkId);
    if (!other) throw new Error("Thread not found");
    const now = Date.now();
    const preview = previewOf(body);
    const messageId = await ctx.db.insert("messages", {
      threadId: args.threadId,
      senderClerkId: me,
      body,
      createdAt: now,
    });
    await ctx.db.patch(args.threadId, {
      lastMessageAt: now,
      lastPreview: preview,
    });
    await ctx.db.patch(mine._id, {
      lastMessageAt: now,
      lastPreview: preview,
      unreadCount: 0,
      lastReadAt: now,
    });
    await ctx.db.patch(other._id, {
      lastMessageAt: now,
      lastPreview: preview,
      unreadCount: other.unreadCount + 1,
    });
    const actorName = await displayName(ctx, me, "Someone");
    await notifyMany(ctx, [mine.otherClerkId], {
      actorClerkId: me,
      category: "message",
      title: `${actorName} sent you a message`,
      body: preview,
      href: `/messages?c=${args.threadId}`,
    });
    return messageId;
  },
});

export const markRead = mutation({
  args: { threadId: v.id("messageThreads") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const mine = await membershipFor(
      ctx,
      args.threadId,
      clerkUserId(identity)
    );
    if (!mine) throw new Error("Thread not found");
    if (mine.unreadCount === 0 && mine.lastReadAt > 0) return null;
    await ctx.db.patch(mine._id, {
      unreadCount: 0,
      lastReadAt: Date.now(),
    });
    return null;
  },
});
