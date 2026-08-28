"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/** Personal accounts pass; org members need the named permission. */
export function PermissionGate({
  permission,
  children,
  fallback,
  hideWhenDenied = false,
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  hideWhenDenied?: boolean;
}) {
  const { isLoaded, orgId, has } = useAuth();
  if (!isLoaded) return null;

  const allowed =
    !orgId ||
    Boolean(has?.({ permission })) ||
    Boolean(has?.({ role: "org:admin" }));

  if (allowed) return <>{children}</>;
  if (hideWhenDenied) return null;

  return (
    <>
      {fallback ?? (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Your organization role cannot do this.{" "}
          <Link href="/org" className="text-primary hover:underline">
            Manage organization
          </Link>
          {" · "}
          <Button asChild variant="link" className="h-auto p-0">
            <Link href="/pricing">Upgrade</Link>
          </Button>
        </div>
      )}
    </>
  );
}
