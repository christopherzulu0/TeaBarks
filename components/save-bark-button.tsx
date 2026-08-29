"use client";

import { Bookmark } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

export function SaveBarkButton({
  barkCode,
  className,
}: {
  barkCode: string;
  className?: string;
}) {
  const { isSignedIn } = useAuth();
  const state = useQuery(api.barks.saveState, { code: barkCode });
  const toggleSave = useMutation(api.barks.toggleSave);
  const saved = state?.saved ?? false;

  return (
    <Button
      variant={saved ? "secondary" : "outline"}
      size="sm"
      className={cn(className)}
      aria-pressed={saved}
      onClick={() => {
        void (async () => {
          if (!isSignedIn) {
            toast.message("Sign in to save");
            return;
          }
          try {
            const next = await toggleSave({ code: barkCode });
            toast.success(
              next.saved ? "Reaction saved" : "Removed from saved",
              { description: barkCode }
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
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
