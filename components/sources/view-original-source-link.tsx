"use client";

import * as React from "react";
import { Copy, ExternalLink, Link2, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const [open, setOpen] = React.useState(false);
  const primaryLabel = primaryActionLabel(platform);

  const openExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
      setOpen(false);
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
        className={cn(linkClassName, "lg:hidden", className)}
        onClick={() => setOpen(true)}
      >
        View original source{" "}
        <ExternalLink className="size-3" aria-hidden />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85dvh] w-full max-w-full gap-0 overflow-hidden rounded-t-2xl border-t p-0 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="border-b px-4 pb-3 pt-1 text-left">
            <SheetTitle>Open external source?</SheetTitle>
            <SheetDescription className="break-all text-left text-xs leading-relaxed">
              {url}
            </SheetDescription>
          </SheetHeader>

          <SheetFooter className="gap-2 px-4 pt-4">
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
            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="h-11 w-full"
              >
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
