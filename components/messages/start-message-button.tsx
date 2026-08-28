"use client";

import { Mail } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export function StartMessageButton({
  kind,
  barkCode,
  caseCode,
  creatorHandle,
  hideIfClerkId,
  size = "default",
}: {
  kind: "bark" | "case" | "creator";
  barkCode?: string;
  caseCode?: string;
  creatorHandle?: string;
  hideIfClerkId?: string;
  size?: "default" | "sm";
}) {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const startOrOpen = useMutation(api.messages.startOrOpen);
  const mine = useQuery(
    api.creators.getMine,
    kind === "creator" && isSignedIn ? {} : "skip"
  );

  const isSelf =
    Boolean(hideIfClerkId && userId && userId === hideIfClerkId) ||
    Boolean(
      kind === "creator" &&
        creatorHandle &&
        mine?.handle &&
        mine.handle === creatorHandle
    );

  if (isSelf) return null;

  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => {
        void (async () => {
          if (!isSignedIn) {
            toast.message("Sign in to send a message");
            return;
          }
          try {
            const threadId = await startOrOpen({
              kind,
              ...(barkCode ? { barkCode } : {}),
              ...(caseCode ? { caseCode } : {}),
              ...(creatorHandle ? { creatorHandle } : {}),
            });
            router.push(`/messages?c=${threadId}`);
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Could not open messages"
            );
          }
        })();
      }}
    >
      <Mail className={size === "sm" ? "size-3.5" : "size-4"} />
      Message
    </Button>
  );
}
