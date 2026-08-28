"use client";

import { Bookmark } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export function SaveCaseButton({ code }: { code: string }) {
  const { isSignedIn } = useAuth();
  const state = useQuery(api.cases.saveState, { code });
  const toggleSave = useMutation(api.cases.toggleSave);
  const saved = state?.saved ?? false;

  return (
    <Button
      size="sm"
      variant={saved ? "secondary" : "outline"}
      aria-pressed={saved}
      onClick={() => {
        void (async () => {
          if (!isSignedIn) {
            toast.message("Sign in to save");
            return;
          }
          try {
            const next = await toggleSave({ code });
            toast.success(
              next.saved ? "Case saved" : "Removed from saved",
              { description: code }
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
