"use client";

import Link from "next/link";
import { Eye, Flame, Sparkles } from "lucide-react";
import { StoryCover } from "@/components/stories/story-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatNumber } from "@/lib/format";
import type { UiStory } from "@/lib/stories/query";
import { getGenreMeta } from "@/lib/story-meta";

function RankList({
  stories,
  metric,
}: {
  stories: UiStory[];
  metric: "votes" | "reads" | "new";
}) {
  if (stories.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No published stories yet.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {stories.slice(0, 5).map((story, i) => (
        <li key={story.id}>
          <Link
            href={`/stories/${story.slug}`}
            className="group flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold tabular-nums text-muted-foreground">
              {i + 1}
            </span>
            <StoryCover
              story={story}
              showTitle={false}
              className="aspect-[3/4] w-11 shrink-0 rounded-md"
            />
            <span className="min-w-0 flex-1">
              <span className="line-clamp-1 block text-sm font-semibold group-hover:text-primary">
                {story.title}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>{story.authorName}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {getGenreMeta(story.genre).label}
                </Badge>
              </span>
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {metric === "votes" && `${formatNumber(story.votes)} votes`}
              {metric === "reads" && `${formatNumber(story.reads)} reads`}
              {metric === "new" &&
                new Date(story.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function RankingsStrip({ stories }: { stories: UiStory[] }) {
  const byVotes = [...stories].sort((a, b) => b.votes - a.votes);
  const byReads = [...stories].sort((a, b) => b.reads - a.reads);
  const rising = [...stories].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <section aria-labelledby="charts-heading" className="space-y-4">
      <div>
        <h2 id="charts-heading" className="text-xl font-semibold tracking-tight">
          This week&apos;s charts
        </h2>
        <p className="text-sm text-muted-foreground">
          Latest published stories, ranked as votes and reads come in.
        </p>
      </div>
      <Card className="gap-0 p-4 sm:p-5">
        <Tabs defaultValue="hot">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="hot">
              <Flame className="size-3.5" /> Hot
            </TabsTrigger>
            <TabsTrigger value="reads">
              <Eye className="size-3.5" /> Most read
            </TabsTrigger>
            <TabsTrigger value="rising">
              <Sparkles className="size-3.5" /> New &amp; rising
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hot">
            <RankList stories={byVotes} metric="votes" />
          </TabsContent>
          <TabsContent value="reads">
            <RankList stories={byReads} metric="reads" />
          </TabsContent>
          <TabsContent value="rising">
            <RankList stories={rising} metric="new" />
          </TabsContent>
        </Tabs>
      </Card>
    </section>
  );
}
