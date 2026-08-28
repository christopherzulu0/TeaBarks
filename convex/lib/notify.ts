import type { Infer } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { notificationCategory } from "./validators";

type NotificationCategory = Infer<typeof notificationCategory>;

type NotifyInput = {
  recipientClerkId: string;
  actorClerkId?: string;
  category: NotificationCategory;
  title: string;
  body: string;
  href: string;
};

const PREF_KEY: Record<
  NotificationCategory,
  | "reply"
  | "mention"
  | "follower"
  | "creatorResponse"
  | "evidence"
  | "verification"
  | "message"
> = {
  reply: "reply",
  mention: "mention",
  follower: "follower",
  "creator-response": "creatorResponse",
  evidence: "evidence",
  verification: "verification",
  message: "message",
};

function defaultPrefs(clerkUserId: string) {
  return {
    clerkUserId,
    reply: true,
    mention: true,
    follower: true,
    creatorResponse: true,
    evidence: true,
    verification: true,
    soundEnabled: true,
    digestWeekly: true,
    digestCaseEmail: true,
    message: true,
    unreadCount: 0,
  };
}

export async function getPrefsRow(
  ctx: QueryCtx | MutationCtx,
  clerkUserId: string
) {
  return await ctx.db
    .query("notificationPrefs")
    .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
}

export function prefsOrDefault(
  clerkUserId: string,
  row: Doc<"notificationPrefs"> | null
) {
  if (!row) return defaultPrefs(clerkUserId);
  return {
    clerkUserId: row.clerkUserId,
    reply: row.reply,
    mention: row.mention,
    follower: row.follower,
    creatorResponse: row.creatorResponse,
    evidence: row.evidence,
    verification: row.verification,
    soundEnabled: row.soundEnabled,
    digestWeekly: row.digestWeekly,
    digestCaseEmail: row.digestCaseEmail,
    message: row.message ?? true,
    unreadCount: row.unreadCount,
  };
}

export async function displayName(
  ctx: QueryCtx | MutationCtx,
  clerkId: string,
  fallback = "Someone"
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
  const name = user?.name?.trim();
  return name || fallback;
}

export function slugifyMentionHandle(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24) || "member";
  return base;
}

export function parseMentionHandles(text: string) {
  const found = new Set<string>();
  const matches = text.matchAll(/@([a-zA-Z0-9_]{2,32})/g);
  for (const match of matches) {
    found.add(match[1].toLowerCase());
  }
  return [...found];
}

async function approvedProfileFor(
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) {
  const creators = await ctx.db
    .query("creators")
    .withIndex("by_applicant", (q) => q.eq("applicantClerkId", clerkId))
    .take(20);
  const creator = creators.find((row) => row.status === "approved");
  if (creator) {
    return {
      handle: creator.handle,
      name: creator.name,
      kind: "creator" as const,
      href: `/creators/${creator.handle}`,
    };
  }
  const writers = await ctx.db
    .query("writers")
    .withIndex("by_applicant", (q) => q.eq("applicantClerkId", clerkId))
    .take(20);
  const writer = writers.find((row) => row.status === "approved");
  if (writer) {
    return {
      handle: writer.handle,
      name: writer.penName,
      kind: "writer" as const,
      href: "",
    };
  }
  return null;
}

export async function resolveMentionRecipients(
  ctx: MutationCtx,
  body: string
) {
  const recipients = new Set<string>();
  for (const handle of parseMentionHandles(body)) {
    const creator = await ctx.db
      .query("creators")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .unique();
    if (creator?.applicantClerkId) recipients.add(creator.applicantClerkId);
    const writer = await ctx.db
      .query("writers")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .unique();
    if (writer?.applicantClerkId) recipients.add(writer.applicantClerkId);
  }
  return [...recipients];
}

export async function resolveBarkMentionRecipients(
  ctx: MutationCtx,
  bark: Doc<"barks">,
  body: string
) {
  const recipients = new Set(await resolveMentionRecipients(ctx, body));
  const handles = new Set(parseMentionHandles(body));
  if (handles.size === 0) return [...recipients];

  const comments = await ctx.db
    .query("barkComments")
    .withIndex("by_bark_created", (q) => q.eq("barkId", bark._id))
    .take(50);
  const people = new Map<string, string>();
  people.set(bark.authorClerkId, bark.authorName);
  for (const comment of comments) {
    if (!people.has(comment.authorClerkId)) {
      people.set(comment.authorClerkId, comment.authorName);
    }
  }

  for (const [clerkId, name] of people) {
    const profile = await approvedProfileFor(ctx, clerkId);
    const aliases = new Set<string>([slugifyMentionHandle(name)]);
    if (profile) aliases.add(profile.handle.toLowerCase());
    for (const alias of aliases) {
      if (handles.has(alias)) recipients.add(clerkId);
    }
  }
  return [...recipients].slice(0, 50);
}

export async function caseAudienceClerkIds(
  ctx: MutationCtx,
  accountabilityCase: Doc<"cases">
) {
  const ids = new Set<string>();
  ids.add(accountabilityCase.openedByClerkId);
  const follows = await ctx.db
    .query("caseFollows")
    .withIndex("by_case", (q) => q.eq("caseId", accountabilityCase._id))
    .take(50);
  for (const row of follows) ids.add(row.clerkUserId);
  if (accountabilityCase.creatorHandle) {
    const creator = await ctx.db
      .query("creators")
      .withIndex("by_handle", (q) =>
        q.eq("handle", accountabilityCase.creatorHandle)
      )
      .unique();
    if (creator?.applicantClerkId) ids.add(creator.applicantClerkId);
  }
  return [...ids].slice(0, 50);
}

export async function notify(ctx: MutationCtx, input: NotifyInput) {
  const recipientClerkId = input.recipientClerkId.trim();
  if (!recipientClerkId) return;
  if (input.actorClerkId && input.actorClerkId === recipientClerkId) return;

  let prefs = await getPrefsRow(ctx, recipientClerkId);
  const enabled = prefs
    ? Boolean(prefs[PREF_KEY[input.category]] ?? true)
    : true;
  if (!enabled) return;

  const createdAt = Date.now();
  await ctx.db.insert("notifications", {
    recipientClerkId,
    ...(input.actorClerkId ? { actorClerkId: input.actorClerkId } : {}),
    category: input.category,
    title: input.title,
    body: input.body.slice(0, 280),
    href: input.href,
    read: false,
    createdAt,
  });

  if (prefs) {
    await ctx.db.patch(prefs._id, { unreadCount: prefs.unreadCount + 1 });
  } else {
    await ctx.db.insert("notificationPrefs", {
      ...defaultPrefs(recipientClerkId),
      unreadCount: 1,
    });
  }
}

export async function notifyMany(
  ctx: MutationCtx,
  recipientClerkIds: string[],
  input: Omit<NotifyInput, "recipientClerkId">
) {
  const unique = [...new Set(recipientClerkIds)].slice(0, 50);
  for (const recipientClerkId of unique) {
    await notify(ctx, { ...input, recipientClerkId });
  }
}
