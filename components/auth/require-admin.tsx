"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { RouteLoading } from "@/components/route-loading";

export function isUserClerkAdmin(
  user: ReturnType<typeof useUser>["user"],
  auth: ReturnType<typeof useAuth>
): boolean {
  if (!user && !auth.userId) return false;

  const userId = user?.id ?? auth.userId;
  if (!userId) return false;

  if (auth.has?.({ role: "org:admin" }) || auth.has?.({ role: "admin" })) {
    return true;
  }

  if (auth.orgRole === "org:admin" || auth.orgRole === "admin") {
    return true;
  }

  const role =
    (user?.publicMetadata as Record<string, unknown> | undefined)?.role ??
    (user?.unsafeMetadata as Record<string, unknown> | undefined)?.role;
  if (role === "admin" || role === "org:admin") {
    return true;
  }

  const claims = auth.sessionClaims as Record<string, unknown> | undefined;
  if (claims) {
    if (claims.role === "admin" || claims.role === "org:admin") return true;
    if (claims.org_role === "org:admin" || claims.org_role === "admin") return true;
    const metadata =
      (claims.metadata as Record<string, unknown> | undefined)?.role ??
      (claims.public_metadata as Record<string, unknown> | undefined)?.role ??
      (claims.publicMetadata as Record<string, unknown> | undefined)?.role;
    if (metadata === "admin" || metadata === "org:admin") return true;
  }

  return false;
}

export function useIsAdmin(): boolean {
  const { user, isLoaded: isUserLoaded } = useUser();
  const auth = useAuth();

  if (!isUserLoaded || !auth.isLoaded) return false;
  return isUserClerkAdmin(user, auth);
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const auth = useAuth();

  if (!isAuthLoaded || !isUserLoaded) {
    return <RouteLoading variant="detail" />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const isAdmin = isUserClerkAdmin(user, auth);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          icon={Shield}
          title="Admin access required"
          description="Only users with the admin role from Clerk are authorized to access this page."
          action={
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
