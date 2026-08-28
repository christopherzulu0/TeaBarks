import { v } from "convex/values";
import { query } from "./_generated/server";
import { isAdmin } from "./lib/admin";
import { displayName } from "./lib/notify";
import {
  creatorStatus,
  moderationEventKind,
  reportCategory,
} from "./lib/validators";

const STAT_CAP = 500;
const LIST_CAP = 50;
const USER_BARK_CAP = 20;
const CREATOR_STATUS_CAP = 20;
const REPORT_SOURCE_CAP = 50;

const cappedCount = v.object({
  value: v.number(),
  capped: v.boolean(),
});

const statsDoc = v.object({
  users: cappedCount,
  usersDelta: v.string(),
  verifiedCreators: cappedCount,
  verifiedCreatorsDelta: v.string(),
  organizations: cappedCount,
  organizationsDelta: v.string(),
  openReports: cappedCount,
  openReportsDelta: v.string(),
});

const growthPoint = v.object({
  month: v.string(),
  users: v.number(),
  barks: v.number(),
  cases: v.number(),
  stories: v.number(),
});

const userRow = v.object({
  clerkId: v.string(),
  name: v.string(),
  email: v.string(),
  imageUrl: v.union(v.string(), v.null()),
  barkCount: v.number(),
  evidenceScore: v.union(v.number(), v.null()),
  status: v.literal("active"),
});

const creatorRow = v.object({
  _id: v.id("creators"),
  handle: v.string(),
  name: v.string(),
  applicantClerkId: v.string(),
  status: creatorStatus,
  verified: v.boolean(),
  totalBarksReceived: v.number(),
  responseRate: v.number(),
});

const reportKind = v.union(
  v.literal("bark"),
  v.literal("case"),
  v.literal("story")
);

const reportRow = v.object({
  id: v.string(),
  kind: reportKind,
  target: v.string(),
  href: v.string(),
  category: reportCategory,
  reporterName: v.string(),
  status: v.literal("open"),
  createdAt: v.number(),
});

const moderationRow = v.object({
  _id: v.id("moderationEvents"),
  kind: moderationEventKind,
  actorName: v.string(),
  targetLabel: v.string(),
  note: v.string(),
  createdAt: v.number(),
});

function utcMonthStart(nowMs: number, monthOffset: number) {
  const d = new Date(nowMs);
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCMonth(d.getUTCMonth() + monthOffset);
  return d.getTime();
}

function deltaLabel(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? "No change this month" : `+${current} this month`;
  }
  const pct = ((current - previous) / previous) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% this month`;
}

function formatCapped(count: number, cap: number) {
  return { value: count, capped: count >= cap };
}

function monthBuckets(nowMs: number) {
  const buckets: { month: string; start: number; end: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = utcMonthStart(nowMs, -i);
    const end = utcMonthStart(nowMs, -i + 1);
    const label = new Date(start).toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    buckets.push({ month: label, start, end });
  }
  return buckets;
}

function countBefore(times: number[], end: number) {
  let n = 0;
  for (const t of times) {
    if (t < end) n += 1;
  }
  return n;
}

export const stats = query({
  args: { nowMs: v.number() },
  returns: v.union(statsDoc, v.null()),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) return null;

    const thisStart = utcMonthStart(args.nowMs, 0);
    const nextStart = utcMonthStart(args.nowMs, 1);
    const prevStart = utcMonthStart(args.nowMs, -1);

    const [
      users,
      usersThis,
      usersPrev,
      approvedCreators,
      orgs,
      orgsThis,
      orgsPrev,
      barkReports,
      caseReports,
      storyReports,
      barkReportsThis,
      barkReportsPrev,
      caseReportsThis,
      caseReportsPrev,
      storyReportsThis,
      storyReportsPrev,
    ] = await Promise.all([
      ctx.db.query("users").take(STAT_CAP),
      ctx.db
        .query("users")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", thisStart).lt("_creationTime", nextStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("users")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", prevStart).lt("_creationTime", thisStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("creators")
        .withIndex("by_status_createdAt", (q) => q.eq("status", "approved"))
        .take(STAT_CAP),
      ctx.db.query("organizations").take(STAT_CAP),
      ctx.db
        .query("organizations")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", thisStart).lt("_creationTime", nextStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("organizations")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", prevStart).lt("_creationTime", thisStart)
        )
        .take(STAT_CAP),
      ctx.db.query("barkReports").order("desc").take(STAT_CAP),
      ctx.db.query("caseReports").order("desc").take(STAT_CAP),
      ctx.db.query("storyReports").order("desc").take(STAT_CAP),
      ctx.db
        .query("barkReports")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", thisStart).lt("_creationTime", nextStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("barkReports")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", prevStart).lt("_creationTime", thisStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("caseReports")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", thisStart).lt("_creationTime", nextStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("caseReports")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", prevStart).lt("_creationTime", thisStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("storyReports")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", thisStart).lt("_creationTime", nextStart)
        )
        .take(STAT_CAP),
      ctx.db
        .query("storyReports")
        .withIndex("by_creation_time", (q) =>
          q.gte("_creationTime", prevStart).lt("_creationTime", thisStart)
        )
        .take(STAT_CAP),
    ]);

    const verified = approvedCreators.filter((c) => c.verified);
    const verifiedThis = verified.filter(
      (c) => c.createdAt >= thisStart && c.createdAt < nextStart
    ).length;
    const verifiedPrev = verified.filter(
      (c) => c.createdAt >= prevStart && c.createdAt < thisStart
    ).length;

    const openReports =
      barkReports.length + caseReports.length + storyReports.length;
    const openThis =
      barkReportsThis.length +
      caseReportsThis.length +
      storyReportsThis.length;
    const openPrev =
      barkReportsPrev.length +
      caseReportsPrev.length +
      storyReportsPrev.length;

    return {
      users: formatCapped(users.length, STAT_CAP),
      usersDelta: deltaLabel(usersThis.length, usersPrev.length),
      verifiedCreators: formatCapped(verified.length, STAT_CAP),
      verifiedCreatorsDelta: deltaLabel(verifiedThis, verifiedPrev),
      organizations: formatCapped(orgs.length, STAT_CAP),
      organizationsDelta: deltaLabel(orgsThis.length, orgsPrev.length),
      openReports: formatCapped(openReports, STAT_CAP * 3),
      openReportsDelta:
        openThis === 0
          ? "None filed this month"
          : `${openThis} filed this month${openPrev ? ` (${deltaLabel(openThis, openPrev)})` : ""}`,
    };
  },
});

export const growth = query({
  args: { nowMs: v.number() },
  returns: v.union(v.array(growthPoint), v.null()),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) return null;

    const [users, barks, cases, stories] = await Promise.all([
      ctx.db.query("users").order("desc").take(STAT_CAP),
      ctx.db
        .query("barks")
        .withIndex("by_status_publishedAt", (q) => q.eq("status", "public"))
        .order("desc")
        .take(STAT_CAP),
      ctx.db.query("cases").order("desc").take(STAT_CAP),
      ctx.db
        .query("stories")
        .withIndex("by_visibility_updatedAt", (q) =>
          q.eq("visibility", "public")
        )
        .order("desc")
        .take(STAT_CAP),
    ]);

    const userTimes = users.map((row) => row._creationTime);
    const barkTimes = barks.map((row) => row.publishedAt);
    const caseTimes = cases.map((row) => row._creationTime);
    const storyTimes = stories.map((row) => row._creationTime);
    const buckets = monthBuckets(args.nowMs);

    return buckets.map((bucket) => ({
      month: bucket.month,
      users: countBefore(userTimes, bucket.end),
      barks: countBefore(barkTimes, bucket.end),
      cases: countBefore(caseTimes, bucket.end),
      stories: countBefore(storyTimes, bucket.end),
    }));
  },
});

export const listUsers = query({
  args: {},
  returns: v.union(v.array(userRow), v.null()),
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return null;
    const users = await ctx.db.query("users").order("desc").take(LIST_CAP);
    const rows = [];
    for (const user of users) {
      const barks = await ctx.db
        .query("barks")
        .withIndex("by_author", (q) => q.eq("authorClerkId", user.clerkId))
        .take(USER_BARK_CAP);
      const ratings = barks.map((b) => b.evidenceRating);
      const evidenceScore =
        ratings.length === 0
          ? null
          : Math.round(
              ratings.reduce((sum, n) => sum + n, 0) / ratings.length
            );
      rows.push({
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl ?? null,
        barkCount: barks.length,
        evidenceScore,
        status: "active" as const,
      });
    }
    return rows;
  },
});

export const listCreators = query({
  args: {},
  returns: v.union(v.array(creatorRow), v.null()),
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return null;
    const [pending, approved, rejected] = await Promise.all([
      ctx.db
        .query("creators")
        .withIndex("by_status_createdAt", (q) => q.eq("status", "pending"))
        .order("desc")
        .take(CREATOR_STATUS_CAP),
      ctx.db
        .query("creators")
        .withIndex("by_status_createdAt", (q) => q.eq("status", "approved"))
        .order("desc")
        .take(CREATOR_STATUS_CAP),
      ctx.db
        .query("creators")
        .withIndex("by_status_createdAt", (q) => q.eq("status", "rejected"))
        .order("desc")
        .take(CREATOR_STATUS_CAP),
    ]);
    return [...pending, ...approved, ...rejected]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((c) => ({
        _id: c._id,
        handle: c.handle,
        name: c.name,
        applicantClerkId: c.applicantClerkId,
        status: c.status,
        verified: c.verified,
        totalBarksReceived: c.totalBarksReceived,
        responseRate: c.responseRate,
      }));
  },
});

export const listReports = query({
  args: {},
  returns: v.union(v.array(reportRow), v.null()),
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return null;

    const [barkReports, caseReports, storyReports] = await Promise.all([
      ctx.db.query("barkReports").order("desc").take(REPORT_SOURCE_CAP),
      ctx.db.query("caseReports").order("desc").take(REPORT_SOURCE_CAP),
      ctx.db.query("storyReports").order("desc").take(REPORT_SOURCE_CAP),
    ]);

    const rows: {
      id: string;
      kind: "bark" | "case" | "story";
      target: string;
      href: string;
      category: (typeof barkReports)[number]["category"];
      reporterName: string;
      status: "open";
      createdAt: number;
    }[] = [];

    for (const report of barkReports) {
      const bark = await ctx.db.get(report.barkId);
      const code = bark?.code ?? report.targetId;
      const target =
        report.targetKind === "comment" ? `${code} comment` : code;
      rows.push({
        id: report._id,
        kind: "bark",
        target,
        href: `/barks/${code}`,
        category: report.category,
        reporterName: await displayName(ctx, report.reporterClerkId, "Member"),
        status: "open",
        createdAt: report.createdAt,
      });
    }

    for (const report of caseReports) {
      const accountabilityCase = await ctx.db.get(report.caseId);
      const code = accountabilityCase?.code ?? "case";
      rows.push({
        id: report._id,
        kind: "case",
        target: code,
        href: `/cases/${code}`,
        category: report.category,
        reporterName: await displayName(ctx, report.reporterClerkId, "Member"),
        status: "open",
        createdAt: report.createdAt,
      });
    }

    for (const report of storyReports) {
      const story = await ctx.db.get(report.storyId);
      rows.push({
        id: report._id,
        kind: "story",
        target: story?.title ?? "Story",
        href: story ? `/stories/${story.slug}` : "/stories",
        category: report.category,
        reporterName: await displayName(ctx, report.reporterClerkId, "Member"),
        status: "open",
        createdAt: report.createdAt,
      });
    }

    rows.sort((a, b) => b.createdAt - a.createdAt);
    return rows.slice(0, LIST_CAP);
  },
});

const storyReportRow = v.object({
  id: v.string(),
  story: v.string(),
  href: v.string(),
  category: reportCategory,
  reporterName: v.string(),
  status: v.literal("open"),
  createdAt: v.number(),
});

export const listStoryReports = query({
  args: {},
  returns: v.union(v.array(storyReportRow), v.null()),
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return null;
    const reports = await ctx.db
      .query("storyReports")
      .order("desc")
      .take(LIST_CAP);
    const rows = [];
    for (const report of reports) {
      const story = await ctx.db.get(report.storyId);
      rows.push({
        id: report._id,
        story: story?.title ?? "Story",
        href: story ? `/stories/${story.slug}` : "/stories",
        category: report.category,
        reporterName: await displayName(ctx, report.reporterClerkId, "Member"),
        status: "open" as const,
        createdAt: report.createdAt,
      });
    }
    return rows;
  },
});

export const listModerationEvents = query({
  args: {},
  returns: v.union(v.array(moderationRow), v.null()),
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return null;
    const events = await ctx.db
      .query("moderationEvents")
      .withIndex("by_createdAt")
      .order("desc")
      .take(LIST_CAP);
    return events.map((event) => ({
      _id: event._id,
      kind: event.kind,
      actorName: event.actorName,
      targetLabel: event.targetLabel,
      note: event.note,
      createdAt: event.createdAt,
    }));
  },
});
