"use client";

import { BadgeCheck, Clock3, X } from "lucide-react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { PersonAvatar } from "@/components/person-avatar";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { genreMeta } from "@/lib/story-meta";
import type { StoryGenre } from "@/lib/story-types";

const cadenceLabel: Record<string, string> = {
  weekly: "weekly parts",
  biweekly: "every two weeks",
  monthly: "monthly",
  complete: "completed works",
};

function waitingLabel(createdAt: number) {
  const hours = Math.max(0, Math.floor((Date.now() - createdAt) / 3_600_000));
  if (hours < 1) return "less than an hour";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function WriterApplicationsQueue() {
  const { isAuthenticated } = useConvexAuth();
  const pending = useQuery(
    api.writers.listPending,
    isAuthenticated ? {} : "skip"
  );
  const approve = useMutation(api.writers.approve);
  const reject = useMutation(api.writers.reject);

  const act = async (
    writerId: Id<"writers">,
    action: "approve" | "reject"
  ) => {
    try {
      if (action === "approve") await approve({ writerId });
      else await reject({ writerId });
      toast.success(
        action === "approve" ? "Writer approved" : "Application rejected"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update application"
      );
    }
  };

  if (pending === undefined) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Loading applications…
      </p>
    );
  }

  if (pending.length === 0) {
    return (
      <EmptyState
        icon={Clock3}
        title="No pending applications"
        description="Writer applications appear here until they are approved or rejected."
      />
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((row) => {
        const genres = row.genres
          .map((g) => genreMeta[g as StoryGenre]?.label ?? g)
          .join(", ");
        return (
          <Card key={row._id} className="flex-row items-center gap-4 p-4">
            <PersonAvatar
              id={row._id}
              name={row.penName}
              className="size-10"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {row.penName}{" "}
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  {row.applicationCode}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Sample: &ldquo;{row.sampleTitle}&rdquo; · {genres} ·{" "}
                {cadenceLabel[row.cadence] ?? row.cadence} · waiting{" "}
                {waitingLabel(row.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" onClick={() => act(row._id, "approve")}>
                <BadgeCheck className="size-3.5" /> Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => act(row._id, "reject")}
              >
                <X className="size-3.5" /> Reject
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
