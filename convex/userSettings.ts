import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";
import { contentLanguages } from "./lib/validators";

const settingsDoc = v.object({
  bio: v.string(),
  website: v.string(),
  country: v.string(),
  publicProfile: v.boolean(),
  showCountry: v.boolean(),
  searchable: v.boolean(),
  dmAnyone: v.boolean(),
  activityStatus: v.boolean(),
  prioritizeLocalFeed: v.boolean(),
  regionalTrends: v.boolean(),
  contentLanguages,
  autoTranslate: v.boolean(),
});

const updateArgs = {
  bio: v.string(),
  website: v.string(),
  country: v.string(),
  publicProfile: v.boolean(),
  showCountry: v.boolean(),
  searchable: v.boolean(),
  dmAnyone: v.boolean(),
  activityStatus: v.boolean(),
  prioritizeLocalFeed: v.boolean(),
  regionalTrends: v.boolean(),
  contentLanguages,
  autoTranslate: v.boolean(),
};

const fallbackSettings = {
  bio: "",
  website: "",
  country: "EG",
  publicProfile: true,
  showCountry: true,
  searchable: true,
  dmAnyone: false,
  activityStatus: false,
  prioritizeLocalFeed: true,
  regionalTrends: true,
  contentLanguages: "en-ar" as const,
  autoTranslate: true,
};

function resolved(
  row: {
    bio?: string;
    website?: string;
    country?: string;
    publicProfile?: boolean;
    showCountry?: boolean;
    searchable?: boolean;
    dmAnyone?: boolean;
    activityStatus?: boolean;
    prioritizeLocalFeed?: boolean;
    regionalTrends?: boolean;
    contentLanguages?: "en-ar" | "en" | "all";
    autoTranslate?: boolean;
  } | null
) {
  return {
    bio: row?.bio ?? fallbackSettings.bio,
    website: row?.website ?? fallbackSettings.website,
    country: row?.country ?? fallbackSettings.country,
    publicProfile: row?.publicProfile ?? fallbackSettings.publicProfile,
    showCountry: row?.showCountry ?? fallbackSettings.showCountry,
    searchable: row?.searchable ?? fallbackSettings.searchable,
    dmAnyone: row?.dmAnyone ?? fallbackSettings.dmAnyone,
    activityStatus: row?.activityStatus ?? fallbackSettings.activityStatus,
    prioritizeLocalFeed:
      row?.prioritizeLocalFeed ?? fallbackSettings.prioritizeLocalFeed,
    regionalTrends: row?.regionalTrends ?? fallbackSettings.regionalTrends,
    contentLanguages:
      row?.contentLanguages ?? fallbackSettings.contentLanguages,
    autoTranslate: row?.autoTranslate ?? fallbackSettings.autoTranslate,
  };
}

export const getMine = query({
  args: {},
  returns: v.union(settingsDoc, v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const rows = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) =>
        q.eq("clerkUserId", clerkUserId(identity))
      )
      .take(1);
    return resolved(rows[0] ?? null);
  },
});

export const update = mutation({
  args: updateArgs,
  returns: settingsDoc,
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const clerkId = clerkUserId(identity);
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkId))
      .take(1);
    const next = {
      clerkUserId: clerkId,
      ...args,
      updatedAt: Date.now(),
    };
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, next);
    } else {
      await ctx.db.insert("userSettings", next);
    }
    return resolved(next);
  },
});
