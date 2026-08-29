"use client";

import * as React from "react";
import { Copy, ExternalLink, Link2, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { SourcePlatform } from "@/lib/types";
import { cn } from "@/lib/utils";

const VIDEO_PLATFORMS = new Set<SourcePlatform>([
  "youtube",
  "tiktok",
  "instagram",
  "facebook",
  "livestream",
]);

function primaryActionLabel(platform: SourcePlatform) {
  return VIDEO_PLATFORMS.has(platform) ? "Watch video" : "Open link";
}

const linkClassName =
  "inline-flex items-center gap-1 text-xs text-primary hover:underline";

export function ViewOriginalSourceLink({
  url,
  platform,
  className,
}: {
  url: string;
  platform: SourcePlatform;
  className?: string;
}) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const primaryLabel = primaryActionLabel(platform);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const openDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  };

  const openExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    closeDialog();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
      closeDialog();
    } catch {
      toast.error("Couldn't copy. Select and copy it manually.");
    }
  };

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkClassName, "hidden lg:inline-flex", className)}
      >
        View original source{" "}
        <ExternalLink className="size-3" aria-hidden />
      </a>

      <button
        type="button"
        className={cn(linkClassName, "touch-manipulation lg:hidden", className)}
        onClick={openDialog}
      >
        View original source{" "}
        <ExternalLink className="size-3" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] m-0 w-full max-w-full",
          "max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t bg-popover p-4 shadow-lg",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
          "backdrop:bg-black/40 lg:hidden",
          "open:animate-in open:slide-in-from-bottom-10"
        )}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDialog();
        }}
      >
        <h2 className="pr-8 text-base font-medium text-foreground">
          Open external source?
        </h2>
        <p className="mt-2 break-all text-left text-xs leading-relaxed text-muted-foreground">
          {url}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            type="button"
            size="lg"
            className="h-11 w-full"
            onClick={openExternal}
          >
            {VIDEO_PLATFORMS.has(platform) ? (
              <Play className="size-4" aria-hidden />
            ) : (
              <Link2 className="size-4" aria-hidden />
            )}
            {primaryLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full"
            onClick={() => void copyLink()}
          >
            <Copy className="size-4" aria-hidden />
            Copy link
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="h-11 w-full"
            onClick={closeDialog}
          >
            Cancel
          </Button>
        </div>
      </dialog>
    </>
  );
}
