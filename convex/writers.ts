import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { recordModerationEvent } from "./lib/moderation";
import { displayName, notify } from "./lib/notify";
import {
  writerCadence,
  writerDocFields,
  writerLanguage,
  storyGenre,
} from "./lib/validators";

const writerDoc = v.object({
  ...writerDocFields,
  _id: v.id("writers"),
  _creationTime: v.number(),
});

const MIN_SAMPLE_WORDS = 100;

function slugifyHandle(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24) || "writer";
  return base;
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function pickLatestWriter<T extends { updatedAt: number; createdAt: number }>(
  rows: T[]
) {
  return rows.reduce((latest, row) =>
    row.updatedAt > latest.updatedAt ||
    (row.updatedAt === latest.updatedAt && row.createdAt > latest.createdAt)
      ? row
      : latest
  );
}

export const apply = mutation({
  args: {
    penName: v.string(),
    language: writerLanguage,
    genres: v.array(storyGenre),
    sampleTitle: v.string(),
    sample: v.string(),
    cadence: writerCadence,
    originalityAccepted: v.boolean(),
    policyAccepted: v.boolean(),
  },
  returns: v.object({ applicationCode: v.string() }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const applicantClerkId = clerkUserId(identity);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", applicantClerkId))
      .unique();

    const penName = args.penName.trim();
    if (!penName) throw new Error("Pen name is required");
    if (args.genres.length === 0) throw new Error("Pick at least one genre");
    const sampleTitle = args.sampleTitle.trim();
    if (!sampleTitle) throw new Error("Give your sample a title");
    const sample = args.sample.trim();
    if (wordCount(sample) < MIN_SAMPLE_WORDS) {
      throw new Error(`Your sample needs at least ${MIN_SAMPLE_WORDS} words`);
    }
    if (!args.originalityAccepted || !args.policyAccepted) {
      throw new Error("Both declarations are required");
    }

    const existing = await ctx.db
      .query("writers")
      .withIndex("by_applicant", (q) =>
        q.eq("applicantClerkId", applicantClerkId)
      )
      .take(20);
    if (existing.length > 0) {
      const latest = pickLatestWriter(existing);
      if (latest.status === "approved") {
        throw new Error("You already have an approved writer profile");
      }
      if (latest.status === "pending") {
        throw new Error("You already have an application under review");
      }
      throw new Error("You already have a writer application on file");
    }

    const year = new Date().getUTCFullYear();
    let applicationCode = "";
    for (let attempt = 0; attempt < 8; attempt++) {
      const n = 1000 + Math.floor(Math.random() * 9000);
      const candidate = `WRT-${year}-${String(n).padStart(4, "0")}`;
      const clash = await ctx.db
        .query("writers")
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

    const base = slugifyHandle(penName);
    let handle = base;
    let handleTaken = true;
    for (let attempt = 0; attempt < 12; attempt++) {
      const taken = await ctx.db
        .query("writers")
        .withIndex("by_handle", (q) => q.eq("handle", handle))
        .unique();
      if (!taken) {
        handleTaken = false;
        break;
      }
      handle = `${base}${attempt + 2}`;
    }
    if (handleTaken) {
      throw new Error("Could not allocate a unique handle");
    }

    const now = Date.now();
    const applicantName =
      user?.name ||
      (typeof identity.name === "string" && identity.name) ||
      penName;

    await ctx.db.insert("writers", {
      applicationCode,
      handle,
      penName,
      language: args.language,
      genres: args.genres,
      sampleTitle,
      sample,
      cadence: args.cadence,
      originalityAccepted: true,
      policyAccepted: true,
      applicantClerkId,
      applicantName,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return { applicationCode };
  },
});

export const getMine = query({
  args: {},
  returns: v.union(writerDoc, v.null()),
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const rows = await ctx.db
      .query("writers")
      .withIndex("by_applicant", (q) =>
        q.eq("applicantClerkId", clerkUserId(identity))
      )
      .take(20);
    return rows.find((row) => row.status === "approved") ?? null;
  },
});

export const getMyApplication = query({
  args: {},
  returns: v.union(writerDoc, v.null()),
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const rows = await ctx.db
      .query("writers")
      .withIndex("by_applicant", (q) =>
        q.eq("applicantClerkId", clerkUserId(identity))
      )
      .take(20);
    if (rows.length === 0) return null;
    return pickLatestWriter(rows);
  },
});

export const listPending = query({
  args: {},
  returns: v.array(writerDoc),
  handler: async (ctx) => {
    await requireIdentity(ctx);
    return await ctx.db
      .query("writers")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(50);
  },
});

export const approve = mutation({
  args: { writerId: v.id("writers") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const writer = await ctx.db.get(args.writerId);
    if (!writer) throw new Error("Application not found");
    await ctx.db.patch(args.writerId, {
      status: "approved",
      updatedAt: Date.now(),
    });
    await notify(ctx, {
      recipientClerkId: writer.applicantClerkId,
      category: "verification",
      title: "Your writer profile was approved",
      body: `@${writer.handle} can now publish stories.`,
      href: "/stories/dashboard",
    });
    const clerkId = clerkUserId(identity);
    await recordModerationEvent(ctx, {
      kind: "writer_approve",
      actorClerkId: clerkId,
      actorName: await displayName(ctx, clerkId, "Admin"),
      targetLabel: `@${writer.handle}`,
      note: `${writer.penName} can now publish stories.`,
    });
    return null;
  },
});

export const reject = mutation({
  args: { writerId: v.id("writers") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const writer = await ctx.db.get(args.writerId);
    if (!writer) throw new Error("Application not found");
    await ctx.db.patch(args.writerId, {
      status: "rejected",
      updatedAt: Date.now(),
    });
    await notify(ctx, {
      recipientClerkId: writer.applicantClerkId,
      category: "verification",
      title: "Writer application was not approved",
      body: "You can review the requirements and apply again.",
      href: "/stories/apply",
    });
    const clerkId = clerkUserId(identity);
    await recordModerationEvent(ctx, {
      kind: "writer_reject",
      actorClerkId: clerkId,
      actorName: await displayName(ctx, clerkId, "Admin"),
      targetLabel: `@${writer.handle}`,
      note: `${writer.penName} application was rejected.`,
    });
    return null;
  },
});
