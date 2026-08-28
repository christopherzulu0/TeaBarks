import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { BarkTypeBadge } from "@/components/bark-type-badge";
import { EvidenceRating } from "@/components/evidence-rating";
import { PersonAvatar } from "@/components/person-avatar";
import { ReviewCode } from "@/components/review-code";
import { VerifiedBadge } from "@/components/verified-badge";
import { Card } from "@/components/ui/card";
import { getUser } from "@/lib/data";
import { formatNumber, timeAgo } from "@/lib/format";
import { barkTypeMeta } from "@/lib/meta";
import type { CreatorReview } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CreatorReviewCard({
  review,
  className,
}: {
  review: CreatorReview;
  className?: string;
}) {
  const author = getUser(review.authorId);
  const authorName = author?.name ?? review.authorName;

  return (
    <Card
      className={cn(
        "gap-0 border-l-2 p-0",
        barkTypeMeta[review.type].borderClass,
        className
      )}
    >
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <BarkTypeBadge type={review.type} />
          <ReviewCode code={review.code} size="sm" />
          {review.creatorName && (
            <span className="truncate max-w-56">
              Review of {review.creatorName}
            </span>
          )}
          <span aria-hidden>·</span>
          <span>{timeAgo(review.publishedAt)}</span>
        </div>

        <Link
          href={`/reviews/${review.code}`}
          className="group focus-visible:outline-2 focus-visible:outline-ring rounded-sm"
        >
          <h3 className="font-semibold leading-snug tracking-tight text-base group-hover:text-primary transition-colors">
            {review.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {review.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {authorName && (
            <Link
              href={`/profile/${review.authorId}`}
              className="flex min-w-0 items-center gap-2 text-sm hover:text-primary"
            >
              <PersonAvatar
                id={author?.id ?? review.authorId}
                name={authorName}
                className="size-6"
              />
              <span className="truncate font-medium">{authorName}</span>
              {author?.verified && <VerifiedBadge className="size-3.5" />}
            </Link>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <EvidenceRating rating={review.evidenceRating} />
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="size-3.5" aria-hidden />
              {formatNumber(review.upvotes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="size-3.5" aria-hidden />
              {formatNumber(review.replyCount)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
