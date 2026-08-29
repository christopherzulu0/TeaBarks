import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { recordModerationEvent } from "./lib/moderation";
import { displayName, notify } from "./lib/notify";
import {
  creatorDocFields,
  creatorVerificationMethod,
  sourcePlatform,
} from "./lib/validators";

const creatorDoc = v.object({
  ...creatorDocFields,
  _id: v.id("creators"),
  _creationTime: v.number(),
});

const publicCreatorStatuses = new Set(["approved", "unclaimed"]);

function isPublicCreator(creator: Doc<"creators">) {
  return publicCreatorStatuses.has(creator.status);
}

function slugifyHandle(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24) || "creator";
  return base;
}

async function findByExternalIdentity(
  ctx: QueryCtx | MutationCtx,
  platform: Doc<"creators">["externalPlatform"],
  externalHandle: string
) {
  if (!platform) return null;
  return await ctx.db
    .query("creators")
    .withIndex("by_external_identity", (q) =>
      q.eq("externalPlatform", platform).eq("externalHandle", externalHandle)
    )
    .unique();
}

async function allocateUniqueHandle(ctx: QueryCtx | MutationCtx, baseHandle: string) {
  let handle = baseHandle.slice(0, 24) || "creator";
  for (let attempt = 0; attempt < 12; attempt++) {
    const taken = await ctx.db
      .query("creators")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .unique();
    if (!taken) return handle;
    handle = `${baseHandle.slice(0, 20)}${attempt + 2}`;
  }
  throw new Error("Could not allocate a unique handle");
}

async function allocateUnclaimedApplicationCode(ctx: MutationCtx) {
  const year = new Date().getUTCFullYear();
  for (let attempt = 0; attempt < 8; attempt++) {
    const n = 1000 + Math.floor(Math.random() * 9000);
    const candidate = `UNC-${year}-${String(n).padStart(4, "0")}`;
    const clash = await ctx.db
      .query("creators")
      .withIndex("by_applicationCode", (q) =>
        q.eq("applicationCode", candidate)
      )
      .unique();
    if (!clash) return candidate;
  }
  throw new Error("Could not allocate an unclaimed application code");
}

export const apply = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    country: v.string(),
    category: v.string(),
    platforms: v.array(sourcePlatform),
    officialLinks: v.array(
      v.object({
        label: v.string(),
        url: v.string(),
      })
    ),
    verificationMethod: creatorVerificationMethod,
    upgradeCreatorId: v.optional(v.id("creators")),
  },
  returns: v.object({ applicationCode: v.string() }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const applicantClerkId = clerkUserId(identity);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", applicantClerkId))
      .unique();

    const name = args.name.trim();
    if (!name) throw new Error("Public name is required");
    if (!args.category.trim()) throw new Error("Choose a content category");
    if (args.platforms.length === 0) {
      throw new Error("Select at least one platform");
    }

    const existing = await ctx.db
      .query("creators")
      .withIndex("by_applicant", (q) =>
        q.eq("applicantClerkId", applicantClerkId)
      )
      .take(20);
    if (existing.some((row) => row.status === "pending")) {
      throw new Error("You already have an application under review");
    }
    if (existing.some((row) => row.status === "approved")) {
      throw new Error("You already have an approved creator profile");
    }

    const filteredLinks = args.officialLinks.filter((link) => link.url.trim());
    const now = Date.now();
    const applicantName =
      user?.name ||
      (typeof identity.name === "string" && identity.name) ||
      name;

    if (args.upgradeCreatorId) {
      const stub = await ctx.db.get(args.upgradeCreatorId);
      if (!stub || stub.status !== "unclaimed") {
        throw new Error("Unclaimed profile not found");
      }
      const year = new Date().getUTCFullYear();
      let applicationCode = stub.applicationCode;
      if (!applicationCode.startsWith("APP-")) {
        for (let attempt = 0; attempt < 8; attempt++) {
          const n = 1000 + Math.floor(Math.random() * 9000);
          const candidate = `APP-${year}-${String(n).padStart(4, "0")}`;
          const clash = await ctx.db
            .query("creators")
            .withIndex("by_applicationCode", (q) =>
              q.eq("applicationCode", candidate)
            )
            .unique();
          if (!clash) {
            applicationCode = candidate;
            break;
          }
        }
      }

      await ctx.db.patch(stub._id, {
        applicationCode,
        name,
        bio: args.bio.trim(),
        country: args.country.trim() || "US",
        category: args.category.trim(),
        platforms: args.platforms,
        officialLinks: filteredLinks,
        verificationMethod: args.verificationMethod,
        applicantClerkId,
        applicantName,
        status: "pending",
        updatedAt: now,
      });
      return { applicationCode };
    }

    const year = new Date().getUTCFullYear();
    let applicationCode = "";
    for (let attempt = 0; attempt < 8; attempt++) {
      const n = 1000 + Math.floor(Math.random() * 9000);
      const candidate = `APP-${year}-${String(n).padStart(4, "0")}`;
      const clash = await ctx.db
        .query("creators")
        .withIndex("by_applicationCode", (q) =>
          q.eq("applicationCode", candidate)
        )
        .unique();
      if (!clash) {
        applicationCode = candidate;
        break;
      }
    }
    if (!applicationCode) {
      throw new Error("Could not allocate an application code");
    }

    const base = slugifyHandle(name);
    const handle = await allocateUniqueHandle(ctx, base);

    await ctx.db.insert("creators", {
      applicationCode,
      handle,
      name,
      bio: args.bio.trim(),
      country: args.country.trim() || "US",
      category: args.category.trim(),
      platforms: args.platforms,
      officialLinks: filteredLinks,
      verificationMethod: args.verificationMethod,
      applicantClerkId,
      applicantName,
      status: "pending",
      verified: false,
      followers: 0,
      totalSources: 0,
      totalBarksReceived: 0,
      responseRate: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { applicationCode };
  },
});

export const listApproved = query({
  args: {},
  returns: v.array(creatorDoc),
  handler: async (ctx) => {
    return await ctx.db
      .query("creators")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "approved"))
      .order("desc")
      .take(50);
  },
});

export const listPublic = query({
  args: {},
  returns: v.array(creatorDoc),
  handler: async (ctx) => {
    const [approved, unclaimed] = await Promise.all([
      ctx.db
        .query("creators")
        .withIndex("by_status_createdAt", (q) => q.eq("status", "approved"))
        .order("desc")
        .take(50),
      ctx.db
        .query("creators")
        .withIndex("by_status_createdAt", (q) => q.eq("status", "unclaimed"))
        .order("desc")
        .take(50),
    ]);
    return [...approved, ...unclaimed].sort(
      (a, b) => b.totalBarksReceived - a.totalBarksReceived
    );
  },
});

export const getByExternalIdentity = query({
  args: {
    platform: sourcePlatform,
    externalHandle: v.string(),
  },
  returns: v.union(creatorDoc, v.null()),
  handler: async (ctx, args) => {
    const creator = await findByExternalIdentity(
      ctx,
      args.platform,
      args.externalHandle
    );
    if (!creator || !isPublicCreator(creator)) return null;
    return creator;
  },
});

export const ensureUnclaimedFromSource = mutation({
  args: {
    platform: sourcePlatform,
    externalHandle: v.string(),
    displayName: v.string(),
    sourceUrl: v.string(),
    channelUrl: v.optional(v.string()),
  },
  returns: v.object({ creatorId: v.id("creators") }),
  handler: async (ctx, args) => {
    const externalHandle = args.externalHandle.trim().toLowerCase();
    if (!externalHandle) throw new Error("External handle is required");

    const existing = await findByExternalIdentity(
      ctx,
      args.platform,
      externalHandle
    );
    const now = Date.now();
    const displayName = args.displayName.trim() || externalHandle;

    if (existing) {
      if (existing.status === "approved") {
        return { creatorId: existing._id };
      }
      if (existing.status === "unclaimed") {
        const patch: Partial<Doc<"creators">> = { updatedAt: now };
        if (displayName && displayName !== existing.name) {
          patch.name = displayName;
        }
        const channelUrl = args.channelUrl?.trim();
        if (
          channelUrl &&
          !existing.officialLinks.some((link) => link.url === channelUrl)
        ) {
          patch.officialLinks = [
            ...existing.officialLinks,
            { label: args.platform, url: channelUrl },
          ];
        }
        if (Object.keys(patch).length > 1) {
          await ctx.db.patch(existing._id, patch);
        }
        return { creatorId: existing._id };
      }
    }

    const handle = await allocateUniqueHandle(ctx, externalHandle);
    const applicationCode = await allocateUnclaimedApplicationCode(ctx);
    const channelUrl = args.channelUrl?.trim();
    const officialLinks = channelUrl
      ? [{ label: args.platform, url: channelUrl }]
      : args.sourceUrl.trim()
        ? [{ label: "Source", url: args.sourceUrl.trim() }]
        : [];

    const creatorId = await ctx.db.insert("creators", {
      applicationCode,
      handle,
      name: displayName,
      bio: "",
      country: "",
      category: "Uncategorized",
      platforms: [args.platform],
      officialLinks,
      verificationMethod: "connect",
      applicantClerkId: "",
      applicantName: "",
      status: "unclaimed",
      verified: false,
      followers: 0,
      totalSources: 0,
      totalBarksReceived: 0,
      responseRate: 0,
      externalPlatform: args.platform,
      externalHandle,
      createdAt: now,
      updatedAt: now,
    });

    return { creatorId };
  },
});

export const getByHandle = query({
  args: { handle: v.string() },
  returns: v.union(creatorDoc, v.null()),
  handler: async (ctx, args) => {
    const creator = await ctx.db
      .query("creators")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .unique();
    if (!creator || !isPublicCreator(creator)) return null;
    return creator;
  },
});

export const getById = query({
  args: { id: v.id("creators") },
  returns: v.union(creatorDoc, v.null()),
  handler: async (ctx, args) => {
    const creator = await ctx.db.get(args.id);
    if (!creator || !isPublicCreator(creator)) return null;
    return creator;
  },
});

export const getMine = query({
  args: {},
  returns: v.union(creatorDoc, v.null()),
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const rows = await ctx.db
      .query("creators")
      .withIndex("by_applicant", (q) =>
        q.eq("applicantClerkId", clerkUserId(identity))
      )
      .take(20);
    return rows.find((row) => row.status === "approved") ?? null;
  },
});

export const listPending = query({
  args: {},
  returns: v.array(creatorDoc),
  handler: async (ctx) => {
    await requireIdentity(ctx);
    return await ctx.db
      .query("creators")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(50);
  },
});

export const approve = mutation({
  args: { creatorId: v.id("creators") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const creator = await ctx.db.get(args.creatorId);
    if (!creator) throw new Error("Application not found");
    await ctx.db.patch(args.creatorId, {
      status: "approved",
      verified: true,
      updatedAt: Date.now(),
    });
    await notify(ctx, {
      recipientClerkId: creator.applicantClerkId,
      category: "verification",
      title: "Your creator profile was verified",
      body: `@${creator.handle} is now live on TypeReact.`,
      href: `/creators/${creator.handle}`,
    });
    const clerkId = clerkUserId(identity);
    await recordModerationEvent(ctx, {
      kind: "creator_approve",
      actorClerkId: clerkId,
      actorName: await displayName(ctx, clerkId, "Admin"),
      targetLabel: `@${creator.handle}`,
      note: `${creator.name} was verified and published.`,
    });
    return null;
  },
});

const followStateDoc = v.object({
  followers: v.number(),
  following: v.boolean(),
});

export const followState = query({
  args: { creatorId: v.id("creators") },
  returns: v.union(followStateDoc, v.null()),
  handler: async (ctx, args) => {
    const creator = await ctx.db.get(args.creatorId);
    if (!creator || creator.status !== "approved") return null;
    const identity = await ctx.auth.getUserIdentity();
    let following = false;
    if (identity) {
      const existing = await ctx.db
        .query("creatorFollows")
        .withIndex("by_creator_user", (q) =>
          q
            .eq("creatorId", creator._id)
            .eq("clerkUserId", clerkUserId(identity))
        )
        .unique();
      following = Boolean(existing);
    }
    return { followers: creator.followers, following };
  },
});

export const toggleFollow = mutation({
  args: { creatorId: v.id("creators") },
  returns: followStateDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const creator = await ctx.db.get(args.creatorId);
    if (!creator || creator.status !== "approved") {
      throw new Error("Creator not found");
    }
    const clerkId = clerkUserId(identity);
    if (creator.applicantClerkId === clerkId) {
      throw new Error("You cannot follow your own creator profile");
    }
    const existing = await ctx.db
      .query("creatorFollows")
      .withIndex("by_creator_user", (q) =>
        q.eq("creatorId", creator._id).eq("clerkUserId", clerkId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      const followers = Math.max(0, creator.followers - 1);
      await ctx.db.patch(creator._id, { followers, updatedAt: Date.now() });
      return { followers, following: false };
    }
    await ctx.db.insert("creatorFollows", {
      creatorId: creator._id,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    const followers = creator.followers + 1;
    await ctx.db.patch(creator._id, { followers, updatedAt: Date.now() });
    const actorName = await displayName(ctx, clerkId, "Someone");
    await notify(ctx, {
      recipientClerkId: creator.applicantClerkId,
      actorClerkId: clerkId,
      category: "follower",
      title: `${actorName} started following you`,
      body: `${actorName} followed @${creator.handle}.`,
      href: `/creators/${creator.handle}`,
    });
    return { followers, following: true };
  },
});

export const listMineFollows = query({
  args: {},
  returns: v.array(creatorDoc),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const rows = await ctx.db
      .query("creatorFollows")
      .withIndex("by_user", (q) =>
        q.eq("clerkUserId", clerkUserId(identity))
      )
      .take(20);
    const result = [];
    for (const row of rows) {
      const creator = await ctx.db.get(row.creatorId);
      if (creator && creator.status === "approved") result.push(creator);
    }
    return result;
  },
});

export const reject = mutation({
  args: { creatorId: v.id("creators") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const creator = await ctx.db.get(args.creatorId);
    if (!creator) throw new Error("Application not found");
    await ctx.db.patch(args.creatorId, {
      status: "rejected",
      verified: false,
      updatedAt: Date.now(),
    });
    await notify(ctx, {
      recipientClerkId: creator.applicantClerkId,
      category: "verification",
      title: "Creator application was not approved",
      body: "You can review the requirements and apply again.",
      href: "/creators",
    });
    const clerkId = clerkUserId(identity);
    await recordModerationEvent(ctx, {
      kind: "creator_reject",
      actorClerkId: clerkId,
      actorName: await displayName(ctx, clerkId, "Admin"),
      targetLabel: `@${creator.handle}`,
      note: `${creator.name} application was rejected.`,
    });
    return null;
  },
});
