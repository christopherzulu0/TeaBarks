"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { caseCategoryMeta } from "@/lib/meta";
import { formatDate } from "@/lib/format";
import { useRouter } from "next/navigation";

export function CircleDetail({
  circleId,
}: {
  circleId: Id<"researchCircles">;
}) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const detail = useQuery(
    api.researchCircles.get,
    isSignedIn ? { circleId } : "skip"
  );
  const posts = useQuery(
    api.researchCircles.listPosts,
    isSignedIn ? { circleId } : "skip"
  );
  const invite = useMutation(api.researchCircles.inviteByUsername);
  const addPost = useMutation(api.researchCircles.addPost);
  const leave = useMutation(api.researchCircles.leave);
  const remove = useMutation(api.researchCircles.remove);
  const [username, setUsername] = React.useState("");
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  if (!isSignedIn) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Sign in to view this circle.
      </p>
    );
  }

  if (detail === undefined || posts === undefined) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Loading circle…
      </p>
    );
  }

  if (detail === null) {
    return (
      <div className="space-y-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Circle not found or you are not a member.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/circles">Back to circles</Link>
        </Button>
      </div>
    );
  }

  const { circle, members } = detail;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link href="/circles">← Circles</Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{circle.name}</h1>
        <p className="text-sm text-muted-foreground">
          {circle.anchorKind === "case" ? (
            <>
              Anchored to case{" "}
              <Link
                href={`/cases/${circle.caseCode}`}
                className="font-medium text-foreground hover:underline"
              >
                {circle.caseCode}
              </Link>
            </>
          ) : (
            <>
              Anchored to topic{" "}
              <Link
                href={`/topics/${circle.topic}`}
                className="font-medium text-foreground hover:underline"
              >
                {circle.topic
                  ? caseCategoryMeta[circle.topic]?.label
                  : "Topic"}
              </Link>
            </>
          )}{" "}
          · {circle.memberCount} members
        </p>
        {circle.description ? (
          <p className="text-sm">{circle.description}</p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_14rem]">
        <div className="space-y-4">
          <Card className="gap-3 p-4">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share a finding, source, or question with the circle…"
              className="min-h-24"
            />
            <Button
              size="sm"
              disabled={busy || !body.trim()}
              onClick={() => {
                void (async () => {
                  setBusy(true);
                  try {
                    await addPost({ circleId, body });
                    setBody("");
                    toast.success("Posted");
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Could not post"
                    );
                  } finally {
                    setBusy(false);
                  }
                })();
              }}
            >
              Post
            </Button>
          </Card>

          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="space-y-2">
              {posts.map((post) => (
                <li key={post._id}>
                  <Card className="gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <PersonAvatar
                        id={post.authorClerkId}
                        name={post.authorName}
                        className="size-7"
                      />
                      <div>
                        <p className="text-sm font-medium">{post.authorName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDate(new Date(post.createdAt).toISOString())}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{post.body}</p>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="gap-3 p-4">
            <p className="text-sm font-semibold">Members</p>
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m._id} className="flex items-center gap-2 text-sm">
                  <PersonAvatar
                    id={m.clerkUserId}
                    name={m.name}
                    className="size-6"
                  />
                  <span className="min-w-0 truncate">{m.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
            {circle.myRole === "owner" ? (
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void (async () => {
                    try {
                      await invite({ circleId, username });
                      setUsername("");
                      toast.success("Member invited");
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Could not invite"
                      );
                    }
                  })();
                }}
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Invite by username"
                />
                <Button type="submit" size="sm" variant="outline" className="w-full">
                  Invite
                </Button>
              </form>
            ) : null}
            {circle.myRole === "member" ? (
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-destructive"
                onClick={() => {
                  void (async () => {
                    try {
                      await leave({ circleId });
                      toast.success("Left circle");
                      router.push("/circles");
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Could not leave"
                      );
                    }
                  })();
                }}
              >
                Leave circle
              </Button>
            ) : null}
            {circle.myRole === "owner" ? (
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-destructive"
                onClick={() => {
                  void (async () => {
                    try {
                      await remove({ circleId });
                      toast.success("Circle deleted");
                      router.push("/circles");
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Could not delete"
                      );
                    }
                  })();
                }}
              >
                Delete circle
              </Button>
            ) : null}
          </Card>
        </aside>
      </div>
    </div>
  );
}
