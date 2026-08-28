"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { storyCoverUrl } from "@/lib/story-covers";
import { getGenreMeta, storyStatusMeta } from "@/lib/story-meta";
import type { Story } from "@/lib/story-types";
import type { UiStory } from "@/lib/stories/query";
import { cn } from "@/lib/utils";

export function StoryCover({
  story,
  className,
  showTitle = true,
}: {
  story: Story;
  className?: string;
  /** Overlay the title on the image (cards). Detail pages can hide it. */
  showTitle?: boolean;
}) {
  const genre = getGenreMeta(story.genre);
  const Icon = genre.icon;
  const src = storyCoverUrl(story);

  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden rounded-lg bg-muted",
        className
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
        aria-hidden
      />
      <Icon
        className="absolute right-3 top-3 z-10 size-5 text-white/70 drop-shadow"
        aria-hidden
      />
      {showTitle && (
        <p className="relative z-10 line-clamp-3 p-3 text-sm font-bold leading-snug text-white drop-shadow-sm">
          {story.title}
        </p>
      )}
    </div>
  );
}

export function StoryCard({
  story,
  authorName,
}: {
  story: (Story | UiStory) & { partCount?: number; authorName?: string };
  authorName?: string;
}) {
  const name = authorName ?? story.authorName ?? "Writer";
  const parts = story.partCount ?? story.chapters.length;
  const genre = getGenreMeta(story.genre);
  const status = storyStatusMeta[story.status];

  return (
    <Link href={`/stories/${story.slug}`} className="group block h-full">
      <Card className="h-full gap-0 overflow-hidden p-0 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
        <StoryCover story={story} className="aspect-[16/9]" />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {genre.label}
            </Badge>
            <Badge
              variant="outline"
              className={`${status.badgeClass} text-[10px]`}
            >
              {status.label}
            </Badge>
            {story.mature && (
              <Badge
                variant="outline"
                className="bg-disagree/10 text-disagree border-disagree/30 text-[10px]"
              >
                Mature
              </Badge>
            )}
          </div>
          <h3 className="line-clamp-1 font-semibold tracking-tight group-hover:text-primary">
            {story.title}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {story.blurb}
          </p>
          <p className="text-xs text-muted-foreground">by {name}</p>
          <div className="flex items-center gap-3 border-t pt-2.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" aria-hidden />
              {formatNumber(story.reads)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3.5" aria-hidden />
              {formatNumber(story.votes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5" aria-hidden />
              {parts} parts
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
