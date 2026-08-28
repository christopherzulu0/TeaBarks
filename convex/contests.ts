import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internalMutation, mutation, query } from "./_generated/server";
import { isAdmin, requireAdmin } from "./lib/admin";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { contestDocFields } from "./lib/validators";

const contestDoc = v.object({
  ...contestDocFields,
  _id: v.id("contests"),
  _creationTime: v.number(),
});

const mineEntry = v.object({
  contestId: v.id("contests"),
  storyId: v.id("stories"),
  storyTitle: v.string(),
});

const blindEntryRow = v.object({
  entryId: v.id("contestEntries"),
  label: v.string(),
  wordCount: v.number(),
  publishedChapterCount: v.number(),
  myScore: v.union(v.number(), v.null()),
  averageScore: v.union(v.number(), v.null()),
});

const blindChapter = v.object({
  number: v.number(),
  title: v.string(),
  body: v.string(),
});

async function requireApprovedWriter(ctx: QueryCtx | MutationCtx) {
  const identity = await requireIdentity(ctx);
  const clerkId = clerkUserId(identity);
  const rows = await ctx.db
    .query("writers")
    .withIndex("by_applicant", (q) => q.eq("applicantClerkId", clerkId))
    .take(20);
  const writer = rows.find((row) => row.status === "approved");
  if (!writer) throw new Error("Writer access is not approved");
  return { identity, clerkId, writer };
}

async function publishedChapters(
  ctx: QueryCtx | MutationCtx,
  storyId: Id<"stories">
) {
  const rows = await ctx.db
    .query("storyChapters")
    .withIndex("by_story_status", (q) =>
      q.eq("storyId", storyId).eq("status", "published")
    )
    .take(50);
  rows.sort((a, b) => a.number - b.number);
  return rows;
}

function slugifyName(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "contest";
  return base;
}

function entryLabel(id: string) {
  return `Entry ${id.slice(-4).toUpperCase()}`;
}

export const listActive = query({
  args: {},
  returns: v.array(contestDoc),
  handler: async (ctx) => {
    return await ctx.db
      .query("contests")
      .withIndex("by_status_deadline", (q) => q.eq("status", "active"))
      .order("asc")
      .take(20);
  },
});

export const listClosed = query({
  args: {},
  returns: v.array(contestDoc),
  handler: async (ctx) => {
    return await ctx.db
      .query("contests")
      .withIndex("by_status_deadline", (q) => q.eq("status", "closed"))
      .order("desc")
      .take(20);
  },
});

export const listMineEntries = query({
  args: {},
  returns: v.array(mineEntry),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const clerkId = clerkUserId(identity);
    const writers = await ctx.db
      .query("writers")
      .withIndex("by_applicant", (q) => q.eq("applicantClerkId", clerkId))
      .take(20);
    const writer = writers.find((row) => row.status === "approved");
    if (!writer) return [];
    const rows = await ctx.db
      .query("contestEntries")
      .withIndex("by_writer", (q) => q.eq("writerId", writer._id))
      .take(20);
    const result = [];
    for (const row of rows) {
      const story = await ctx.db.get(row.storyId);
      result.push({
        contestId: row.contestId,
        storyId: row.storyId,
        storyTitle: story?.title ?? "Untitled story",
      });
    }
    return result;
  },
});

export const enter = mutation({
  args: {
    contestId: v.id("contests"),
    storyId: v.id("stories"),
  },
  returns: v.object({ storyTitle: v.string() }),
  handler: async (ctx, args) => {
    const { clerkId, writer } = await requireApprovedWriter(ctx);
    const contest = await ctx.db.get(args.contestId);
    if (!contest) throw new Error("Contest not found");
    if (contest.status !== "active") {
      throw new Error("This contest is closed");
    }
    if (contest.deadlineAt <= Date.now()) {
      throw new Error("The entry deadline has passed");
    }

    const existing = await ctx.db
      .query("contestEntries")
      .withIndex("by_contest_writer", (q) =>
        q.eq("contestId", args.contestId).eq("writerId", writer._id)
      )
      .unique();
    if (existing) {
      throw new Error("You already have an entry in this contest");
    }

    const story = await ctx.db.get(args.storyId);
    if (!story || story.writerId !== writer._id) {
      throw new Error("Pick one of your stories");
    }
    if (story.visibility !== "public") {
      throw new Error("Publish the story before entering");
    }
    if ((await publishedChapters(ctx, story._id)).length === 0) {
      throw new Error("Publish at least one part before entering");
    }

    await ctx.db.insert("contestEntries", {
      contestId: args.contestId,
      storyId: story._id,
      writerId: writer._id,
      clerkUserId: clerkId,
      createdAt: Date.now(),
    });
    await ctx.db.patch(contest._id, {
      entryCount: contest.entryCount + 1,
      updatedAt: Date.now(),
    });
    return { storyTitle: story.title };
  },
});

export const listAdmin = query({
  args: {},
  returns: v.union(v.array(contestDoc), v.null()),
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return null;
    const [active, closed] = await Promise.all([
      ctx.db
        .query("contests")
        .withIndex("by_status_deadline", (q) => q.eq("status", "active"))
        .take(20),
      ctx.db
        .query("contests")
        .withIndex("by_status_deadline", (q) => q.eq("status", "closed"))
        .take(20),
    ]);
    return [...active, ...closed].sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    theme: v.string(),
    prize: v.string(),
    description: v.string(),
    deadlineAt: v.number(),
  },
  returns: v.object({ contestId: v.id("contests") }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const name = args.name.trim();
    const theme = args.theme.trim();
    const prize = args.prize.trim();
    const description = args.description.trim();
    if (!name) throw new Error("Name is required");
    if (!theme) throw new Error("Theme is required");
    if (!prize) throw new Error("Prize is required");
    if (!description) throw new Error("Description is required");
    if (args.deadlineAt <= Date.now()) {
      throw new Error("Deadline must be in the future");
    }

    const base = slugifyName(name);
    let slug = base;
    for (let attempt = 0; attempt < 12; attempt++) {
      const taken = await ctx.db
        .query("contests")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!taken) break;
      slug = `${base}-${attempt + 2}`;
    }

    const now = Date.now();
    const contestId = await ctx.db.insert("contests", {
      slug,
      name,
      theme,
      prize,
      description,
      status: "active",
      deadlineAt: args.deadlineAt,
      entryCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    return { contestId };
  },
});

export const close = mutation({
  args: { contestId: v.id("contests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const contest = await ctx.db.get(args.contestId);
    if (!contest) throw new Error("Contest not found");
    await ctx.db.patch(args.contestId, {
      status: "closed",
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const listBlindEntries = query({
  args: { contestId: v.id("contests") },
  returns: v.union(v.array(blindEntryRow), v.null()),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) return null;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const clerkId = clerkUserId(identity);
    const entries = await ctx.db
      .query("contestEntries")
      .withIndex("by_contest", (q) => q.eq("contestId", args.contestId))
      .take(50);
    const judgments = await ctx.db
      .query("contestJudgments")
      .withIndex("by_contest", (q) => q.eq("contestId", args.contestId))
      .take(50);

    const result = [];
    for (const entry of entries) {
      const chapters = await publishedChapters(ctx, entry.storyId);
      const scores = judgments.filter((row) => row.entryId === entry._id);
      const mine = scores.find((row) => row.clerkUserId === clerkId);
      const averageScore =
        scores.length === 0
          ? null
          : Math.round(
              (scores.reduce((sum, row) => sum + row.score, 0) / scores.length) *
                10
            ) / 10;
      result.push({
        entryId: entry._id,
        label: entryLabel(entry._id),
        wordCount: chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0),
        publishedChapterCount: chapters.length,
        myScore: mine?.score ?? null,
        averageScore,
      });
    }
    return result;
  },
});

export const getBlindEntry = query({
  args: { entryId: v.id("contestEntries") },
  returns: v.union(
    v.object({
      contestId: v.id("contests"),
      contestName: v.string(),
      contestStatus: v.union(v.literal("active"), v.literal("closed")),
      entryId: v.id("contestEntries"),
      label: v.string(),
      title: v.string(),
      chapters: v.array(blindChapter),
      myScore: v.union(v.number(), v.null()),
      notes: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) return null;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const clerkId = clerkUserId(identity);
    const entry = await ctx.db.get(args.entryId);
    if (!entry) return null;
    const contest = await ctx.db.get(entry.contestId);
    if (!contest) return null;
    const story = await ctx.db.get(entry.storyId);
    if (!story) return null;
    const chapters = await publishedChapters(ctx, story._id);
    const mine = await ctx.db
      .query("contestJudgments")
      .withIndex("by_entry_judge", (q) =>
        q.eq("entryId", entry._id).eq("clerkUserId", clerkId)
      )
      .unique();
    return {
      contestId: contest._id,
      contestName: contest.name,
      contestStatus: contest.status,
      entryId: entry._id,
      label: entryLabel(entry._id),
      title: story.title,
      chapters: chapters.map((chapter) => ({
        number: chapter.number,
        title: chapter.title,
        body: chapter.body,
      })),
      myScore: mine?.score ?? null,
      notes: mine?.notes ?? null,
    };
  },
});

export const scoreEntry = mutation({
  args: {
    entryId: v.id("contestEntries"),
    score: v.number(),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { clerkId } = await requireAdmin(ctx);
    const score = Math.round(args.score);
    if (score < 1 || score > 10) throw new Error("Score must be 1–10");
    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new Error("Entry not found");
    const notes = args.notes?.trim();
    const existing = await ctx.db
      .query("contestJudgments")
      .withIndex("by_entry_judge", (q) =>
        q.eq("entryId", entry._id).eq("clerkUserId", clerkId)
      )
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        score,
        updatedAt: now,
        ...(notes ? { notes } : {}),
      });
    } else {
      await ctx.db.insert("contestJudgments", {
        contestId: entry.contestId,
        entryId: entry._id,
        clerkUserId: clerkId,
        score,
        ...(notes ? { notes } : {}),
        updatedAt: now,
      });
    }
    return null;
  },
});

export const pickWinner = mutation({
  args: {
    contestId: v.id("contests"),
    entryId: v.id("contestEntries"),
  },
  returns: v.object({ winnerSlug: v.string() }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const contest = await ctx.db.get(args.contestId);
    if (!contest) throw new Error("Contest not found");
    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.contestId !== contest._id) {
      throw new Error("Entry not found");
    }
    const story = await ctx.db.get(entry.storyId);
    if (!story) throw new Error("Story not found");
    await ctx.db.patch(contest._id, {
      status: "closed",
      winnerSlug: story.slug,
      updatedAt: Date.now(),
    });
    return { winnerSlug: story.slug };
  },
});

const SEEDED_SLUGS = [
  "open-door-2026",
  "small-hours-poetry-2026",
  "first-lines-2025",
];

export const purgeSeeded = internalMutation({
  args: {},
  returns: v.object({ deletedContests: v.number() }),
  handler: async (ctx) => {
    let deletedContests = 0;
    for (const slug of SEEDED_SLUGS) {
      const contest = await ctx.db
        .query("contests")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!contest) continue;
      const entries = await ctx.db
        .query("contestEntries")
        .withIndex("by_contest", (q) => q.eq("contestId", contest._id))
        .take(50);
      const judgments = await ctx.db
        .query("contestJudgments")
        .withIndex("by_contest", (q) => q.eq("contestId", contest._id))
        .take(50);
      for (const row of judgments) await ctx.db.delete(row._id);
      for (const row of entries) await ctx.db.delete(row._id);
      await ctx.db.delete(contest._id);
      deletedContests += 1;
    }
    return { deletedContests };
  },
});
