"use client";

import * as React from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { PersonAvatar } from "@/components/person-avatar";
import { VerifiedBadge } from "@/components/verified-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/format";
import type { Creator, CreatorOfficialResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OfficialCreatorResponse({
  barkCode,
  creator,
  creatorResponse,
  className,
}: {
  barkCode: string;
  creator?: Creator;
  creatorResponse?: CreatorOfficialResponse;
  className?: string;
}) {
  const { isAuthenticated } = useConvexAuth();
  const live = useQuery(api.barks.getByCode, { code: barkCode });
  const mine = useQuery(api.creators.getMine, isAuthenticated ? {} : "skip");
  const respond = useMutation(api.barks.respondOfficially);
  const [draft, setDraft] = React.useState("");
  const [posting, setPosting] = React.useState(false);

  const response = live?.creatorResponse
    ? {
        content: live.creatorResponse.content,
        respondedAt: new Date(live.creatorResponse.respondedAt).toISOString(),
        verified: live.creatorResponse.verified,
      }
    : creatorResponse;

  const canRespond =
    Boolean(mine) &&
    Boolean(creator) &&
    mine?._id === creator?.id &&
    !response;

  const submit = async () => {
    if (!draft.trim()) {
      toast.error("Write an official response first.");
      return;
    }
    setPosting(true);
    try {
      await respond({ code: barkCode, content: draft });
      setDraft("");
      toast.success("Official response posted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not post response"
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <section
      aria-labelledby="bark-creator-response"
      className={cn("space-y-3", className)}
    >
      {response && creator ? (
        <div className="rounded-lg border-2 border-verified/40 bg-verified/[0.04] p-5">
          <h2
            id="bark-creator-response"
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-verified"
          >
            <BadgeCheck className="size-4" aria-hidden />
            Official Creator Response
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <PersonAvatar
              id={creator.id}
              name={creator.name}
              className="size-8"
            />
            <div>
              <p className="flex items-center gap-1 text-sm font-medium">
                {creator.name}
                {response.verified && <VerifiedBadge className="size-3.5" />}
              </p>
              <p className="text-xs text-muted-foreground">
                Responded {formatDate(response.respondedAt)}
              </p>
            </div>
          </div>
          <blockquote className="mt-3 border-l-2 border-verified/50 pl-4 text-sm leading-relaxed text-foreground/90">
            {response.content}
          </blockquote>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            Official Creator Response
          </p>
          <p className="mt-1">
            The creator has not responded to this reaction.
          </p>
        </div>
      )}

      {canRespond && (
        <Card className="space-y-3 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <BadgeCheck className="size-4 text-verified" aria-hidden />
            Post official response
          </h3>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Respond on the record to this community reaction."
            className="min-h-28"
          />
          <Button size="sm" disabled={posting} onClick={submit}>
            {posting ? "Posting…" : "Publish response"}
          </Button>
        </Card>
      )}
    </section>
  );
}
