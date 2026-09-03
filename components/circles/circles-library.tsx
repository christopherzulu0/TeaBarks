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
import type { Id } from "@/convex/_generated/dataModel";
import { caseCategoryMeta } from "@/lib/meta";
import { topicSlugs } from "@/lib/topics";
import type { CaseCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

function CirclesSignedIn() {
  const router = useRouter();
  const params = useSearchParams();
  const focusInviteId = params.get("invite")?.trim() ?? "";
  const focusingInvite = Boolean(focusInviteId);
  const { isAuthenticated } = useConvexAuth();
  const circles = useQuery(
    api.researchCircles.listMine,
    isAuthenticated ? {} : "skip"
  );
  const pendingInvites = useQuery(
    api.researchCircles.listMyPendingInvites,
    isAuthenticated ? {} : "skip"
  );
  const create = useMutation(api.researchCircles.create);
  const acceptInvite = useMutation(api.researchCircles.acceptInvite);
  const declineInvite = useMutation(api.researchCircles.declineInvite);
  const [showCreate, setShowCreate] = React.useState(false);
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
  const pendingRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (focusingInvite) setShowCreate(false);
  }, [focusingInvite]);

  React.useEffect(() => {
    if (!focusingInvite || pendingInvites === undefined) return;
    pendingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusingInvite, pendingInvites]);

  const focusedInvite =
    focusingInvite && pendingInvites
      ? pendingInvites.find((row) => row._id === focusInviteId)
      : undefined;
  const inviteMissing =
    focusingInvite &&
    pendingInvites !== undefined &&
    !focusedInvite;

  const clearInviteQuery = () => {
    router.replace("/circles", { scroll: false });
  };

  const loadingCircles = circles === undefined;
  const loadingInvites = pendingInvites === undefined;

  if (loadingCircles && !focusingInvite) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Loading circles…
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {focusingInvite ? (
        <div ref={pendingRef} id="pending-invites" className="scroll-mt-24">
          {loadingInvites ? (
            <Card className="gap-3 p-4">
              <p className="text-sm text-muted-foreground">Loading invite…</p>
            </Card>
          ) : inviteMissing ? (
            <Card className="gap-3 p-4">
              <div>
                <h2 className="text-sm font-semibold">Invite unavailable</h2>
                <p className="text-xs text-muted-foreground">
                  This invite is no longer pending — it may have been accepted,
                  declined, or cancelled.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={clearInviteQuery}>
                Browse circles
              </Button>
            </Card>
          ) : pendingInvites && pendingInvites.length > 0 ? (
            <Card className="gap-3 border-primary/40 p-4">
              <div>
                <h2 className="text-sm font-semibold">Respond to invite</h2>
                <p className="text-xs text-muted-foreground">
                  Accept to join this private research circle.
                </p>
              </div>
              <ul className="space-y-2">
                {pendingInvites.map((invite) => {
                  const isFocused = invite._id === focusInviteId;
                  return (
                    <li
                      key={invite._id}
                      className={cn(
                        "flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between",
                        isFocused && "border-primary bg-primary/5 ring-2 ring-primary/30"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{invite.circleName}</p>
                        <p className="text-xs text-muted-foreground">
                          Invited by {invite.inviterName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            void (async () => {
                              try {
                                const id = await acceptInvite({
                                  inviteId: invite._id as Id<"researchCircleInvites">,
                                });
                                toast.success("Joined circle");
                                router.push(`/circles/${id}`);
                              } catch (error) {
                                toast.error(
                                  error instanceof Error
                                    ? error.message
                                    : "Could not accept"
                                );
                              }
                            })();
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            void (async () => {
                              try {
                                await declineInvite({
                                  inviteId: invite._id as Id<"researchCircleInvites">,
                                });
                                toast.success("Invite declined");
                                clearInviteQuery();
                              } catch (error) {
                                toast.error(
                                  error instanceof Error
                                    ? error.message
                                    : "Could not decline"
                                );
                              }
                            })();
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : null}
        </div>
      ) : pendingInvites && pendingInvites.length > 0 ? (
        <Card id="pending-invites" className="gap-3 scroll-mt-24 p-4">
          <div>
            <h2 className="text-sm font-semibold">Pending invites</h2>
            <p className="text-xs text-muted-foreground">
              Accept to join a private research circle.
            </p>
          </div>
          <ul className="space-y-2">
            {pendingInvites.map((invite) => (
              <li
                key={invite._id}
                className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{invite.circleName}</p>
                  <p className="text-xs text-muted-foreground">
                    Invited by {invite.inviterName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      void (async () => {
                        try {
                          const id = await acceptInvite({
                            inviteId: invite._id,
                          });
                          toast.success("Joined circle");
                          router.push(`/circles/${id}`);
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Could not accept"
                          );
                        }
                      })();
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      void (async () => {
                        try {
                          await declineInvite({ inviteId: invite._id });
                          toast.success("Invite declined");
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Could not decline"
                          );
                        }
                      })();
                    }}
                  >
                    Decline
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {!showCreate ? (
        <Button
          type="button"
          variant={focusingInvite ? "ghost" : "outline"}
          size="sm"
          className={focusingInvite ? "px-0" : undefined}
          onClick={() => setShowCreate(true)}
        >
          {focusingInvite ? "Create a circle instead" : "Create a circle"}
        </Button>
      ) : null}

      {showCreate ? (
        <Card className="gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Start a research circle</h2>
              <p className="text-xs text-muted-foreground">
                Private workspace (max 40) anchored to a case or topic.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
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
                    ...(anchorKind === "case" ? { caseCode } : { topic }),
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
      ) : null}

      {loadingCircles ? (
        <p className="text-sm text-muted-foreground">Loading your circles…</p>
      ) : circles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No research circles yet"
          description="Create a private workspace around a case or topic, or accept an invite when one arrives."
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
          description="Create a private circle around a case or topic, or accept an invite when one arrives."
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
