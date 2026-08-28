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
