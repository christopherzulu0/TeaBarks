"use client";

import { PricingTable, useAuth } from "@clerk/nextjs";

export function OrgPricingTable() {
  const { isLoaded, orgId } = useAuth();
  if (!isLoaded) return null;
  if (!orgId) {
    return (
      <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Select an organization in the header to subscribe to Team, Newsroom, or
        Enterprise.
      </p>
    );
  }
  return <PricingTable for="organization" />;
}
