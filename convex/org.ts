import { v } from "convex/values";
import { query } from "./_generated/server";
import { clerkOrgId } from "./lib/auth";
import { barkDocFields, caseDocFields } from "./lib/validators";

const barkDoc = v.object({
  ...barkDocFields,
  _id: v.id("barks"),
  _creationTime: v.number(),
});

const caseDoc = v.object({
  ...caseDocFields,
  _id: v.id("cases"),
  _creationTime: v.number(),
});

const activityMonth = v.object({
  month: v.string(),
  barks: v.number(),
  cases: v.number(),
  evidence: v.number(),
});

const dashboardDoc = v.object({
  stats: v.object({
    totalBarks: v.number(),
    activeCases: v.number(),
    researchActivity: v.number(),
  }),
  activity: v.array(activityMonth),
  recentBarks: v.array(barkDoc),
  activeCases: v.array(caseDoc),
});

function emptyActivity(now: number) {
  return lastSixMonths(now).map(({ month }) => ({
    month,
    barks: 0,
    cases: 0,
    evidence: 0,
  }));
}

function emptyDashboard(now = Date.now()) {
  return {
    stats: { totalBarks: 0, activeCases: 0, researchActivity: 0 },
    activity: emptyActivity(now),
    recentBarks: [],
    activeCases: [],
  };
}

function lastSixMonths(now: number) {
  const d = new Date(now);
  const months: { key: string; month: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1));
    months.push({
      key: `${dt.getUTCFullYear()}-${dt.getUTCMonth()}`,
      month: dt.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
    });
  }
  return months;
}

function monthKey(ts: number) {
  const dt = new Date(ts);
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth()}`;
}

export const dashboard = query({
  args: {},
  returns: dashboardDoc,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const orgId = identity
      ? clerkOrgId(identity as unknown as Record<string, unknown>)
      : null;
    if (!orgId) return emptyDashboard();

    const now = Date.now();
    const barks = await ctx.db
      .query("barks")
      .withIndex("by_org_status_publishedAt", (q) =>
        q.eq("orgClerkId", orgId).eq("status", "public")
      )
      .order("desc")
      .take(50);
    const cases = await ctx.db
      .query("cases")
      .withIndex("by_org_updatedAt", (q) => q.eq("orgClerkId", orgId))
      .order("desc")
      .take(50);

    const withEvidence = barks.filter((bark) => bark.evidence.length > 0).length;
    const activeCases = cases.filter(
      (row) => row.status === "open" || row.status === "under-review"
    );
    const buckets = lastSixMonths(now);
    const byKey = new Map(
      buckets.map((row) => [
        row.key,
        { month: row.month, barks: 0, cases: 0, evidence: 0 },
      ])
    );
    for (const bark of barks) {
      const bucket = byKey.get(monthKey(bark.publishedAt));
      if (!bucket) continue;
      bucket.barks += 1;
      bucket.evidence += bark.evidence.length;
    }
    for (const row of cases) {
      const bucket = byKey.get(monthKey(row.openedAt));
      if (!bucket) continue;
      bucket.cases += 1;
      bucket.evidence += row.evidence.length;
    }

    return {
      stats: {
        totalBarks: barks.length,
        activeCases: activeCases.length,
        researchActivity:
          barks.length === 0
            ? 0
            : Math.round((withEvidence / barks.length) * 100),
      },
      activity: buckets.map((row) => byKey.get(row.key)!),
      recentBarks: barks.slice(0, 2),
      activeCases: activeCases.slice(0, 3),
    };
  },
});
