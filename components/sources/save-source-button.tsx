"use client";

import { Bookmark } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { SourcePlatform } from "@/lib/types";

export function SaveSourceButton({
  sourceUrl,
  sourceTitle,
  sourcePlatform,
  sourceCreatorName,
  sourceThumbnailUrl,
  size = "sm",
}: {
  sourceUrl: string;
  sourceTitle: string;
  sourcePlatform: SourcePlatform;
  sourceCreatorName: string;
  sourceThumbnailUrl?: string;
  size?: "default" | "sm";
}) {
  const { isSignedIn } = useAuth();
  const state = useQuery(
    api.saves.sourceSaveState,
    sourceUrl ? { sourceUrl } : "skip"
  );
  const toggleSave = useMutation(api.saves.toggleSaveSource);
  const saved = state?.saved ?? false;

  if (!sourceUrl) return null;

  return (
    <Button
      size={size}
      variant={saved ? "secondary" : "outline"}
      aria-pressed={saved}
      onClick={() => {
        void (async () => {
          if (!isSignedIn) {
            toast.message("Sign in to save");
            return;
          }
          try {
            const next = await toggleSave({
              sourceUrl,
              sourceTitle,
              sourcePlatform,
              sourceCreatorName,
              ...(sourceThumbnailUrl
                ? { sourceThumbnailUrl }
                : {}),
            });
            toast.success(
              next.saved ? "Source saved" : "Removed from saved"
            );
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Could not update save"
            );
          }
        })();
      }}
    >
      <Bookmark className={saved ? "size-3.5 fill-current" : "size-3.5"} />
      {saved ? "Saved" : "Save source"}
    </Button>
  );
}
