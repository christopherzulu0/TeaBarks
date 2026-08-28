"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { RouteLoading } from "@/components/route-loading";
import { ContinueWriting } from "@/components/stories/continue-writing";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { getGenreMeta } from "@/lib/story-meta";
import Link from "next/link";
import { PenLine } from "lucide-react";

export function ContinueWritingRoute() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { isAuthenticated, isLoading } = useConvexAuth();
  const live = useQuery(
    api.stories.getMineBySlug,
    isAuthenticated && slug ? { slug } : "skip"
  );

  if (!slug || isLoading) {
    return <RouteLoading variant="detail" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          icon={PenLine}
          title="Draft not found"
          description="This story is missing, or you do not have access to edit it."
          action={
            <Button asChild>
              <Link href="/stories/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (live === undefined) {
    return <RouteLoading variant="detail" />;
  }

  if (live === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          icon={PenLine}
          title="Draft not found"
          description="This story is missing, or you do not have access to edit it."
          action={
            <Button asChild>
              <Link href="/stories/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const nextNumber = live.draft
    ? live.draft.number
    : live.publishedChapterCount + 1;

  return (
    <ContinueWriting
      storyTitle={live.story.title}
      slug={slug}
      genreLabel={getGenreMeta(live.story.genre).label}
      initialTitle={live.draft?.title ?? `Part ${nextNumber}`}
      initialBody={live.draft?.body ?? ""}
    />
  );
}
