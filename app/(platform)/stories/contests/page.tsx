import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { listActiveContests, listClosedContests } from "@/app/actions/contests";
import { getPublicStoryBySlug } from "@/app/actions/stories";
import { OpenContests } from "@/components/stories/open-contests";
import { StoryCard } from "@/components/stories/story-card";
import { WriterContestsCta } from "@/components/stories/writer-cta";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Writing Contests",
};

export const dynamic = "force-dynamic";

export default async function ContestsPage() {
  const [active, past] = await Promise.all([
    listActiveContests(),
    listClosedContests(),
  ]);
  const winners = await Promise.all(
    past.map(async (contest) =>
      contest.winnerSlug
        ? getPublicStoryBySlug(contest.winnerSlug)
        : null
    )
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Writing Contests</h1>
        <p className="text-sm text-muted-foreground">
          Judged blind by featured writers. Reads and votes don&apos;t count —
          only the writing does.
        </p>
      </div>

      <section aria-labelledby="active-contests" className="space-y-4">
        <h2 id="active-contests" className="text-xl font-semibold tracking-tight">
          Open for entries
        </h2>
        <OpenContests initial={active} />
      </section>

      <Separator />

      <section aria-labelledby="past-contests" className="space-y-4">
        <h2 id="past-contests" className="text-xl font-semibold tracking-tight">
          Past winners
        </h2>
        {past.map((contest, index) => {
          const winner = winners[index];
          return (
            <div key={contest.id} className="space-y-3">
              <div>
                <p className="font-medium">{contest.name}</p>
                <p className="text-sm text-muted-foreground">
                  {contest.theme} · {formatNumber(contest.entries)} entries
                </p>
              </div>
              {winner ? (
                <div className="max-w-sm">
                  <Badge variant="secondary" className="mb-2">
                    <Trophy className="size-3" /> Winner
                  </Badge>
                  <StoryCard story={winner} />
                </div>
              ) : null}
            </div>
          );
        })}
        <WriterContestsCta />
      </section>
    </div>
  );
}
