"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { AdminGate } from "@/components/admin/admin-gate";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
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

export function AdminFlaggedStories() {
  const { isAuthenticated } = useConvexAuth();
  const reports = useQuery(
    api.admin.listStoryReports,
    isAuthenticated ? {} : "skip"
  );

  return (
    <AdminGate loading="Loading flagged stories…" allowed={reports}>
      {reports && reports.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No flagged stories"
          description="Story reports appear here until they are reviewed."
        />
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Story</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
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
                    <TableCell className="max-w-40 truncate text-sm">
                      <Link href={r.href} className="hover:underline">
                        {r.story}
                      </Link>
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
