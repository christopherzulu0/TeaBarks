"use client";

import * as React from "react";
import { FileText, UserRound } from "lucide-react";
import { CreateReviewWizard } from "@/components/create/create-review-wizard";
import { CreateWizard } from "@/components/create/create-wizard";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CreateMode = "pick" | "reaction" | "review";

export function CreateFlow() {
  const [mode, setMode] = React.useState<CreateMode>("pick");

  if (mode === "reaction") {
    return <CreateWizard onBack={() => setMode("pick")} />;
  }

  if (mode === "review") {
    return <CreateReviewWizard onBack={() => setMode("pick")} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create</h1>
        <p className="text-sm text-muted-foreground">
          Choose whether you&apos;re responding to a specific video or reviewing a
          creator&apos;s overall work.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("reaction")}
          className="text-left"
        >
          <Card
            className={cn(
              "h-full gap-0 p-6 transition-colors hover:border-primary/50 hover:bg-primary/[0.03]"
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-5 text-primary" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Video Reaction</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Respond to a specific video, article, or public source with
              evidence-backed analysis.
            </p>
          </Card>
        </button>

        <button
          type="button"
          onClick={() => setMode("review")}
          className="text-left"
        >
          <Card
            className={cn(
              "h-full gap-0 p-6 transition-colors hover:border-primary/50 hover:bg-primary/[0.03]"
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <UserRound className="size-5 text-primary" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Creator Review</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Review a creator&apos;s overall body of work, patterns, and
              accountability record.
            </p>
          </Card>
        </button>
      </div>
    </div>
  );
}
