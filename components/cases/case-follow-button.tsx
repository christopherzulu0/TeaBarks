"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CaseFollowButton({
  code,
  initialFollowers,
}: {
  code: string;
  initialFollowers: number;
}) {
  const { isSignedIn } = useAuth();
  const state = useQuery(api.cases.followState, { code });
  const toggleFollow = useMutation(api.cases.toggleFollow);
  const followers = state?.followers ?? initialFollowers;
  const following = state?.following ?? false;

  const onClick = async () => {
    if (!isSignedIn) {
      toast.error("Sign in to follow this case.");
      return;
    }
    try {
      await toggleFollow({ code });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update follow"
      );
    }
  };

  return (
    <Button
      size="sm"
      variant={following ? "default" : "outline"}
      onClick={() => void onClick()}
      aria-pressed={following}
      className={cn(following && "bg-primary text-primary-foreground")}
    >
      <Bell className="size-3.5" />
      {following ? "Following" : "Follow case"}
      <span className="tabular-nums">{formatNumber(followers)}</span>
    </Button>
  );
}
