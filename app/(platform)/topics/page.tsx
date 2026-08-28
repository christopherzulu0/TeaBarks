import type { Metadata } from "next";
import Link from "next/link";
import { Hash } from "lucide-react";
import { listCaseCategoryStats } from "@/app/actions/cases";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { caseCategoryMeta } from "@/lib/meta";
import { topics } from "@/lib/topics";
import type { CaseCategory } from "@/lib/types";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Topics",
};

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const stats = await listCaseCategoryStats();
  const bySlug = new Map(stats.map((row) => [row.slug, row.caseCount]));
  const ranked = [...topics]
    .map((topic) => ({
      ...topic,
      caseCount: bySlug.get(topic.slug) ?? 0,
    }))
    .sort((a, b) => b.caseCount - a.caseCount || a.name.localeCompare(b.name, "en"));
  const trending = new Set(
    ranked.filter((t) => t.caseCount > 0).slice(0, 3).map((t) => t.slug)
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Topics</h1>
        <p className="text-sm text-muted-foreground">
          Accountability categories used when opening a case — conduct, integrity,
          and behavior.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((t) => {
          const group = caseCategoryMeta[t.slug as CaseCategory].group;
          return (
            <Link key={t.slug} href={`/topics/${t.slug}`} className="group">
              <Card className="h-full gap-2 p-5 transition-colors group-hover:border-primary/50">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 font-semibold">
                    <Hash className="size-4 shrink-0 text-primary" aria-hidden />
                    <span className="truncate">{t.name}</span>
                  </span>
                  {trending.has(t.slug) && (
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {group}
                </p>
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <p className="mt-auto pt-2 text-xs text-muted-foreground">
                  {formatNumber(t.caseCount)} cases
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
