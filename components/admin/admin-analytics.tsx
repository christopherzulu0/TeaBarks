"use client";

import * as React from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { AdminGate } from "@/components/admin/admin-gate";
import { GrowthChart } from "@/components/admin/admin-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";

export function AdminAnalytics() {
  const { isAuthenticated } = useConvexAuth();
  const nowMs = React.useMemo(() => Date.now(), []);
  const growth = useQuery(
    api.admin.growth,
    isAuthenticated ? { nowMs } : "skip"
  );

  return (
    <AdminGate loading="Loading analytics…" allowed={growth}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Growth</CardTitle>
          <CardDescription>
            Cumulative users, published reactions, cases, and stories over the last
            six months
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          <GrowthChart data={growth ?? []} />
        </CardContent>
      </Card>
    </AdminGate>
  );
}
