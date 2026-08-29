import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { BarkContent } from "@/components/bark/bark-content";
import { LikeButton } from "@/components/bark/like-button";
import { LiveReplyThread } from "@/components/bark/live-reply-thread";
import { ReplyThread } from "@/components/bark/reply-thread";
import { FollowBarkAuthorButton } from "@/components/barks/follow-author-button";
import { StartMessageButton } from "@/components/messages/start-message-button";
import { BarkCode } from "@/components/bark-code";
import { ReportButton } from "@/components/report-dialog";
import { BarkTypeBadge } from "@/components/bark-type-badge";
import { CiteEmbed } from "@/components/cite-embed";
import { SaveBarkButton } from "@/components/save-bark-button";
import { ShareMenu } from "@/components/share-menu";
import { EvidenceCard } from "@/components/evidence-card";
import { EvidenceRating } from "@/components/evidence-rating";
import { PersonAvatar } from "@/components/person-avatar";
import { PlatformIcon } from "@/components/platform-icon";
import { SaveSourceButton } from "@/components/sources/save-source-button";
import { ViewOriginalSourceLink } from "@/components/sources/view-original-source-link";
import { SourceThumb } from "@/components/source-thumb";
import { VerifiedBadge } from "@/components/verified-badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getBarkByCodeAction } from "@/app/actions/barks";
import { youtubeThumbnailUrl } from "@/lib/detect-source";
import { getCreator, getSource, getUser, getBarkByCode, repliesForBark } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";
import { platformMeta } from "@/lib/meta";
import type { Bark, EvidenceType, Source, User } from "@/lib/types";

export const dynamic = "force-dynamic";

function normalizeBarkCode(code: string) {
  return code.trim().toUpperCase();
}

async function resolveBark(code: string): Promise<Bark | undefined> {
  const normalized = normalizeBarkCode(code);
  try {
    const live = await getBarkByCodeAction(normalized);
    if (live) return live;
  } catch (err) {
    console.error("Failed to fetch live bark:", err);
  }
  return getBarkByCode(normalized);
}

export async function generateMetadata(
  props: PageProps<"/barks/[code]">
): Promise<Metadata> {
  const { code } = await props.params;
  const bark = await resolveBark(code);
  return { title: bark ? bark.title : "Bark not found" };
}

const evidenceTabs: { value: EvidenceType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "document", label: "Documents" },
  { value: "screenshot", label: "Screenshots" },
  { value: "video", label: "Videos" },
  { value: "link", label: "Links" },
  { value: "timestamp", label: "Timestamps" },
];

export default async function BarkPage(props: PageProps<"/barks/[code]">) {
  const { code } = await props.params;
  const bark = await resolveBark(code);
  if (!bark) notFound();

  const author: User | undefined = getUser(bark.authorId) ??
    (bark.authorName
      ? {
          id: bark.authorId,
          username: bark.authorId,
          name: bark.authorName,
          bio: "",
          verified: false,
          country: "",
          followers: 0,
          following: 0,
          barkCount: 0,
          evidenceScore: bark.evidenceRating,
          joinedAt: bark.publishedAt,
        }
      : undefined);
  const source: Source | undefined = getSource(bark.sourceId) ??
    (bark.sourceTitle && bark.sourcePlatform
      ? {
          id: bark.sourceId,
          platform: bark.sourcePlatform,
          url: bark.sourceUrl ?? "",
          title: bark.sourceTitle,
          thumbnailUrl:
            bark.sourceThumbnailUrl ??
            youtubeThumbnailUrl(bark.sourceUrl ?? ""),
          creatorId: "",
          publishedAt: bark.publishedAt,
          category: "",
          language: "en",
          barkCount: 1,
          replyChainCount: 0,
          caseCount: 0,
          engagement: 0,
          evidenceRating: bark.evidenceRating,
        }
      : undefined);
  const creator = source
    ? getCreator(source.creatorId) ??
      (bark.sourceCreatorName
        ? {
            id: "convex-creator",
            handle: "source",
            name: bark.sourceCreatorName,
            bio: "",
            verified: false,
            hasTeaBarksProfile: false,
            platforms: source.platform ? [source.platform] : [],
            officialLinks: [],
            followers: 0,
            country: "",
            topics: [],
            totalSources: 1,
            totalBarksReceived: 0,
            responseRate: 0,
            joinedAt: bark.publishedAt,
          }
        : undefined)
    : undefined;
  const replies = repliesForBark(bark.id);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl overflow-x-hidden px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/barks">Barks</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono text-xs">
              {bark.code}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0 overflow-x-hidden">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <BarkTypeBadge type={bark.type} />
              <BarkCode code={bark.code} size="md" />
              <EvidenceRating rating={bark.evidenceRating} />
            </div>
            <h1 className="min-w-0 break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {bark.title}
            </h1>
            {author && (
              <div className="flex min-w-0 flex-col gap-3">
                <Link
                  href={`/profile/${author.id}`}
                  className="flex min-w-0 items-center gap-2 hover:text-primary"
                >
                  <PersonAvatar
                    id={author.id}
                    name={author.name}
                    className="size-9 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-medium">
                      {author.name}
                      {author.verified && <VerifiedBadge className="size-3.5" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Published {formatDate(bark.publishedAt)}
                      {bark.updatedAt
                        ? ` · Updated ${formatDate(bark.updatedAt)}`
                        : ""}{" "}
                      · {formatNumber(bark.views)} views
                    </p>
                  </div>
                </Link>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  {bark.live ? (
                    <FollowBarkAuthorButton
                      authorClerkId={bark.authorId}
                      name={author.name}
                    />
                  ) : null}
                  {bark.live ? (
                    <StartMessageButton
                      kind="bark"
                      barkCode={bark.code}
                      hideIfClerkId={bark.authorId}
                      size="sm"
                    />
                  ) : null}
                  {bark.live ? (
                    <LikeButton
                      code={bark.code}
                      initialUpvotes={bark.upvotes}
                    />
                  ) : (
                    <Button variant="outline" size="sm">
                      {formatNumber(bark.upvotes)} likes
                    </Button>
                  )}
                  {bark.live ? (
                    <SaveBarkButton barkCode={bark.code} />
                  ) : null}
                  <ShareMenu
                    kind="bark"
                    code={bark.code}
                    title={bark.title}
                    path={`/barks/${bark.code}`}
                  />
                  <ReportButton
                    target={`bark ${bark.code}`}
                    barkCode={bark.live ? bark.code : undefined}
                    targetKind="bark"
                    targetId={bark.code}
                    iconOnly
                  />
                </div>
              </div>
            )}
          </header>

          {/* Source card */}
          {source && creator && (
            <Card className="mt-6 min-w-0 gap-0 overflow-hidden p-0">
              <div className="flex min-w-0 flex-col gap-4 p-4 sm:flex-row">
                <SourceThumb
                  source={source}
                  className="aspect-video w-full shrink-0 sm:w-40"
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Responding to
                  </p>
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">
                    {source.title}
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    <PlatformIcon
                      platform={source.platform}
                      className="size-3.5"
                    />
                    {source.platform && platformMeta[source.platform]?.label
                      ? platformMeta[source.platform].label
                      : source.platform}
                    <span aria-hidden>·</span>
                    {creator.hasTeaBarksProfile ? (
                      <Link
                        href={`/creators/${creator.handle}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {creator.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {creator.name}
                      </span>
                    )}
                    <span aria-hidden>·</span>
                    {formatDate(source.publishedAt)}
                  </p>
                  {source.url ? (
                    <ViewOriginalSourceLink
                      url={source.url}
                      platform={source.platform}
                    />
                  ) : null}
                  {bark.live && source.url ? (
                    <div className="pt-2">
                      <SaveSourceButton
                        sourceUrl={source.url}
                        sourceTitle={source.title}
                        sourcePlatform={source.platform}
                        sourceCreatorName={creator.name}
                        sourceThumbnailUrl={source.thumbnailUrl}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          )}

          {/* Analysis content */}
          <div className="mt-8 min-w-0 break-words">
            <BarkContent content={bark.content} evidence={bark.evidence} />
          </div>

          <Separator className="my-10" />

          {/* Reply chain */}
          <section aria-labelledby="reply-chain">
            <h2
              id="reply-chain"
              className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <MessageSquare className="size-5" aria-hidden />
              Reply Chain
              <span className="text-sm font-normal text-muted-foreground">
                {formatNumber(bark.replyCount)} replies
              </span>
            </h2>
            {bark.live ? (
              <LiveReplyThread
                code={bark.code}
                replyCount={bark.replyCount}
              />
            ) : (
              <ReplyThread replies={replies} />
            )}
          </section>
        </article>

        {/* Evidence panel + cite */}
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <CiteEmbed
            kind="bark"
            code={bark.code}
            title={bark.title}
            path={`/barks/${bark.code}`}
          />
          <Card className="gap-0 p-0">
            <div className="space-y-3 p-4">
              <div>
                <h2 className="text-sm font-semibold">Evidence Panel</h2>
                <p className="text-xs text-muted-foreground">
                  {bark.evidence.length} items · rating{" "}
                  {bark.evidenceRating}/100
                </p>
              </div>
              <Tabs defaultValue="all">
                <TabsList className="h-8 w-full flex-wrap">
                  {evidenceTabs.slice(0, 4).map((t) => (
                    <TabsTrigger key={t.value} value={t.value} className="text-xs">
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {evidenceTabs.map((t) => {
                  const items =
                    t.value === "all"
                      ? bark.evidence
                      : bark.evidence.filter((e) => e.type === t.value);
                  return (
                    <TabsContent
                      key={t.value}
                      value={t.value}
                      className="mt-3 space-y-2"
                    >
                      {items.length === 0 ? (
                        <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                          No {t.label.toLowerCase()} attached.
                        </p>
                      ) : (
                        items.map((ev) => (
                          <EvidenceCard key={ev.id} evidence={ev} />
                        ))
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
