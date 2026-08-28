"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterX, Search } from "lucide-react";
import { StoryCard } from "@/components/stories/story-card";
import { WriterDiscoverCtas } from "@/components/stories/writer-cta";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { filterUiStories, storyTags, type UiStory } from "@/lib/stories/query";
import { getGenreMeta, genreMeta, storyStatusMeta } from "@/lib/story-meta";
import type { StoryGenre, StoryStatus } from "@/lib/story-types";
import { cn } from "@/lib/utils";

const ANY = "any";

function paramOrAny(value: string | null) {
  return value && value.length > 0 ? value : ANY;
}

function filtersFromParams(params: URLSearchParams) {
  return {
    query: params.get("q") ?? "",
    genre: paramOrAny(params.get("genre")),
    status: paramOrAny(params.get("status")),
    tag: params.get("tag") ?? "",
    hideMature: params.get("mature") === "hide",
  };
}

function filtersToQuery(filters: {
  query: string;
  genre: string;
  status: string;
  tag: string;
  hideMature: boolean;
}) {
  const next = new URLSearchParams();
  if (filters.query.trim()) next.set("q", filters.query.trim());
  if (filters.genre !== ANY) next.set("genre", filters.genre);
  if (filters.status !== ANY) next.set("status", filters.status);
  if (filters.tag) next.set("tag", filters.tag);
  if (filters.hideMature) next.set("mature", "hide");
  return next.toString();
}

export function StoriesDiscover({
  stories,
  onFilteringChange,
}: {
  stories: UiStory[];
  onFilteringChange?: (active: boolean) => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const genres = Object.keys(genreMeta) as StoryGenre[];
  const statuses = Object.keys(storyStatusMeta) as StoryStatus[];
  const tags = React.useMemo(() => storyTags(stories).slice(0, 16), [stories]);
  const { query: urlQuery, genre, status, tag, hideMature } =
    filtersFromParams(params);
  const [draftQuery, setDraftQuery] = React.useState(urlQuery);
  const [searchQuery, setSearchQuery] = React.useState(urlQuery);
  const focusedRef = React.useRef(false);

  const urlStateRef = React.useRef({
    draftQuery,
    genre,
    hideMature,
    params,
    router,
    status,
    tag,
  });
  urlStateRef.current = {
    draftQuery,
    genre,
    hideMature,
    params,
    router,
    status,
    tag,
  };

  const persistQuery = React.useCallback(
    (value: string, syncRouter: boolean) => {
      const current = urlStateRef.current;
      const qs = filtersToQuery({
        query: value,
        genre: current.genre,
        status: current.status,
        tag: current.tag,
        hideMature: current.hideMature,
      });
      const nextUrl = qs ? `/stories?${qs}` : "/stories";
      if (syncRouter) {
        if (qs === current.params.toString()) return;
        current.router.replace(nextUrl, { scroll: false });
        return;
      }
      if (`${window.location.pathname}${window.location.search}` === nextUrl) {
        return;
      }
      window.history.replaceState(window.history.state, "", nextUrl);
    },
    []
  );

  const commitQuery = React.useCallback(
    (value: string, syncRouter: boolean) => {
      setSearchQuery(value);
      persistQuery(value, syncRouter);
    },
    [persistQuery]
  );

  React.useEffect(() => {
    if (focusedRef.current) return;
    setDraftQuery(urlQuery);
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      commitQuery(draftQuery, false);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [commitQuery, draftQuery]);

  const replaceFilters = React.useCallback(
    (patch: Partial<ReturnType<typeof filtersFromParams>>) => {
      const qs = filtersToQuery({
        query: urlStateRef.current.draftQuery,
        genre,
        status,
        tag,
        hideMature,
        ...patch,
      });
      if (qs === params.toString()) return;
      router.replace(qs ? `/stories?${qs}` : "/stories", { scroll: false });
    },
    [genre, hideMature, params, router, status, tag]
  );

  const filtering =
    Boolean(searchQuery.trim()) ||
    genre !== ANY ||
    status !== ANY ||
    Boolean(tag) ||
    hideMature;

  React.useEffect(() => {
    onFilteringChange?.(filtering);
  }, [filtering, onFilteringChange]);

  const results = React.useMemo(
    () =>
      filterUiStories(stories, {
        q: searchQuery,
        genre,
        status,
        tag,
        hideMature,
      }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [stories, searchQuery, genre, status, tag, hideMature]
  );

  const clear = () => {
    focusedRef.current = false;
    setDraftQuery("");
    setSearchQuery("");
    replaceFilters({
      query: "",
      genre: ANY,
      status: ANY,
      tag: "",
      hideMature: false,
    });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-5 rounded-2xl border bg-gradient-to-b from-primary/5 to-transparent px-6 py-10 text-center sm:py-14">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Stories worth staying up for.
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Serialized fiction from writers you can follow chapter by chapter —
          fantasy, romance, mystery, and everything in the margins.
        </p>

        <div className="mx-auto flex max-w-lg flex-col gap-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              className="h-11 pl-9"
              placeholder="Search stories, authors, tags…"
              aria-label="Search stories"
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              onFocus={() => {
                focusedRef.current = true;
              }}
              onBlur={() => {
                focusedRef.current = false;
                commitQuery(draftQuery, true);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                commitQuery(draftQuery, true);
              }}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Select
              value={genre}
              onValueChange={(value) => replaceFilters({ genre: value })}
            >
              <SelectTrigger aria-label="Genre" className="w-full bg-background">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All genres</SelectItem>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {genreMeta[g].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => replaceFilters({ status: value })}
            >
              <SelectTrigger aria-label="Status" className="w-full bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any status</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {storyStatusMeta[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex h-9 items-center justify-between gap-2 rounded-lg border bg-background px-3 text-sm">
              <Label htmlFor="hide-mature" className="text-xs font-normal">
                Hide mature
              </Label>
              <Switch
                id="hide-mature"
                checked={hideMature}
                onCheckedChange={(checked) =>
                  replaceFilters({ hideMature: checked === true })
                }
              />
            </div>
          </div>
        </div>

        <WriterDiscoverCtas />
      </section>

      {tags.length > 0 && (
      <section className="space-y-3" aria-labelledby="tags-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="tags-heading" className="text-sm font-semibold">
            Browse by tag
          </h2>
          {filtering && (
            <Button variant="ghost" size="sm" onClick={clear}>
              <FilterX className="size-3.5" /> Clear filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag: t, count }) => {
            const active = tag === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => replaceFilters({ tag: active ? "" : t })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                #{t}
                <span className="ml-1.5 text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </div>
      </section>
      )}

      {filtering && (
        <section aria-labelledby="results-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              id="results-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Results
              <Badge variant="secondary" className="ml-2 align-middle">
                {results.length}
              </Badge>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {searchQuery.trim() && (
                <Badge variant="outline">“{searchQuery.trim()}”</Badge>
              )}
              {genre !== ANY && (
                <Badge variant="outline">{getGenreMeta(genre).label}</Badge>
              )}
              {status !== ANY && (
                <Badge variant="outline">
                  {storyStatusMeta[status as StoryStatus].label}
                </Badge>
              )}
              {tag && <Badge variant="outline">#{tag}</Badge>}
              {hideMature && <Badge variant="outline">No mature</Badge>}
            </div>
          </div>
          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No stories match"
              description="Try another tag, genre, or clear the filters."
              action={
                <Button size="sm" variant="outline" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export function StoriesCurated({
  children,
  filtering: filteringOverride,
}: {
  children: React.ReactNode;
  filtering?: boolean;
}) {
  const params = useSearchParams();
  const fromUrl = Boolean(
    params.get("q") ||
      params.get("genre") ||
      params.get("status") ||
      params.get("tag") ||
      params.get("mature")
  );
  if (filteringOverride ?? fromUrl) return null;
  return <>{children}</>;
}
