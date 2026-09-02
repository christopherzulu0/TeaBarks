"use client";

import * as React from "react";
import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Bookmark, ExternalLink, FolderPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BarkCard } from "@/components/bark-card";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";
import { SaveSourceButton } from "@/components/sources/save-source-button";
import { SourceThumb } from "@/components/source-thumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toUiBark } from "@/lib/barks/query";
import { toUiCase } from "@/lib/cases/query";
import { platformMeta } from "@/lib/meta";
import type { Source, SourcePlatform } from "@/lib/types";

function SavedHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Saved</h1>
      <p className="text-sm text-muted-foreground">
        Your personal research library — collections, notes, reactions, and cases.
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

type CollectionFilter = "all" | "uncategorized" | Id<"saveCollections">;

function SavedReactionsLibrary() {
  const { isAuthenticated } = useConvexAuth();
  const [filter, setFilter] = React.useState<CollectionFilter>("all");
  const [newName, setNewName] = React.useState("");
  const collections = useQuery(
    api.barks.listSaveCollections,
    isAuthenticated ? {} : "skip"
  );
  const libraryArgs =
    filter === "all"
      ? {}
      : filter === "uncategorized"
        ? { collectionId: null }
        : { collectionId: filter };
  const library = useQuery(
    api.barks.listMineSavedLibrary,
    isAuthenticated ? libraryArgs : "skip"
  );
  const createCollection = useMutation(api.barks.createSaveCollection);
  const deleteCollection = useMutation(api.barks.deleteSaveCollection);
  const updateSaveMeta = useMutation(api.barks.updateSaveMeta);

  if (collections === undefined || library === undefined) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Loading reactions…
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Collection</p>
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as CollectionFilter)}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="All saved" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All saved</SelectItem>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
              {collections.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name} ({c.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <form
          className="flex min-w-0 flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const name = newName.trim();
            if (!name) return;
            void (async () => {
              try {
                const id = await createCollection({ name });
                setNewName("");
                setFilter(id);
                toast.success("Collection created");
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Could not create collection"
                );
              }
            })();
          }}
        >
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New collection name"
            aria-label="New collection name"
          />
          <Button type="submit" variant="outline" size="sm" className="shrink-0">
            <FolderPlus className="size-3.5" />
            Add
          </Button>
        </form>
      </div>

      {filter !== "all" && filter !== "uncategorized" ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => {
              void (async () => {
                try {
                  await deleteCollection({ collectionId: filter });
                  setFilter("all");
                  toast.success("Collection deleted");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Could not delete collection"
                  );
                }
              })();
            }}
          >
            <Trash2 className="size-3.5" />
            Delete collection
          </Button>
        </div>
      ) : null}

      {library.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved reactions"
          description="Save a published reaction to keep it in your research library."
          action={
            <Button asChild size="sm">
              <Link href="/barks">Discover reactions</Link>
            </Button>
          }
        />
      ) : (
        library.map((item) => {
          const bark = toUiBark(item.bark);
          return (
            <div key={item.saveId} className="space-y-2">
              <BarkCard bark={bark} />
              <Card className="gap-3 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Collection
                    </p>
                    <Select
                      value={item.collectionId ?? "none"}
                      onValueChange={(value) => {
                        void (async () => {
                          try {
                            await updateSaveMeta({
                              code: bark.code,
                              collectionId:
                                value === "none"
                                  ? null
                                  : (value as Id<"saveCollections">),
                            });
                            toast.success("Collection updated");
                          } catch (error) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Could not update collection"
                            );
                          }
                        })();
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Uncategorized</SelectItem>
                        {collections.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Research note
                    </p>
                    <Textarea
                      key={`${item.saveId}-${item.note ?? ""}`}
                      defaultValue={item.note ?? ""}
                      placeholder="Why this matters…"
                      className="min-h-16 text-xs"
                      onBlur={(e) => {
                        const next = e.target.value.trim();
                        const prev = (item.note ?? "").trim();
                        if (next === prev) return;
                        void (async () => {
                          try {
                            await updateSaveMeta({
                              code: bark.code,
                              note: next || null,
                            });
                            toast.success("Note saved");
                          } catch (error) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Could not save note"
                            );
                          }
                        })();
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          );
        })
      )}
    </div>
  );
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

  const savedCases = caseDocs.map(toUiCase);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <SavedHeader />
      <Tabs defaultValue="barks">
        <TabsList>
          <TabsTrigger value="barks">
            Reactions ({barkDocs.length})
          </TabsTrigger>
          <TabsTrigger value="cases">Cases ({savedCases.length})</TabsTrigger>
          <TabsTrigger value="sources">Sources ({sourceDocs.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="barks" className="mt-4">
          <SavedReactionsLibrary />
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
                  <Link href="/barks">Discover reactions</Link>
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
            description="Save reactions, cases, and sources while you research, then find them here."
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
