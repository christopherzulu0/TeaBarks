"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { StorySettingsDialog } from "@/components/stories/story-settings-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { StoryGenre, StoryStatus } from "@/lib/story-types";

export function StoryOwnerActions({
  slug,
  writerId,
  title,
  blurb,
  genre,
  tags,
  mature,
  status,
}: {
  slug: string;
  writerId: string;
  title: string;
  blurb: string;
  genre: StoryGenre;
  tags: string[];
  mature: boolean;
  status: StoryStatus;
}) {
  const { isAuthenticated } = useConvexAuth();
  const mine = useQuery(api.writers.getMine, isAuthenticated ? {} : "skip");
  if (!mine || mine._id !== writerId) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StorySettingsDialog
        slug={slug}
        title={title}
        blurb={blurb}
        genre={genre}
        tags={tags}
        mature={mature}
        status={status}
      />
      <Button size="sm" asChild>
        <Link href={`/stories/write/${slug}`}>
          <PenLine className="size-3.5" /> Write
        </Link>
      </Button>
    </div>
  );
}
