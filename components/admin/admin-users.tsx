"use client";

import { Users } from "lucide-react";
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

export function AdminUsers() {
  const { isAuthenticated } = useConvexAuth();
  const users = useQuery(api.admin.listUsers, isAuthenticated ? {} : "skip");

  return (
    <AdminGate loading="Loading users…" allowed={users}>
      {users && users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users yet"
          description="Clerk-synced members appear here after they sign in."
        />
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Reactions</TableHead>
                <TableHead>Evidence Score</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users ?? []).map((u) => (
                <TableRow key={u.clerkId}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <PersonAvatar
                        id={u.clerkId}
                        name={u.name}
                        imageUrl={u.imageUrl ?? undefined}
                        className="size-8"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{u.barkCount}</TableCell>
                  <TableCell>
                    {u.evidenceScore === null ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <span
                        className={
                          u.evidenceScore >= 90
                            ? "text-agree"
                            : "text-foreground"
                        }
                      >
                        {u.evidenceScore}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className="border-agree/30 bg-agree/15 text-agree"
                    >
                      Active
                    </Badge>
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
