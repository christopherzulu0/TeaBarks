"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Check, Upload } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const PRESETS = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
];

const MAX_COVER_BYTES = 10 * 1024 * 1024;

export function CoverPicker({
  storyTitle,
  storyId,
}: {
  storyTitle: string;
  storyId: Id<"stories">;
}) {
  const setCover = useMutation(api.stories.setCover);
  const generateUploadUrl = useMutation(api.evidenceFiles.generateUploadUrl);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<number | "upload">(0);
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const usingUpload = selected === "upload";

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const apply = async () => {
    setSaving(true);
    try {
      if (selected === "upload") {
        if (!file) throw new Error("Choose a cover image first");
        if (file.size > MAX_COVER_BYTES) {
          throw new Error("Cover image must be 10 MB or smaller");
        }
        const postUrl = await generateUploadUrl();
        const uploaded = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!uploaded.ok) throw new Error("Upload failed");
        const body = (await uploaded.json()) as { storageId?: string };
        if (!body.storageId) throw new Error("Upload failed");
        await setCover({
          storyId,
          coverStorageId: body.storageId as Id<"_storage">,
        });
      } else {
        await setCover({
          storyId,
          coverImage: PRESETS[selected],
        });
      }
      toast.success("Cover updated");
      setOpen(false);
      setFile(null);
      setSelected(0);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update cover"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setFile(null);
          setSelected(0);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
          <ImagePlus className="size-3.5" /> Cover
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col overflow-hidden sm:max-w-md">
        <DialogHeader className="shrink-0">
          <DialogTitle>Story cover</DialogTitle>
          <DialogDescription>
            Upload a file or pick a cover image for “{storyTitle}”.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`cover-file-${storyId}`}>Upload image</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <label
                    htmlFor={`cover-file-${storyId}`}
                    className="cursor-pointer"
                  >
                    <Upload className="size-3.5" /> Choose file
                  </label>
                </Button>
                <input
                  id={`cover-file-${storyId}`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const next = e.target.files?.[0] ?? null;
                    setFile(next);
                    if (next) setSelected("upload");
                    e.target.value = "";
                  }}
                />
                {file && (
                  <span className="truncate text-xs text-muted-foreground">
                    {file.name}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => setSelected("upload")}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md ring-offset-background transition-all",
                    usingUpload
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:opacity-90"
                  )}
                  aria-label="Uploaded cover"
                  aria-pressed={usingUpload}
                >
                  <Image
                    src={previewUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="120px"
                  />
                  {usingUpload && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check className="size-5 text-white" />
                    </span>
                  )}
                </button>
              )}
              {PRESETS.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md ring-offset-background transition-all",
                    !usingUpload && selected === i
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:opacity-90"
                  )}
                  aria-label={`Cover style ${i + 1}`}
                  aria-pressed={!usingUpload && selected === i}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  {!usingUpload && selected === i && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check className="size-5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="mb-0 shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={() => void apply()}>
            {saving ? "Saving…" : "Apply cover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
