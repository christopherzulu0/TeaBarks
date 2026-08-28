"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { StoryCover } from "@/components/stories/story-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { timeAgo } from "@/lib/format";
import { readUserJson, STORAGE_KEYS } from "@/lib/storage";
import type { UiStory } from "@/lib/stories/query";

type ProgressItem = {
  storyId: string;
  slug: string;
  chapter: number;
  percent: number;
  lastReadAt: string;
};

function loadProgress(stories: UiStory[], userId?: string): ProgressItem[] {
  if (!userId) return [];
  const items: ProgressItem[] = [];
  for (const story of stories) {
    const parsed = readUserJson<{
      chapter?: number;
      percent?: number;
      at?: number;
    } | null>(userId, STORAGE_KEYS.reading(story.slug), null);
    if (!parsed?.chapter) continue;
    items.push({
      storyId: story.id,
      slug: story.slug,
      chapter: parsed.chapter,
      percent: Math.min(100, Math.max(0, parsed.percent ?? 0)),
      lastReadAt: parsed.at
        ? new Date(parsed.at).toISOString()
        : new Date().toISOString(),
    });
  }
  return items.sort(
    (a, b) =>
      new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
  );
}

const EMPTY_IDS: string[] = [];
const EMPTY_PROGRESS: ProgressItem[] = [];

export function ContinueReadingRail({
  stories,
  excludeStoryIds = EMPTY_IDS,
}: {
  stories: UiStory[];
  excludeStoryIds?: string[];
}) {
  const { user } = useUser();
  const userId = user?.id;
  const [canReadStorage, setCanReadStorage] = React.useState(false);

  React.useEffect(() => {
    setCanReadStorage(true);
  }, []);

  const excludeKey = excludeStoryIds.join(",");
  const items = React.useMemo(() => {
    if (!canReadStorage) return EMPTY_PROGRESS;
    const exclude = new Set(excludeKey ? excludeKey.split(",") : []);
    return loadProgress(stories, userId)
      .filter((p) => !exclude.has(p.storyId))
      .slice(0, 3);
  }, [canReadStorage, excludeKey, stories, userId]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="continue-home-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="continue-home-heading"
          className="text-xl font-semibold tracking-tight"
        >
          Continue reading
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/stories/library">
            Library <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((p) => {
          const story = stories.find((s) => s.id === p.storyId);
          if (!story) return null;
          const chapter = Math.min(p.chapter, Math.max(story.partCount, 1));
          return (
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
                    Part {chapter} of {story.partCount} · {timeAgo(p.lastReadAt)}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Progress
                      value={p.percent}
                      className="h-1.5 flex-1"
                      aria-label={`${p.percent}% through ${story.title}`}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {p.percent}%
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
          );
        })}
      </div>
    </section>
  );
}
