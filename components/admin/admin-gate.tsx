"use client";

import type { ReactNode } from "react";
import { Shield } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export function AdminGate({
  loading,
  allowed,
  children,
}: {
  loading: string;
  allowed: unknown;
  children: ReactNode;
}) {
  if (allowed === undefined) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">{loading}</p>
    );
  }
  if (allowed === null) {
    return (
      <EmptyState
        icon={Shield}
        title="Admins only"
        description="This view is limited to site admins. Ask to be added to ADMIN_CLERK_IDS, or use an organization admin role."
      />
    );
  }
  return children;
}
