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
  const isVideo = VIDEO_PLATFORMS.has(platform);
  const primaryLabel = isVideo ? "Watch video" : "Open link";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
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

      <details className={cn("group lg:hidden", className)}>
        <summary
          className={cn(
            linkClassName,
            "cursor-pointer touch-manipulation list-none [&::-webkit-details-marker]:hidden"
          )}
        >
          View original source{" "}
          <ExternalLink className="size-3" aria-hidden />
        </summary>
        <div className="mt-2 space-y-2 rounded-lg border bg-card p-3 shadow-sm">
          <p className="break-all text-xs leading-relaxed text-muted-foreground">
            {url}
          </p>
          <Button
            asChild
            size="lg"
            className="h-11 w-full"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              {isVideo ? (
                <Play className="size-4" aria-hidden />
              ) : (
                <Link2 className="size-4" aria-hidden />
              )}
              {primaryLabel}
            </a>
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
        </div>
      </details>
    </>
  );
}
