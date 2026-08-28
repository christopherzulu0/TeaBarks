"use client";

import * as React from "react";
import { Check, Heart, ListPlus, UserPlus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { readingLists } from "@/lib/story-data";
import { formatNumber } from "@/lib/format";

export function FollowAuthorButton({
  name,
  authorId,
}: {
  name: string;
  authorId?: string;
}) {
  const { isSignedIn } = useAuth();
  const writerId = authorId as Id<"writers"> | undefined;
  const state = useQuery(
    api.storySocial.followState,
    writerId ? { writerId } : "skip"
  );
  const toggleFollow = useMutation(api.storySocial.toggleFollowWriter);
  const following = state?.following ?? false;

  return (
    <Button
      size="sm"
      variant={following ? "outline" : "default"}
      onClick={() => {
        void (async () => {
          if (!isSignedIn) {
            toast.message("Sign in to follow this writer");
            return;
          }
          if (!writerId) return;
          try {
            const next = await toggleFollow({ writerId });
            toast.success(
              next.following ? `Following ${name}` : `Unfollowed ${name}`
            );
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Could not update follow"
            );
          }
        })();
      }}
    >
      {following ? (
        <>
          <Check className="size-3.5" /> Following
        </>
      ) : (
        <>
          <UserPlus className="size-3.5" /> Follow
        </>
      )}
    </Button>
  );
}

export function AddToListButton({ storyTitle }: { storyTitle: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListPlus className="size-3.5" /> Add to list
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Save to reading list</DropdownMenuLabel>
        {readingLists.map((l) => (
          <DropdownMenuItem
            key={l.id}
            onSelect={() =>
              toast.success(`Added to "${l.name}"`, {
                description: storyTitle,
              })
            }
          >
            {l.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            toast.success("New list created", {
              description: `"${storyTitle}" saved to it.`,
            })
          }
        >
          + New list
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VoteButton({
  initialVotes,
  size = "sm",
  slug,
}: {
  initialVotes: number;
  size?: "sm" | "default";
  slug: string;
}) {
  const { isSignedIn } = useAuth();
  const state = useQuery(api.storySocial.likeState, { slug });
  const toggleLike = useMutation(api.storySocial.toggleLike);
  const votes = state?.votes ?? initialVotes;
  const voted = state?.liked ?? false;

  return (
    <Button
      variant={voted ? "default" : "outline"}
      size={size}
      onClick={() => {
        void (async () => {
          if (!isSignedIn) {
            toast.message("Sign in to vote");
            return;
          }
          try {
            await toggleLike({ slug });
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Could not update vote"
            );
          }
        })();
      }}
      aria-pressed={voted}
    >
      <Heart className={voted ? "size-3.5 fill-current" : "size-3.5"} />
      {formatNumber(votes)}
    </Button>
  );
}
