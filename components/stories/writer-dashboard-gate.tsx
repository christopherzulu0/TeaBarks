"use client";

import Link from "next/link";
import { Clock3, Loader2, PenLine } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { EmptyState } from "@/components/empty-state";
import { ApprovedWriterDashboard } from "@/components/stories/writer-dashboard";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { MineStory } from "@/lib/stories/query";
import { toUiWriter, type WriterProfile } from "@/lib/writers/query";

export function WriterDashboardGate({
  initialWriter,
  initialStories,
}: {
  initialWriter: WriterProfile | null;
  initialStories: MineStory[];
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const application = useQuery(
    api.writers.getMyApplication,
    isAuthenticated ? {} : "skip"
  );

  if (isLoading || (isAuthenticated && application === undefined)) {
    if (initialWriter) {
      return (
        <ApprovedWriterDashboard
          writer={initialWriter}
          initialStories={initialStories}
        />
      );
    }
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-24">
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-label="Loading writer status"
        />
      </div>
    );
  }

  if (application?.status === "approved") {
    return (
      <ApprovedWriterDashboard
        writer={toUiWriter(application)}
        initialStories={initialStories}
      />
    );
  }

  if (application?.status === "pending") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EmptyState
          icon={Clock3}
          title="Application under review"
          description={`Application ${application.applicationCode} is with the editorial team. This dashboard opens after approval.`}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <EmptyState
        icon={PenLine}
        title="Writer access is not approved yet"
        description="Submit a writer application and wait for editorial approval before this dashboard opens."
        action={
          application === null ? (
            <Button asChild>
              <Link href="/stories/apply">Become a Writer</Link>
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
