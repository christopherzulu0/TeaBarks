import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRound } from "lucide-react";
import { BarkTypeBadge } from "@/components/bark-type-badge";
import { CreatorReviewContent } from "@/components/reviews/creator-review-content";
import { ReviewReadingToolbar } from "@/components/reviews/review-reading-toolbar";
import { PersonAvatar } from "@/components/person-avatar";
import { ReviewCode } from "@/components/review-code";
import { ShareMenu } from "@/components/share-menu";
import { VerifiedBadge } from "@/components/verified-badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCreatorReviewByCode } from "@/app/actions/creator-reviews";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/reviews/[code]">
): Promise<Metadata> {
  const { code } = await props.params;
  const review = await getCreatorReviewByCode(code);
  return { title: review ? review.title : "Review not found" };
}

export default async function CreatorReviewPage(
  props: PageProps<"/reviews/[code]">
) {
  const { code } = await props.params;
  const review = await getCreatorReviewByCode(code);
  if (!review) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/creators">Creators</BreadcrumbLink>
          </BreadcrumbItem>
          {review.creatorHandle && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/creators/${review.creatorHandle}`}>
                  {review.creatorName}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Review</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <BarkTypeBadge type={review.type} />
          <ReviewCode code={review.code} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{review.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link
            href={`/profile/${review.authorId}`}
            className="inline-flex items-center gap-2 hover:text-primary"
          >
            <PersonAvatar
              id={review.authorId}
              name={review.authorName ?? "Member"}
              className="size-7"
            />
            <span className="font-medium text-foreground">
              {review.authorName}
            </span>
          </Link>
          <span aria-hidden>·</span>
          <time dateTime={review.publishedAt}>
            {formatDate(review.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{formatNumber(review.views)} views</span>
          <ShareMenu
            kind="bark"
            code={review.code}
            title={review.title}
            path={`/reviews/${review.code}`}
          />
        </div>
      </header>

      {review.creatorHandle && review.creatorName && (
        <Card className="mt-6 gap-0 p-0">
          <div className="flex gap-4 p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <UserRound className="size-5 text-primary" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Creator review
              </p>
              <Link
                href={`/creators/${review.creatorHandle}`}
                className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary"
              >
                {review.creatorName}
              </Link>
              <p className="text-xs text-muted-foreground">
                Overall assessment of this creator&apos;s work and accountability
                record.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Separator className="my-8" />

      <ReviewReadingToolbar />
      <CreatorReviewContent blocks={review.content} />
    </article>
  );
}
