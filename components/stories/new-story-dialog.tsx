"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBillingAccess } from "@/components/auth/use-billing";
import { FEATURES } from "@/lib/billing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoryGenrePicker } from "@/components/stories/story-genre-picker";
import { api } from "@/convex/_generated/api";
import type { StoryGenre } from "@/lib/story-types";

export function NewStoryDialog() {
  const router = useRouter();
  const billing = useBillingAccess();
  const allowed = billing.canUse(FEATURES.writerDashboard);
  const create = useMutation(api.stories.create);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [genre, setGenre] = React.useState<StoryGenre | "">("");
  const [submitting, setSubmitting] = React.useState(false);

  const onCreate = async () => {
    if (!title.trim() || !genre) {
      toast.error("A title and a genre get a story started.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await create({ title: title.trim(), genre });
      toast.success(`Draft created: "${title.trim()}"`);
      setOpen(false);
      setTitle("");
      setGenre("");
      router.push(`/stories/write/${result.slug}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create story"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!allowed) {
    return (
      <Button asChild>
        <Link href="/pricing">
          <Plus className="size-4" /> New story
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> New story
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start a new story</DialogTitle>
          <DialogDescription>
            You can change everything later — covers, tags, even the title.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-story-title">Title</Label>
            <Input
              id="new-story-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Working titles are allowed"
            />
          </div>
          <div className="space-y-2">
            <Label>Genre</Label>
            <StoryGenrePicker value={genre} onChange={setGenre} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onCreate} disabled={submitting}>
            {submitting ? "Creating…" : "Create draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
