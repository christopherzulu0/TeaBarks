"use client";

import * as React from "react";
import Link from "next/link";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { Trophy } from "lucide-react";
import { formatNumber } from "@/lib/format";

export function ContestAdminPanel() {
  const { isAuthenticated } = useConvexAuth();
  const contests = useQuery(
    api.contests.listAdmin,
    isAuthenticated ? {} : "skip"
  );
  const create = useMutation(api.contests.create);
  const close = useMutation(api.contests.close);

  const [name, setName] = React.useState("");
  const [theme, setTheme] = React.useState("");
  const [prize, setPrize] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!deadline) {
      toast.error("Pick a deadline.");
      return;
    }
    const deadlineAt = Date.parse(`${deadline}T23:59:59.000Z`);
    if (!Number.isFinite(deadlineAt)) {
      toast.error("Deadline is not a valid date.");
      return;
    }
    setSubmitting(true);
    try {
      await create({
        name,
        theme,
        prize,
        description,
        deadlineAt,
      });
      toast.success("Contest posted");
      setName("");
      setTheme("");
      setPrize("");
      setDescription("");
      setDeadline("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create contest"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || contests === undefined) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Loading contests…
      </p>
    );
  }

  if (contests === null) {
    return (
      <EmptyState
        icon={Trophy}
        title="Admins only"
        description="Contest posting and judging are limited to site admins. Ask to be added to ADMIN_CLERK_IDS, or use an organization admin role."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="gap-4 p-5">
        <div>
          <h3 className="font-semibold">Post a contest</h3>
          <p className="text-sm text-muted-foreground">
            Writers can enter after you publish. Judging stays on this tab.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contest-name">Name</Label>
            <Input
              id="contest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The Open Door Award"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contest-theme">Theme</Label>
            <Input
              id="contest-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="A threshold that shouldn't be crossed"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contest-prize">Prize</Label>
            <Input
              id="contest-prize"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              placeholder="Homepage spotlight"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contest-deadline">Deadline</Label>
            <Input
              id="contest-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contest-description">Description</Label>
            <Textarea
              id="contest-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rules, word limits, and what you are looking for."
            />
          </div>
        </div>
        <Button onClick={submit} disabled={submitting}>
          {submitting ? "Posting…" : "Post contest"}
        </Button>
      </Card>

      {contests.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No contests yet"
          description="Post one above. It will appear on Stories once it is active."
        />
      ) : (
        <div className="space-y-2">
          {contests.map((contest) => (
            <Card
              key={contest._id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{contest.name}</p>
                  <Badge variant="secondary" className="capitalize">
                    {contest.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{contest.theme}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(contest.entryCount)} entries · closes{" "}
                  {new Date(contest.deadlineAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href={`/admin/contests/${contest._id}`}>Review</Link>
                </Button>
                {contest.status === "active" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await close({ contestId: contest._id });
                        toast.success("Contest closed");
                      } catch (error) {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "Could not close contest"
                        );
                      }
                    }}
                  >
                    Close
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
