import { BadgeCheck, Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";
import { CitedText } from "@/components/cited-text";
import { EvidenceCard } from "@/components/evidence-card";
import { PersonAvatar } from "@/components/person-avatar";
import { ReportButton } from "@/components/report-dialog";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { currentUser, getPerson } from "@/lib/data";
import { timeAgo } from "@/lib/format";
import type { Reply } from "@/lib/types";
import { cn } from "@/lib/utils";

function ReplyItem({ reply, isChild }: { reply: Reply; isChild?: boolean }) {
  const author = getPerson(reply.authorId);

  return (
    <div
      className={cn(
        "relative",
        isChild && "ml-5 border-l-2 border-border pl-5 sm:ml-6"
      )}
    >
      <Card
        className={cn(
          "gap-0 p-0",
          reply.isCreatorResponse && "border-verified/50 bg-verified/[0.04]"
        )}
      >
        <div className="space-y-2.5 p-4">
          {reply.isCreatorResponse && (
            <Badge
              variant="outline"
              className="bg-verified/10 text-verified border-verified/40"
            >
              <BadgeCheck className="size-3" />
              Official Creator Response
            </Badge>
          )}
          <div className="flex items-center gap-2 text-sm">
            <PersonAvatar
              id={reply.authorId}
              name={author.name}
              className="size-7"
            />
            <span className="font-medium">{author.name}</span>
            {author.verified && <VerifiedBadge className="size-3.5" />}
            <span className="text-xs text-muted-foreground">
              @{author.handle} · {timeAgo(reply.postedAt)}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {reply.mentions?.map((m) => (
              <span key={m} className="mr-1 font-medium text-primary">
                @{m}
              </span>
            ))}
            <CitedText text={reply.content} />
          </p>
          {reply.evidence && reply.evidence.length > 0 && (
            <div className="space-y-2">
              {reply.evidence.map((ev) => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 pt-1">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
              <Lightbulb className="size-3.5" aria-hidden />
              Insightful · {reply.reactions.insightful}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
              <ThumbsUp className="size-3.5" aria-hidden />
              {reply.reactions.agree}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
              <ThumbsDown className="size-3.5" aria-hidden />
              {reply.reactions.disagree}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Reply
            </Button>
            <span className="ml-auto">
              <ReportButton target={`reply by @${author.handle}`} iconOnly />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ReplyThread({ replies }: { replies: Reply[] }) {
  const topLevel = replies.filter((r) => !r.parentId);
  const childrenOf = (id: string) => replies.filter((r) => r.parentId === id);

  return (
    <div className="space-y-4">
      <Card className="gap-0 p-0">
        <div className="flex gap-3 p-4">
          <PersonAvatar
            id={currentUser.id}
            name={currentUser.name}
            className="size-8"
          />
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add to the reply chain — claims need sources, replies need reasons…"
              aria-label="Write a reply"
              className="min-h-20 resize-y"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Attach evidence to strengthen your reply.
              </p>
              <Button size="sm">Post reply</Button>
            </div>
          </div>
        </div>
      </Card>

      {topLevel.map((reply) => (
        <div key={reply.id} className="space-y-3">
          <ReplyItem reply={reply} />
          {childrenOf(reply.id).map((child) => (
            <ReplyItem key={child.id} reply={child} isChild />
          ))}
        </div>
      ))}
    </div>
  );
}
