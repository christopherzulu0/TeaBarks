"use client";

import * as React from "react";
import { FileEdit } from "lucide-react";
import { useMutation } from "convex/react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoryGenrePicker } from "@/components/stories/story-genre-picker";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { isStoryGenre, storyStatusMeta } from "@/lib/story-meta";
import type { StoryGenre, StoryStatus } from "@/lib/story-types";

export function StorySettingsDialog({
  slug,
  title,
  blurb,
  genre,
  tags,
  mature,
  status,
  trigger,
}: {
  slug: string;
  title: string;
  blurb: string;
  genre: StoryGenre;
  tags: string[];
  mature: boolean;
  status: StoryStatus;
  trigger?: React.ReactNode;
}) {
  const update = useMutation(api.stories.update);
  const [open, setOpen] = React.useState(false);
  const [nextTitle, setNextTitle] = React.useState(title);
  const [nextBlurb, setNextBlurb] = React.useState(blurb);
  const [nextGenre, setNextGenre] = React.useState<StoryGenre>(genre);
  const [nextTags, setNextTags] = React.useState(tags.join(", "));
  const [nextMature, setNextMature] = React.useState(mature);
  const [nextStatus, setNextStatus] = React.useState<StoryStatus>(status);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setNextTitle(title);
    setNextBlurb(blurb);
    setNextGenre(genre);
    setNextTags(tags.join(", "));
    setNextMature(mature);
    setNextStatus(status);
  }, [open, title, blurb, genre, tags, mature, status]);

  const onSave = async () => {
    if (!nextTitle.trim()) {
      toast.error("A title is required");
      return;
    }
    setSaving(true);
    try {
      await update({
        slug,
        title: nextTitle,
        blurb: nextBlurb,
        genre: nextGenre,
        tags: nextTags.split(",").map((tag) => tag.trim()).filter(Boolean),
        mature: nextMature,
        status: nextStatus,
      });
      toast.success("Story details saved");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update story"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <FileEdit className="size-3.5" /> Edit story
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit story</DialogTitle>
          <DialogDescription>
            Title, blurb, genre, tags, and audience. The URL slug stays the same.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`story-title-${slug}`}>Title</Label>
            <Input
              id={`story-title-${slug}`}
              value={nextTitle}
              onChange={(e) => setNextTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`story-blurb-${slug}`}>Blurb</Label>
            <Textarea
              id={`story-blurb-${slug}`}
              value={nextBlurb}
              onChange={(e) => setNextBlurb(e.target.value)}
              className="min-h-24"
            />
          </div>
          <div className="space-y-2">
            <Label>Genre</Label>
            <StoryGenrePicker
              value={isStoryGenre(nextGenre) ? nextGenre : ""}
              onChange={setNextGenre}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={nextStatus}
              onValueChange={(value) => setNextStatus(value as StoryStatus)}
            >
              <SelectTrigger className="w-full" aria-label="Status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(storyStatusMeta) as StoryStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {storyStatusMeta[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`story-tags-${slug}`}>Tags</Label>
            <Input
              id={`story-tags-${slug}`}
              value={nextTags}
              onChange={(e) => setNextTags(e.target.value)}
              placeholder="slow burn, found family"
            />
            <p className="text-xs text-muted-foreground">Comma-separated.</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor={`story-mature-${slug}`}>Mature</Label>
              <p className="text-xs text-muted-foreground">
                Mark if this story includes adult themes.
              </p>
            </div>
            <Switch
              id={`story-mature-${slug}`}
              checked={nextMature}
              onCheckedChange={(checked) => setNextMature(checked === true)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void onSave()} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
