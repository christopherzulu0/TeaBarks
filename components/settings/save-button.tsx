"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SaveButton({ label = "Save changes" }: { label?: string }) {
  return (
    <Button
      onClick={() =>
        toast.success("Settings saved", {
          description: "Your preferences have been updated.",
        })
      }
    >
      {label}
    </Button>
  );
}
