"use client";

import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { Bookmark, ExternalLink } from "lucide-react";
import { BarkCard } from "@/components/bark-card";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";
import { SaveSourceButton } from "@/components/sources/save-source-button";
import { SourceThumb } from "@/components/source-thumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { toUiBark } from "@/lib/barks/query";
import { toUiCase } from "@/lib/cases/query";
import { platformMeta } from "@/lib/meta";
import type { Source, SourcePlatform } from "@/lib/types";

function SavedHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Saved</h1>
      <p className="text-sm text-muted-foreground">
        Your personal research library of barks and cases.
      </p>
    </div>
  );
}

function sourceFromSave(row: {
  _id: string;
  sourceUrl: string;
  sourceTitle: string;
  sourcePlatform: SourcePlatform;
  sourceCreatorName: string;
  sourceThumbnailUrl?: string;
  createdAt: number;
}): Source {
  return {
    id: row._id,
    platform: row.sourcePlatform,
    url: row.sourceUrl,
    title: row.sourceTitle,
    creatorId: "",
    publishedAt: new Date(row.createdAt).toISOString(),
    category: "",
    language: "en",
    barkCount: 0,
    replyChainCount: 0,
    caseCount: 0,
    engagement: 0,
    evidenceRating: 0,
    thumbnailUrl: row.sourceThumbnailUrl,
  };
}

function SavedSignedIn() {
  const { isAuthenticated } = useConvexAuth();
  const barkDocs = useQuery(
    api.barks.listMineSaved,
    isAuthenticated ? {} : "skip"
  );
  const caseDocs = useQuery(
    api.cases.listMineSaved,
    isAuthenticated ? {} : "skip"
  );
  const sourceDocs = useQuery(
    api.saves.listMineSources,
    isAuthenticated ? {} : "skip"
  );

  if (
    !isAuthenticated ||
    barkDocs === undefined ||
    caseDocs === undefined ||
    sourceDocs === undefined
  ) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <SavedHeader />
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading saved…
        </p>
      </div>
    );
  }

  const savedBarks = barkDocs.map(toUiBark);
  const savedCases = caseDocs.map(toUiCase);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <SavedHeader />
      <Tabs defaultValue="barks">
        <TabsList>
          <TabsTrigger value="barks">Barks ({savedBarks.length})</TabsTrigger>
          <TabsTrigger value="cases">Cases ({savedCases.length})</TabsTrigger>
          <TabsTrigger value="sources">Sources ({sourceDocs.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="barks" className="mt-4 space-y-3">
          {savedBarks.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved barks"
              description="Save a published bark to keep it in your research library."
              action={
                <Button asChild size="sm">
                  <Link href="/barks">Discover barks</Link>
                </Button>
              }
            />
          ) : (
            savedBarks.map((b) => <BarkCard key={b.id} bark={b} />)
          )}
        </TabsContent>
        <TabsContent value="cases" className="mt-4 space-y-3">
          {savedCases.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved cases"
              description="Save a published case to keep it in your research library."
              action={
                <Button asChild size="sm">
                  <Link href="/cases">Discover cases</Link>
                </Button>
              }
            />
          ) : (
            savedCases.map((c) => (
              <CaseCard key={c.id} accountabilityCase={c} />
            ))
          )}
        </TabsContent>
        <TabsContent value="sources" className="mt-4 space-y-3">
          {sourceDocs.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved sources"
              description="Save sources while browsing to build your research library."
              action={
                <Button asChild size="sm">
                  <Link href="/barks">Discover barks</Link>
                </Button>
              }
            />
          ) : (
            sourceDocs.map((row) => {
              const source = sourceFromSave(row);
              return (
                <Card
                  key={row._id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                >
                  <SourceThumb
                    source={source}
                    className="aspect-video w-full sm:w-40"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium leading-snug">{row.sourceTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {platformMeta[row.sourcePlatform].label}
                      {row.sourceCreatorName
                        ? ` · ${row.sourceCreatorName}`
                        : ""}
                    </p>
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Open original{" "}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  </div>
                  <SaveSourceButton
                    sourceUrl={row.sourceUrl}
                    sourceTitle={row.sourceTitle}
                    sourcePlatform={row.sourcePlatform}
                    sourceCreatorName={row.sourceCreatorName}
                    sourceThumbnailUrl={row.sourceThumbnailUrl}
                  />
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function SavedLibrary() {
  return (
    <>
      <Show when="signed-out">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <SavedHeader />
          <EmptyState
            icon={Bookmark}
            title="Sign in to see saved items"
            description="Save barks, cases, and sources while you research, then find them here."
            action={
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            }
          />
        </div>
      </Show>
      <Show when="signed-in">
        <SavedSignedIn />
      </Show>
    </>
  );
}
