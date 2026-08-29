"use client";

import { Check, UserPlus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export function FollowBarkAuthorButton({
  authorClerkId,
  name,
  size = "sm",
}: {
  authorClerkId: string;
  name: string;
  size?: "default" | "sm";
}) {
  const { isSignedIn, userId } = useAuth();
  const isSelf = Boolean(userId && userId === authorClerkId);
  const state = useQuery(
    api.follows.authorFollowState,
    isSelf || !authorClerkId ? "skip" : { authorClerkId }
  );
  const toggleFollow = useMutation(api.follows.toggleFollowAuthor);
  const following = state?.following ?? false;

  if (isSelf || !authorClerkId) return null;

  return (
    <Button
      size={size}
      variant={following ? "outline" : "default"}
      onClick={() => {
        void (async () => {
          if (!isSignedIn) {
            toast.message("Sign in to follow this author");
            return;
          }
          try {
            const next = await toggleFollow({ authorClerkId });
            toast.success(
              next.following
                ? `Following ${name}`
                : `Unfollowed ${name}`,
              {
                description: next.following
                  ? "Their reactions will show up in Following."
                  : "Removed from your following feed.",
              }
            );
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Could not update follow"
            );
          }
        })();
      }}
    >
      {following ? (
        <>
          <Check className="size-3.5" /> Following
        </>
      ) : (
        <>
          <UserPlus className="size-3.5" /> Follow
        </>
      )}
    </Button>
  );
}
