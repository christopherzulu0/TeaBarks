"use client";

import Link from "next/link";
import { Copy, Link2, MessageSquare, Play } from "lucide-react";
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

export function SourceActionBar({
  url,
  platform,
  discussionCode,
  className,
}: {
  url: string;
  platform: SourcePlatform;
  discussionCode?: string;
  className?: string;
}) {
  const isVideo = VIDEO_PLATFORMS.has(platform);
  const watchLabel = isVideo ? "Watch" : "Open";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. Select and copy it manually.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild size="sm" variant="secondary" className="h-9 min-w-0 px-2">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {isVideo ? (
              <Play className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <Link2 className="size-3.5 shrink-0" aria-hidden />
            )}
            <span className="truncate">{watchLabel}</span>
          </a>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 min-w-0 px-2"
          onClick={() => void copyLink()}
        >
          <Copy className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">Copy</span>
        </Button>
      </div>
      {discussionCode ? (
        <Button asChild size="sm" className="h-9 w-full">
          <Link href={`/barks/${discussionCode}`}>
            <MessageSquare className="size-3.5 shrink-0" aria-hidden />
            Read discussion
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
