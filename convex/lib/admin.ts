import type { MutationCtx, QueryCtx } from "../_generated/server";
import { clerkUserId, requireIdentity } from "./auth";

function adminClerkIds() {
  const raw = process.env.ADMIN_CLERK_IDS ?? "";
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function userRole(identity: Record<string, unknown>): string | null {
  const role =
    identity.org_role ??
    identity.orgRole ??
    identity.role ??
    (identity.publicMetadata as Record<string, unknown> | undefined)?.role ??
    (identity.public_metadata as Record<string, unknown> | undefined)?.role ??
    (identity.metadata as Record<string, unknown> | undefined)?.role;
  return typeof role === "string" && role.length > 0 ? role : null;
}

export async function isAdmin(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return false;
  const clerkId = clerkUserId(identity);
  if (adminClerkIds().includes(clerkId)) return true;
  const role = userRole(identity as unknown as Record<string, unknown>);
  return role === "org:admin" || role === "admin";
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await requireIdentity(ctx);
  const clerkId = clerkUserId(identity);
  if (adminClerkIds().includes(clerkId)) return { identity, clerkId };
  const role = userRole(identity as unknown as Record<string, unknown>);
  if (role === "org:admin" || role === "admin") {
    return { identity, clerkId };
  }
  throw new Error("Admins only");
}
