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

function MobileSourceSheet({
  url,
  platform,
  onClose,
}: {
  url: string;
  platform: SourcePlatform;
  onClose: () => void;
}) {
  const primaryLabel = primaryActionLabel(platform);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const openExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
      onClose();
    } catch {
      toast.error("Couldn't copy. Select and copy it manually.");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-source-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t bg-popover p-4 shadow-lg pb-[max(1rem,env(safe-area-inset-bottom))]">
        <h2
          id="view-source-title"
          className="text-base font-medium text-foreground"
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
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const close = React.useCallback(() => setOpen(false), []);

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

      {open && mounted ? (
        <MobileSourceSheet url={url} platform={platform} onClose={close} />
      ) : null}
    </>
  );
}
