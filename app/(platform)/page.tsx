import Link from "next/link";
import { ArrowRight, FileText, MessageSquare, Search } from "lucide-react";
import { listPublicBarks, listPublicSources } from "@/app/actions/barks";
import { HomeHeroActions } from "@/components/home/hero-actions";
import { BarkCard } from "@/components/bark-card";
import { EmptyState } from "@/components/empty-state";
import { SourceCard } from "@/components/source-card";
import { RightPanel } from "@/components/shell/right-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { sortBarksByPublishedAt } from "@/lib/barks/query";
import { featuredReactionCodeBySourceUrl } from "@/lib/sources/featured-reaction";
import { currentUser, topics } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.07] via-background to-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <Badge variant="outline" className="mb-5 bg-background/60">
          Evidence-Based Discussion & Accountability
        </Badge>
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Where Ideas Are Challenged{" "}
          <span className="text-primary">Through Evidence.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          Analyze, debate, and document public content with sourced arguments.
          Every discussion starts with an original source — and every claim is
          held to it.
        </p>

        <form
          action="/search"
          className="mx-auto mt-8 flex max-w-lg items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              name="q"
              placeholder="Search a claim, creator, video, or Reaction ID…"
              aria-label="Search TypeReact"
              className="h-11 w-full rounded-md border bg-background pl-9 pr-3 text-sm shadow-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" size="lg" className="h-11">
            Search
          </Button>
        </form>

        <HomeHeroActions />
      </div>
    </section>
  );
}

function SectionHeader({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild variant="ghost" size="sm" className="shrink-0">
        <Link href={href}>
          View all <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

export default async function HomePage() {
  const [published, publicSources] = await Promise.all([
    listPublicBarks(),
    listPublicSources(),
  ]);
  const beingBarkedAbout = publicSources.slice(0, 6);
  const featuredCodeByUrl = featuredReactionCodeBySourceUrl(published);
  const trendingBarks = [...published]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);
  const localFeed = published
    .filter((b) => b.country === currentUser.country)
    .slice(0, 4);
  const globalFeed = sortBarksByPublishedAt(published).slice(0, 4);

  return (
    <>
      <Hero />
      <div className="flex">
        <div className="min-w-0 flex-1 space-y-10 px-4 py-8 lg:px-6">
          <section aria-labelledby="under-discussion">
            <SectionHeader
              title="Under Discussion"
              description="The sources drawing the most analysis right now"
              href="/explore"
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {beingBarkedAbout.length === 0 ? (
                <div className="sm:col-span-2 xl:col-span-3">
                  <EmptyState
                    icon={FileText}
                    title="No sources yet"
                    description="When reactions are published, the sources drawing the most analysis will show up here."
                  />
                </div>
              ) : (
                beingBarkedAbout.map((s) => (
                  <SourceCard
                    key={s.id}
                    source={s}
                    showActionBar
                    discussionCode={featuredCodeByUrl.get(s.url.trim())}
                  />
                ))
              )}
            </div>
          </section>

          <section aria-labelledby="trending-barks">
            <SectionHeader
              title="Trending Reactions"
              description="The most upvoted evidence-based responses"
              href="/barks"
            />
            <div className="mt-4 space-y-3">
              {trendingBarks.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No published reactions yet"
                  description="The most upvoted published reactions will appear here."
                />
              ) : (
                trendingBarks.map((b) => <BarkCard key={b.id} bark={b} />)
              )}
            </div>
          </section>

          <section aria-labelledby="feeds">
            <Tabs defaultValue="local">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Your Feeds
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Discussions near you and around the world
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="local">Local</TabsTrigger>
                  <TabsTrigger value="global">Global</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="local" className="mt-4 space-y-3">
                {localFeed.length === 0 ? (
                  <EmptyState
                    icon={MessageSquare}
                    title="No local reactions yet"
                    description="Reactions from your country will show up here when they include a location."
                  />
                ) : (
                  localFeed.map((b) => <BarkCard key={b.id} bark={b} />)
                )}
              </TabsContent>
              <TabsContent value="global" className="mt-4 space-y-3">
                {globalFeed.length === 0 ? (
                  <EmptyState
                    icon={MessageSquare}
                    title="No published reactions yet"
                    description="Newest published reactions from around the world will appear here."
                  />
                ) : (
                  globalFeed.map((b) => <BarkCard key={b.id} bark={b} />)
                )}
              </TabsContent>
            </Tabs>
          </section>

          <section aria-labelledby="trending-topics">
            <SectionHeader
              title="Trending Topics"
              description="Where the discussion is concentrating"
              href="/topics"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.slice(0, 6).map((t) => (
                <Link key={t.slug} href={`/topics/${t.slug}`} className="group">
                  <Card className="gap-1.5 p-4 transition-colors group-hover:border-primary/50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t.name}</span>
                      {t.trending && (
                        <Badge variant="secondary" className="text-[10px]">
                          Trending
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {t.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(t.barkCount)} reactions ·{" "}
                      {formatNumber(t.caseCount)} cases
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <RightPanel />
      </div>
    </>
  );
}
