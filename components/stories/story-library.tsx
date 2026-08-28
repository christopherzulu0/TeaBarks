"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Play } from "lucide-react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { EmptyState } from "@/components/empty-state";
import { StoryCover } from "@/components/stories/story-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { timeAgo } from "@/lib/format";
import { readUserJson, STORAGE_KEYS } from "@/lib/storage";
import { toUiStory, type UiStory } from "@/lib/stories/query";

const EMPTY_PROGRESS: {
  story: UiStory;
  chapter: number;
  percent: number;
  lastReadAt: string;
}[] = [];

export function StoryLibrary({ initialStories }: { initialStories: UiStory[] }) {
  const { user } = useUser();
  const docs = useQuery(api.stories.listPublic);
  const stories = React.useMemo(
    () => (docs ? docs.map((doc) => toUiStory(doc)) : initialStories),
    [docs, initialStories]
  );
  const userId = user?.id;
  const [canReadStorage, setCanReadStorage] = React.useState(false);

  React.useEffect(() => {
    setCanReadStorage(true);
  }, []);

  const inProgress = React.useMemo(() => {
    if (!canReadStorage || !userId) return EMPTY_PROGRESS;
    const items = [];
    for (const story of stories) {
      const parsed = readUserJson<{
        chapter?: number;
        percent?: number;
        at?: number;
      } | null>(userId, STORAGE_KEYS.reading(story.slug), null);
      if (!parsed?.chapter) continue;
      items.push({
        story,
        chapter: parsed.chapter,
        percent: Math.min(100, Math.max(0, parsed.percent ?? 0)),
        lastReadAt: parsed.at
          ? new Date(parsed.at).toISOString()
          : new Date().toISOString(),
      });
    }
    items.sort(
      (a, b) =>
        new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
    );
    return items;
  }, [canReadStorage, stories, userId]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Library</h1>
        <p className="text-sm text-muted-foreground">
          Pick up where you left off.
        </p>
      </div>

      <section aria-labelledby="continue-heading" className="space-y-4">
        <h2 id="continue-heading" className="text-xl font-semibold tracking-tight">
          Continue reading
        </h2>
        {inProgress.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nothing in progress"
            description="Open a published chapter and your place will be saved in this browser."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {inProgress.map(({ story, chapter, percent, lastReadAt }) => (
              <Card key={story.id} className="gap-0 overflow-hidden p-0">
                <div className="flex gap-3 p-3">
                  <StoryCover
                    story={story}
                    className="aspect-[3/4] w-16 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      href={`/stories/${story.slug}`}
                      className="line-clamp-1 text-sm font-semibold hover:text-primary"
                    >
                      {story.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {story.authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Part {chapter} of {story.partCount} · read{" "}
                      {timeAgo(lastReadAt)}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Progress
                        value={percent}
                        className="h-1.5 flex-1"
                        aria-label={`${percent}% through ${story.title}`}
                      />
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {percent}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t p-2">
                  <Button asChild size="sm" variant="ghost" className="w-full">
                    <Link href={`/stories/${story.slug}/chapters/${chapter}`}>
                      <Play className="size-3.5" /> Resume part {chapter}
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="lists-heading" className="space-y-4">
        <h2 id="lists-heading" className="text-xl font-semibold tracking-tight">
          Reading lists
        </h2>
        <EmptyState
          icon={CheckCircle2}
          title="Lists are not saved yet"
          description="Add to list still works as a local reminder. Published stories live in Continue reading after you open a chapter."
        />
      </section>
    </div>
  );
}
