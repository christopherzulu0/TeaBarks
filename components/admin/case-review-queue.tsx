"use client";

import * as React from "react";
import Link from "next/link";
import { BadgeCheck, Scale, ShieldCheck } from "lucide-react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { caseStatusMeta } from "@/lib/meta";

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function ReviewCard({
  row,
}: {
  row: {
    _id: Id<"cases">;
    code: string;
    title: string;
    creatorName: string;
    status: "under-review" | "open" | "responded";
  };
}) {
  const publish = useMutation(api.cases.publish);
  const resolve = useMutation(api.cases.resolve);
  const [strengths, setStrengths] = React.useState("");
  const [weaknesses, setWeaknesses] = React.useState("");
  const [contradictions, setContradictions] = React.useState("");
  const [missingEvidence, setMissingEvidence] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const status = caseStatusMeta[row.status];

  const act = async (action: "publish" | "resolve") => {
    setBusy(true);
    try {
      if (action === "publish") {
        await publish({
          caseId: row._id,
          strengths: lines(strengths),
          weaknesses: lines(weaknesses),
          contradictions: lines(contradictions),
          missingEvidence: lines(missingEvidence),
        });
        toast.success(`${row.code} published`);
      } else {
        await resolve({ caseId: row._id });
        toast.success(`${row.code} resolved`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update case"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">
            <Link href={`/cases/${row.code}`} className="hover:underline">
              {row.title}
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">{row.code}</span> · {row.creatorName}
          </p>
        </div>
        <Badge variant="outline" className={status.badgeClass}>
          {status.label}
        </Badge>
      </div>

      {row.status === "under-review" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["Strengths", strengths, setStrengths],
                ["Weaknesses", weaknesses, setWeaknesses],
                ["Contradictions", contradictions, setContradictions],
                ["Missing evidence", missingEvidence, setMissingEvidence],
              ] as const
            ).map(([label, value, setValue]) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs">{label} (one per line)</Label>
                <Textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="min-h-20"
                />
              </div>
            ))}
          </div>
          <Button size="sm" disabled={busy} onClick={() => act("publish")}>
            <ShieldCheck className="size-3.5" />
            {busy ? "Publishing…" : "Publish"}
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => act("resolve")}
        >
          <BadgeCheck className="size-3.5" />
          {busy ? "Resolving…" : "Resolve"}
        </Button>
      )}
    </Card>
  );
}

export function CaseReviewQueue() {
  const { isAuthenticated } = useConvexAuth();
  const args = isAuthenticated ? {} : "skip";
  const underReview = useQuery(
    api.cases.listByStatus,
    args === "skip" ? "skip" : { status: "under-review" }
  );
  const open = useQuery(
    api.cases.listByStatus,
    args === "skip" ? "skip" : { status: "open" }
  );
  const responded = useQuery(
    api.cases.listByStatus,
    args === "skip" ? "skip" : { status: "responded" }
  );

  if (underReview === undefined || open === undefined || responded === undefined) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Loading cases…
      </p>
    );
  }

  const actionable = [...underReview, ...open, ...responded];
  if (actionable.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title="No cases to review"
        description="New cases appear here as under review. Publish analysis to open them, then resolve when the record is complete."
      />
    );
  }

  return (
    <div className="space-y-3">
      {actionable.map((row) => (
        <ReviewCard
          key={row._id}
          row={{
            _id: row._id,
            code: row.code,
            title: row.title,
            creatorName: row.creatorName,
            status: row.status as "under-review" | "open" | "responded",
          }}
        />
      ))}
    </div>
  );
}
