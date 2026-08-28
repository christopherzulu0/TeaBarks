"use client";

import * as React from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function ContestEntryDialog({
  contestId,
  contestName,
}: {
  contestId: Id<"contests">;
  contestName: string;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const writer = useQuery(
    api.writers.getMine,
    isAuthenticated ? {} : "skip"
  );
  const application = useQuery(
    api.writers.getMyApplication,
    isAuthenticated ? {} : "skip"
  );
  const entries = useQuery(
    api.contests.listMineEntries,
    isAuthenticated ? {} : "skip"
  );
  const stories = useQuery(
    api.stories.listMine,
    isAuthenticated && writer ? {} : "skip"
  );
  const enterContest = useMutation(api.contests.enter);

  const [open, setOpen] = React.useState(false);
  const [storyId, setStoryId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const existing = entries?.find((row) => row.contestId === contestId);
  const eligible =
    stories?.filter(
      (story) => story.visibility === "public" && story.publishedChapterCount > 0
    ) ?? [];

  const statusLoading =
    isLoading ||
    (isAuthenticated &&
      (writer === undefined ||
        application === undefined ||
        entries === undefined));

  const submit = async () => {
    if (!storyId) {
      toast.error("Pick a story to enter.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await enterContest({
        contestId,
        storyId: storyId as Id<"stories">,
      });
      toast.success(`Entered "${result.storyTitle}"`, {
        description: `Good luck in ${contestName}. Judging is blind — reads and votes don't count.`,
      });
      setOpen(false);
      setStoryId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not submit entry"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (statusLoading) {
    return (
      <Button size="sm" disabled>
        <Send className="size-3.5" /> Enter with a story
      </Button>
    );
  }

  if (existing) {
    return (
      <Button size="sm" variant="outline" disabled>
        Entered · {existing.storyTitle}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <SignInButton>
        <Button size="sm">
          <Send className="size-3.5" /> Sign in to enter
        </Button>
      </SignInButton>
    );
  }

  if (!writer) {
    const href =
      application?.status === "pending" ? "/stories/dashboard" : "/stories/apply";
    const label =
      application?.status === "pending"
        ? "Application under review"
        : "Become a Writer";
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={href}>{label}</Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Send className="size-3.5" /> Enter with a story
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter {contestName}</DialogTitle>
          <DialogDescription>
            Choose one of your published stories. One entry per writer.
          </DialogDescription>
        </DialogHeader>
        {stories === undefined ? (
          <p className="text-sm text-muted-foreground">Loading your stories…</p>
        ) : eligible.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Publish a story with at least one part from the{" "}
            <Link
              href="/stories/dashboard"
              className="text-primary underline underline-offset-4"
            >
              writer dashboard
            </Link>{" "}
            before you can enter.
          </p>
        ) : (
          <RadioGroup
            value={storyId ?? undefined}
            onValueChange={setStoryId}
            className="gap-2"
          >
            {eligible.map((story) => (
              <Label
                key={story._id}
                htmlFor={`entry-${contestId}-${story._id}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent/50"
              >
                <RadioGroupItem
                  id={`entry-${contestId}-${story._id}`}
                  value={story._id}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {story.title}
                  </span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {story.publishedChapterCount}{" "}
                    {story.publishedChapterCount === 1 ? "part" : "parts"}
                  </span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || stories === undefined || eligible.length === 0}
          >
            {submitting ? "Submitting…" : "Submit entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
