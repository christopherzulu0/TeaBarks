import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { listApprovedCreators } from "@/app/actions/creators";
import { listCaseCategoryStats, listCases } from "@/app/actions/cases";
import { CreatorFollowButton } from "@/components/creators/creator-actions";
import { PersonAvatar } from "@/components/person-avatar";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { caseStatusMeta } from "@/lib/meta";
import { topics } from "@/lib/topics";

export async function RightPanel() {
  const [publishedCases, approvedCreators, categoryStats] = await Promise.all([
    listCases(),
    listApprovedCreators(),
    listCaseCategoryStats(),
  ]);
  const bySlug = new Map(categoryStats.map((row) => [row.slug, row.caseCount]));
  const trendingTopics = [...topics]
    .map((topic) => ({
      ...topic,
      caseCount: bySlug.get(topic.slug) ?? 0,
    }))
    .sort(
      (a, b) => b.caseCount - a.caseCount || a.name.localeCompare(b.name, "en")
    )
    .filter((t) => t.caseCount > 0)
    .slice(0, 5);
  const activeCases = publishedCases
    .filter((c) => c.status === "open" || c.status === "under-review")
    .slice(0, 3);
  const suggestedCreators = [...approvedCreators]
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 4);

  return (
    <aside
      aria-label="Trending and suggestions"
      className="sticky top-20 hidden h-[calc(100svh-5rem)] w-80 shrink-0 space-y-4 overflow-y-auto p-4 xl:block"
    >
      <Card className="gap-3 py-4">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="size-4 text-primary" aria-hidden />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-2">
          {trendingTopics.length === 0 ? (
            <p className="px-2 text-sm text-muted-foreground">
              Topics appear as cases are opened.
            </p>
          ) : (
            trendingTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatNumber(t.caseCount)} cases
                </span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="gap-3 py-4">
        <CardHeader className="px-4">
          <CardTitle className="text-sm">Active Cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4">
          {activeCases.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No active cases yet.
            </p>
          )}
          {activeCases.map((c) => (
            <Link key={c.id} href={`/cases/${c.code}`} className="group block">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {c.code}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${caseStatusMeta[c.status].badgeClass}`}
                >
                  {caseStatusMeta[c.status].label}
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                {c.title}
              </p>
            </Link>
          ))}
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/cases">
              All cases <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="gap-3 py-4">
        <CardHeader className="px-4">
          <CardTitle className="text-sm">Creators on TeaBarks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4">
          {suggestedCreators.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                No approved creators yet.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/creators/apply">Become a Creator</Link>
              </Button>
            </div>
          ) : (
            suggestedCreators.map((c) => (
              <div key={c.id} className="flex items-center gap-2.5">
                <PersonAvatar id={c.id} name={c.name} className="size-8" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/creators/${c.handle}`}
                    className="flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    <span className="truncate">{c.name}</span>
                    {c.verified && <VerifiedBadge className="size-3.5" />}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(c.followers)} followers
                  </p>
                </div>
                <CreatorFollowButton
                  creatorId={c.id}
                  name={c.name}
                  size="sm"
                />
              </div>
            ))
          )}
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/creators">
              All creators <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
