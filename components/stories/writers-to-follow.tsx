"use client";

import Link from "next/link";
import { FollowAuthorButton } from "@/components/stories/story-actions";
import { PersonAvatar } from "@/components/person-avatar";
import { Card } from "@/components/ui/card";
import type { UiStory } from "@/lib/stories/query";

export function WritersToFollow({ stories }: { stories: UiStory[] }) {
  const writers = [];
  const seen = new Set<string>();
  for (const story of stories) {
    if (seen.has(story.authorId)) continue;
    seen.add(story.authorId);
    writers.push({
      id: story.authorId,
      name: story.authorName,
      handle: story.authorHandle,
      storiesPublished: stories.filter((s) => s.authorId === story.authorId)
        .length,
    });
    if (writers.length >= 4) break;
  }

  if (writers.length === 0) return null;

  return (
    <section aria-labelledby="writers-heading" className="space-y-4">
      <div>
        <h2 id="writers-heading" className="text-xl font-semibold tracking-tight">
          Writers to follow
        </h2>
        <p className="text-sm text-muted-foreground">
          Authors publishing on TypeReact Stories.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {writers.map((author) => (
          <Card key={author.id} className="gap-0 p-4">
            <div className="flex items-start gap-3">
              <PersonAvatar
                id={author.id}
                name={author.name}
                className="size-11"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{author.handle}
                    </p>
                  </div>
                  <FollowAuthorButton
                    name={author.name}
                    authorId={author.id}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {author.storiesPublished}{" "}
                  {author.storiesPublished === 1 ? "story" : "stories"}
                </p>
                <Link
                  href={`/stories?q=${encodeURIComponent(author.name)}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Find their work
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
