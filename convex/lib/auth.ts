import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export function clerkUserId(identity: { subject: string }) {
  return identity.subject;
}

export function clerkOrgId(identity: Record<string, unknown>): string | null {
  const orgId = identity.org_id ?? identity.orgId;
  return typeof orgId === "string" && orgId.length > 0 ? orgId : null;
}

function claimString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isOrgAdmin(identity: Record<string, unknown>): boolean {
  if (!clerkOrgId(identity)) return false;
  const nested =
    identity.o && typeof identity.o === "object"
      ? (identity.o as Record<string, unknown>)
      : null;
  const role =
    claimString(identity.org_role) ??
    claimString(identity.orgRole) ??
    claimString(nested?.rol) ??
    claimString(nested?.role);
  return role === "org:admin" || role === "admin";
}

function addFeatureSlug(slugs: Set<string>, raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return;
  const slug = trimmed.includes(":")
    ? trimmed.slice(trimmed.indexOf(":") + 1).trim()
    : trimmed;
  if (slug) slugs.add(slug);
}

function featureSlugsFromIdentity(identity: Record<string, unknown>): Set<string> {
  const slugs = new Set<string>();
  const collect = (value: unknown) => {
    if (typeof value === "string") {
      for (const part of value.split(/[,;]+/)) addFeatureSlug(slugs, part);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) collect(item);
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, nested] of Object.entries(value)) {
        if (nested === true) addFeatureSlug(slugs, key);
        else collect(nested);
      }
    }
  };
  collect(identity.fea);
  collect(identity.features);
  collect(identity.feature);
  return slugs;
}

const FREE_PLANS = new Set([
  "free",
  "free_user",
  "free_org",
  "free-user",
  "free-org",
]);

function hasPaidPlan(identity: Record<string, unknown>): boolean {
  const plans = new Set<string>();
  const collect = (value: unknown) => {
    if (typeof value === "string") {
      for (const part of value.split(/[,;]+/)) addFeatureSlug(plans, part);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) collect(item);
    }
  };
  collect(identity.pla);
  collect(identity.plan);
  collect(identity.plans);
  for (const plan of plans) {
    const slug = plan.replace(/^org:/, "").toLowerCase();
    if (slug && !FREE_PLANS.has(slug)) return true;
  }
  return false;
}

/** Org admins pass. Everyone else needs a paid plan or the billing feature on the JWT. */
export function requireBillingFeature(identity: object, slug: string) {
  const claims = identity as Record<string, unknown>;
  if (isOrgAdmin(claims)) return;
  if (featureSlugsFromIdentity(claims).has(slug)) return;
  if (hasPaidPlan(claims)) return;
  throw new Error("This feature is on a paid plan");
}
