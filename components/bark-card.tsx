import Link from "next/link";
import { Bookmark, MessageSquare, ThumbsUp } from "lucide-react";
import { FollowBarkAuthorButton } from "@/components/barks/follow-author-button";
import { BarkCode } from "@/components/bark-code";
import { BarkTypeBadge } from "@/components/bark-type-badge";
import { EvidenceRating } from "@/components/evidence-rating";
import { PersonAvatar } from "@/components/person-avatar";
import { PlatformIcon } from "@/components/platform-icon";
import { VerifiedBadge } from "@/components/verified-badge";
import { Card } from "@/components/ui/card";
import { getCreator, getSource, getUser } from "@/lib/data";
import { formatNumber, timeAgo } from "@/lib/format";
import { barkTypeMeta } from "@/lib/meta";
import type { Bark } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BarkCard({
  bark,
  className,
}: {
  bark: Bark;
  className?: string;
}) {
  const author = getUser(bark.authorId);
  const source = getSource(bark.sourceId);
  const creator = source ? getCreator(source.creatorId) : undefined;
  const authorName = author?.name ?? bark.authorName;
  const sourceTitle = source?.title ?? bark.sourceTitle;
  const sourcePlatform = source?.platform ?? bark.sourcePlatform;
  const creatorName = creator?.name ?? bark.sourceCreatorName;

  return (
    <Card
      className={cn(
        "gap-0 border-l-2 p-0",
        barkTypeMeta[bark.type].borderClass,
        className
      )}
    >
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <BarkTypeBadge type={bark.type} />
          <BarkCode code={bark.code} size="sm" />
          {sourceTitle && sourcePlatform && (
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <PlatformIcon platform={sourcePlatform} className="size-3.5" />
              <span className="truncate max-w-56">
                {creatorName} — {sourceTitle}
              </span>
            </span>
          )}
          <span aria-hidden>·</span>
          <span>{timeAgo(bark.publishedAt)}</span>
        </div>

        <Link
          href={`/barks/${bark.code}`}
          className="group focus-visible:outline-2 focus-visible:outline-ring rounded-sm"
        >
          <h3 className="font-semibold leading-snug tracking-tight text-base group-hover:text-primary transition-colors">
            {bark.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {bark.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {authorName && (
            <span className="flex items-center gap-2 text-sm">
              <Link
                href={`/profile/${bark.authorId}`}
                className="flex min-w-0 items-center gap-2 hover:text-primary"
              >
                <PersonAvatar
                  id={author?.id ?? bark.authorId}
                  name={authorName}
                  className="size-6"
                />
                <span className="truncate font-medium">{authorName}</span>
                {author?.verified && <VerifiedBadge className="size-3.5" />}
              </Link>
              {bark.live ? (
                <FollowBarkAuthorButton
                  authorClerkId={bark.authorId}
                  name={authorName}
                />
              ) : null}
            </span>
          )}
          <span className="flex items-center gap-4 text-xs text-muted-foreground">
            <EvidenceRating rating={bark.evidenceRating} showLabel={false} />
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="size-3.5" aria-hidden />
              {formatNumber(bark.replyCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="size-3.5" aria-hidden />
              {formatNumber(bark.upvotes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bookmark className="size-3.5" aria-hidden />
              {formatNumber(bark.saves)}
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
