"use client";

import { BadgeCheck, UserRound } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { AdminGate } from "@/components/admin/admin-gate";
import { EmptyState } from "@/components/empty-state";
import { PersonAvatar } from "@/components/person-avatar";
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
import { formatNumber } from "@/lib/format";

const profileLabel = {
  approved: "Claimed",
  pending: "Pending",
  rejected: "Rejected",
} as const;

export function AdminCreators() {
  const { isAuthenticated } = useConvexAuth();
  const creators = useQuery(
    api.admin.listCreators,
    isAuthenticated ? {} : "skip"
  );

  return (
    <AdminGate loading="Loading creators…" allowed={creators}>
      {creators && creators.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No creator applications"
          description="Pending, approved, and rejected creator profiles appear here."
        />
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead className="hidden sm:table-cell">Profile</TableHead>
                <TableHead>Barks Received</TableHead>
                <TableHead className="hidden md:table-cell">
                  Response Rate
                </TableHead>
                <TableHead>Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(creators ?? []).map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <PersonAvatar
                        id={c.applicantClerkId}
                        name={c.name}
                        className="size-8"
                      />
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          @{c.handle}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {c.status === "approved" ? (
                      <Badge variant="secondary">
                        {profileLabel[c.status]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{profileLabel[c.status]}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatNumber(c.totalBarksReceived)}
                  </TableCell>
                  <TableCell className="hidden tabular-nums md:table-cell">
                    {c.responseRate}%
                  </TableCell>
                  <TableCell>
                    {c.verified ? (
                      <BadgeCheck
                        className="size-4 text-verified"
                        aria-label="Verified"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminGate>
  );
}
