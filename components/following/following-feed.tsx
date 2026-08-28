"use client";

import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { Users } from "lucide-react";
import { BarkCard } from "@/components/bark-card";
import { PersonAvatar } from "@/components/person-avatar";
import { VerifiedBadge } from "@/components/verified-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { toUiBark } from "@/lib/barks/query";
import { toUiCreator } from "@/lib/creators/query";
import { formatNumber } from "@/lib/format";

function FollowingHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Following</h1>
      <p className="text-sm text-muted-foreground">
        The latest barks from researchers and creators you follow.
      </p>
    </div>
  );
}

function FollowingSignedIn() {
  const { isAuthenticated } = useConvexAuth();
  const barkDocs = useQuery(
    api.barks.listFollowing,
    isAuthenticated ? {} : "skip"
  );
  const authors = useQuery(
    api.follows.listMineAuthors,
    isAuthenticated ? {} : "skip"
  );
  const creatorDocs = useQuery(
    api.creators.listMineFollows,
    isAuthenticated ? {} : "skip"
  );

  if (!isAuthenticated || barkDocs === undefined) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <FollowingHeader />
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading following…
        </p>
      </div>
    );
  }

  const feed = barkDocs.map(toUiBark);
  const followedCreators = creatorDocs ? creatorDocs.map(toUiCreator) : [];
  const followedAuthors = authors ?? [];
  const hasFollows =
    followedAuthors.length > 0 || followedCreators.length > 0;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1fr_280px]">
      <div className="min-w-0 space-y-4">
        <FollowingHeader />
        <div className="space-y-3">
          {!hasFollows ? (
            <EmptyState
              icon={Users}
              title="You’re not following anyone yet"
              description="Follow a barker on a bark, or a creator on their profile, to build this feed."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild size="sm">
                    <Link href="/barks">Discover barks</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/creators">Discover creators</Link>
                  </Button>
                </div>
              }
            />
          ) : feed.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No followed barks yet"
              description="Barks from people you follow will appear here."
            />
          ) : (
            feed.map((b) => <BarkCard key={b.id} bark={b} />)
          )}
        </div>
      </div>
      <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
        <Card className="gap-3 p-4">
          <h2 className="text-sm font-semibold">Barkers you follow</h2>
          {followedAuthors.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Follow a bark author to see them here.
            </p>
          ) : (
            <ul className="space-y-3">
              {followedAuthors.map((u) => (
                <li key={u.clerkUserId} className="flex items-center gap-2.5">
                  <PersonAvatar
                    id={u.clerkUserId}
                    name={u.name}
                    imageUrl={u.imageUrl ?? undefined}
                    className="size-8"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Evidence score {u.evidenceScore}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/barks">Discover barks</Link>
          </Button>
        </Card>
        <Card className="gap-3 p-4">
          <h2 className="text-sm font-semibold">Creators you follow</h2>
          {followedCreators.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Follow a creator to see them here.
            </p>
          ) : (
            <ul className="space-y-3">
              {followedCreators.map((c) => (
                <li key={c.id} className="flex items-center gap-2.5">
                  <PersonAvatar id={c.id} name={c.name} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/creators/${c.handle}`}
                      className="flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      <span className="truncate">{c.name}</span>
                      {c.verified && <VerifiedBadge className="size-3.5" />}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(c.followers)} followers
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/creators">Discover more</Link>
          </Button>
        </Card>
      </aside>
    </div>
  );
}

export function FollowingFeed() {
  return (
    <>
      <Show when="signed-out">
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
          <FollowingHeader />
          <EmptyState
            icon={Users}
            title="Sign in to see your feed"
            description="Follow barkers and creators, then their latest barks show up here."
            action={
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            }
          />
        </div>
      </Show>
      <Show when="signed-in">
        <FollowingSignedIn />
      </Show>
    </>
  );
}
