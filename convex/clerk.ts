import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import {
  membershipFields,
  organizationFields,
  subscriptionFields,
  userFields,
  webhookEventFields,
} from "./lib/validators";

const userDoc = v.object(userFields);
const organizationDoc = v.object(organizationFields);
const membershipDoc = v.object(membershipFields);
const subscriptionDoc = v.object(subscriptionFields);
const webhookEventDoc = v.object(webhookEventFields);

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeUsername(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const username = value.trim().replace(/^@/, "").toLowerCase();
  return username.length > 0 ? username : null;
}

function nested(value: unknown): Record<string, unknown> {
  return asRecord(value);
}

export const ingest = internalMutation({
  args: {
    type: v.string(),
    payloadJson: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    let data: unknown = {};
    try {
      data = JSON.parse(args.payloadJson) as unknown;
    } catch {
      data = {};
    }
    const record = asRecord(data);
    const now = Date.now();
    const clerkId = asString(record.id, args.type);

    await ctx.db.insert("webhookEvents", {
      type: args.type,
      clerkId,
      at: now,
    });

    switch (args.type) {
      case "user.created":
      case "user.updated": {
        const emails = Array.isArray(record.email_addresses)
          ? record.email_addresses
          : [];
        const firstEmail = asRecord(emails[0]);
        const name =
          `${asString(record.first_name)} ${asString(record.last_name)}`.trim() ||
          "Member";
        const existing = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
          .unique();
        const username = normalizeUsername(record.username);
        let uniqueUsername: string | undefined;
        if (username) {
          const taken = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", username))
            .take(1);
          if (!taken[0] || taken[0].clerkId === clerkId) {
            uniqueUsername = username;
          }
        }
        const doc = {
          clerkId,
          email: asString(firstEmail.email_address),
          name,
          imageUrl: asString(record.image_url) || undefined,
          updatedAt: now,
          ...(uniqueUsername ? { username: uniqueUsername } : {}),
        };
        if (existing) await ctx.db.patch(existing._id, doc);
        else await ctx.db.insert("users", doc);
        break;
      }
      case "user.deleted": {
        if (!clerkId) break;
        const existing = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
          .unique();
        if (existing) await ctx.db.delete(existing._id);
        const memberships = await ctx.db
          .query("memberships")
          .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkId))
          .take(50);
        for (const m of memberships) await ctx.db.delete(m._id);
        break;
      }
      case "organization.created":
      case "organization.updated": {
        const existing = await ctx.db
          .query("organizations")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
          .unique();
        const doc = {
          clerkId,
          name: asString(record.name, "Organization"),
          slug: asString(record.slug, clerkId),
          updatedAt: now,
        };
        if (existing) await ctx.db.patch(existing._id, doc);
        else await ctx.db.insert("organizations", doc);
        break;
      }
      case "organization.deleted": {
        if (!clerkId) break;
        const existing = await ctx.db
          .query("organizations")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
          .unique();
        if (existing) await ctx.db.delete(existing._id);
        break;
      }
      case "organizationMembership.created":
      case "organizationMembership.updated": {
        const org = nested(record.organization);
        const user = nested(record.public_user_data);
        const orgId = asString(org.id);
        const userId = asString(user.user_id);
        const memberships = await ctx.db
          .query("memberships")
          .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", userId))
          .take(50);
        const existing = memberships.find((m) => m.clerkMembershipId === clerkId);
        const doc = {
          clerkMembershipId: clerkId,
          clerkOrgId: orgId,
          clerkUserId: userId,
          role: asString(record.role, "org:member"),
          updatedAt: now,
        };
        if (existing) await ctx.db.patch(existing._id, doc);
        else await ctx.db.insert("memberships", doc);
        break;
      }
      case "organizationMembership.deleted": {
        const user = nested(record.public_user_data);
        const userId = asString(user.user_id);
        if (!userId) break;
        const memberships = await ctx.db
          .query("memberships")
          .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", userId))
          .take(50);
        const existing = memberships.find((m) => m.clerkMembershipId === clerkId);
        if (existing) await ctx.db.delete(existing._id);
        break;
      }
      default: {
        if (
          args.type.startsWith("subscription.") ||
          args.type.startsWith("paymentAttempt.")
        ) {
          const payer = nested(record.payer);
          const plan = nested(record.plan);
          if (!clerkId) break;
          const existing = await ctx.db
            .query("subscriptions")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .unique();
          const doc = {
            clerkId,
            payerId: asString(payer.id, "unknown"),
            status: asString(record.status, args.type),
            plan: asString(plan.slug) || undefined,
            updatedAt: now,
          };
          if (existing) await ctx.db.patch(existing._id, doc);
          else await ctx.db.insert("subscriptions", doc);
        }
      }
    }
    return null;
  },
});

export const listSynced = query({
  args: {},
  returns: v.object({
    users: v.array(userDoc),
    organizations: v.array(organizationDoc),
    memberships: v.array(membershipDoc),
    subscriptions: v.array(subscriptionDoc),
    events: v.array(webhookEventDoc),
  }),
  handler: async (ctx) => {
    const strip = <T extends { _id: unknown; _creationTime: number }>(
      docs: T[]
    ) =>
      docs.map(({ _id: _unused, _creationTime: _t, ...rest }) => rest) as Omit<
        T,
        "_id" | "_creationTime"
      >[];

    const users = await ctx.db.query("users").take(50);
    const organizations = await ctx.db.query("organizations").take(50);
    const memberships = await ctx.db.query("memberships").take(50);
    const subscriptions = await ctx.db.query("subscriptions").take(20);
    const events = await ctx.db.query("webhookEvents").take(40);

    return {
      users: strip(users),
      organizations: strip(organizations),
      memberships: strip(memberships),
      subscriptions: strip(subscriptions),
      events: strip(events),
    };
  },
});
