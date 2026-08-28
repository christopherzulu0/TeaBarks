"use client";

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { useQuery } from "convex/react";
import { FeatureGate } from "@/components/auth/feature-gate";
import { ContestEntryDialog } from "@/components/stories/contest-entry-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { FEATURES } from "@/lib/billing";
import { formatNumber } from "@/lib/format";
import { toUiContest, type UiContest } from "@/lib/contests/query";

export function HomeContests({ contests }: { contests: UiContest[] }) {
  const docs = useQuery(api.contests.listActive);
  const list = docs ? docs.map(toUiContest) : contests;
  if (list.length === 0) return null;

  return (
    <section aria-labelledby="contests-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          id="contests-heading"
          className="text-xl font-semibold tracking-tight"
        >
          Writing contests
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/stories/contests">
            All contests <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((contest) => (
          <Card key={contest.id} className="gap-0 p-5">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-mixed/20">
                <Trophy
                  className="size-5 text-mixed-foreground dark:text-mixed"
                  aria-hidden
                />
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1">
                  <Link
                    href="/stories/contests"
                    className="font-semibold hover:text-primary"
                  >
                    {contest.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{contest.theme}</p>
                  <p className="text-xs text-muted-foreground">
                    Prize: {contest.prize}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(contest.entries)} entries · closes{" "}
                    {new Date(contest.deadlineAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {contest.status === "active" ? (
                    <FeatureGate
                      feature={FEATURES.writerDashboard}
                      fallback={
                        <Button asChild size="sm" variant="outline">
                          <Link href="/pricing">Upgrade to enter</Link>
                        </Button>
                      }
                    >
                      <ContestEntryDialog
                        contestId={contest.id as Id<"contests">}
                        contestName={contest.name}
                      />
                    </FeatureGate>
                  ) : null}
                  <Button asChild size="sm" variant="outline">
                    <Link href="/stories/contests">Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
