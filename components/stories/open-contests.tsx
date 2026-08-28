"use client";

import Link from "next/link";
import { CalendarClock, Trophy, Users } from "lucide-react";
import { useQuery } from "convex/react";
import { FeatureGate } from "@/components/auth/feature-gate";
import { ContestEntryDialog } from "@/components/stories/contest-entry-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { FEATURES } from "@/lib/billing";
import { daysLeft, toUiContest, type UiContest } from "@/lib/contests/query";
import { formatNumber } from "@/lib/format";

export function OpenContests({ initial }: { initial: UiContest[] }) {
  const docs = useQuery(api.contests.listActive);
  const active = docs ? docs.map(toUiContest) : initial;

  if (active.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No contests are open right now. Check back soon.
      </p>
    );
  }

  return (
    <>
      {active.map((contest) => {
        const days = daysLeft(contest.deadlineAt);
        return (
          <Card key={contest.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-mixed/20">
                    <Trophy
                      className="size-5 text-mixed-foreground dark:text-mixed"
                      aria-hidden
                    />
                  </span>
                  <div>
                    <CardTitle>{contest.name}</CardTitle>
                    <CardDescription className="mt-0.5">
                      {contest.theme}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    days <= 30
                      ? "bg-disagree/10 text-disagree border-disagree/30"
                      : "bg-verified/15 text-verified border-verified/30"
                  }
                >
                  <CalendarClock className="size-3" />
                  {days} days left
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {contest.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5 text-sm">
                  <p className="font-medium">{contest.prize}</p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" aria-hidden />
                    {formatNumber(contest.entries)} entries so far
                  </p>
                </div>
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
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
