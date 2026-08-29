"use client";

import Link from "next/link";
import { Flag } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { AdminGate } from "@/components/admin/admin-gate";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { reportCategoryMeta, reportSeverityMeta } from "@/lib/meta";

export function AdminReports() {
  const { isAuthenticated } = useConvexAuth();
  const reports = useQuery(
    api.admin.listReports,
    isAuthenticated ? {} : "skip"
  );

  return (
    <AdminGate loading="Loading reports…" allowed={reports}>
      {reports && reports.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No reports"
          description="Reaction, case, and story reports appear here for review."
        />
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(reports ?? []).map((r) => {
                const categoryMeta = reportCategoryMeta[r.category];
                const severity = reportSeverityMeta[categoryMeta.severity];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">
                      {r.id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {r.target}
                    </TableCell>
                    <TableCell className="hidden max-w-64 md:table-cell">
                      <p className="truncate text-sm">{categoryMeta.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.reporterName}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={severity.badgeClass}>
                        {severity.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden capitalize sm:table-cell">
                      <Badge variant="secondary">{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={r.href}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminGate>
  );
}
