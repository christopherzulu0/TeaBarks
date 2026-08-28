"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const primaryLabel = primaryActionLabel(platform);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const openExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    close();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
      close();
    } catch {
      toast.error("Couldn't copy. Select and copy it manually.");
    }
  };

  const sheet =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[100]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-source-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Dismiss"
              onClick={close}
            />
            <div
              className="absolute inset-x-0 bottom-0 z-10 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t bg-popover p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <h2
                id="view-source-title"
                className="pr-8 text-base font-medium text-foreground"
              >
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
                  onClick={close}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

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
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        View original source{" "}
        <ExternalLink className="size-3" aria-hidden />
      </button>

      {sheet}
    </>
  );
}
