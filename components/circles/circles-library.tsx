"use client";

import * as React from "react";
import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { caseCategoryMeta } from "@/lib/meta";
import { topicSlugs } from "@/lib/topics";
import type { CaseCategory } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

function CirclesSignedIn() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useConvexAuth();
  const circles = useQuery(
    api.researchCircles.listMine,
    isAuthenticated ? {} : "skip"
  );
  const create = useMutation(api.researchCircles.create);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [anchorKind, setAnchorKind] = React.useState<"case" | "topic">(
    params.get("case") ? "case" : params.get("topic") ? "topic" : "topic"
  );
  const [caseCode, setCaseCode] = React.useState(
    params.get("case")?.toUpperCase() ?? ""
  );
  const [topic, setTopic] = React.useState<CaseCategory>(
    (params.get("topic") as CaseCategory) || topicSlugs[0]!
  );
  const [busy, setBusy] = React.useState(false);

  if (circles === undefined) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Loading circles…
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="gap-4 p-4">
        <div>
          <h2 className="text-sm font-semibold">Start a research circle</h2>
          <p className="text-xs text-muted-foreground">
            Private workspace (max 40) anchored to a case or topic.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="circle-name">Name</Label>
            <Input
              id="circle-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Climate disclosure review"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="circle-desc">Description (optional)</Label>
            <Textarea
              id="circle-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-16"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Anchor</Label>
            <Select
              value={anchorKind}
              onValueChange={(v) => setAnchorKind(v as "case" | "topic")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="topic">Topic</SelectItem>
                <SelectItem value="case">Case</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {anchorKind === "topic" ? (
            <div className="space-y-1.5">
              <Label>Topic</Label>
              <Select
                value={topic}
                onValueChange={(v) => setTopic(v as CaseCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {topicSlugs.map((slug) => (
                    <SelectItem key={slug} value={slug}>
                      {caseCategoryMeta[slug].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="case-code">Case code</Label>
              <Input
                id="case-code"
                value={caseCode}
                onChange={(e) => setCaseCode(e.target.value.toUpperCase())}
                placeholder="CSE-2026-0001"
              />
            </div>
          )}
        </div>
        <Button
          disabled={busy}
          onClick={() => {
            void (async () => {
              setBusy(true);
              try {
                const id = await create({
                  name,
                  description: description || undefined,
                  anchorKind,
                  ...(anchorKind === "case"
                    ? { caseCode }
                    : { topic }),
                });
                toast.success("Circle created");
                router.push(`/circles/${id}`);
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Could not create circle"
                );
              } finally {
                setBusy(false);
              }
            })();
          }}
        >
          Create circle
        </Button>
      </Card>

      {circles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No research circles yet"
          description="Create a private workspace around a case or topic."
        />
      ) : (
        <ul className="space-y-2">
          {circles.map((circle) => (
            <li key={circle._id}>
              <Link href={`/circles/${circle._id}`}>
                <Card className="gap-1 p-4 transition-colors hover:border-primary/40">
                  <p className="font-medium">{circle.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {circle.anchorKind === "case"
                      ? `Case ${circle.caseCode}`
                      : circle.topic
                        ? caseCategoryMeta[circle.topic]?.label
                        : "Topic"}{" "}
                    · {circle.memberCount} members · {circle.myRole}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CirclesLibrary() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Research circles</h1>
        <p className="text-sm text-muted-foreground">
          Small private workspaces for focused research — not public feeds.
        </p>
      </div>
      <Show when="signed-out">
        <EmptyState
          icon={Users}
          title="Sign in to use research circles"
          description="Create or join a private circle around a case or topic."
          action={
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          }
        />
      </Show>
      <Show when="signed-in">
        <CirclesSignedIn />
      </Show>
    </div>
  );
}
