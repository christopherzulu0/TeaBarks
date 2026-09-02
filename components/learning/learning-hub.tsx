"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { LearningArticle } from "@/components/learning/learning-article";
import { LearningDownload } from "@/components/learning/learning-download";
import { LearningResourceCard } from "@/components/learning/learning-resource-card";
import { LearningVideoPlayer } from "@/components/learning/learning-video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/convex/_generated/api";
import {
  learningCategories,
  learningCategoryLabel,
  learningTypeMeta,
} from "@/lib/learning/catalog";
import { toUiLearningResource } from "@/lib/learning/query";
import type { LearningCategory, LearningResourceType } from "@/lib/types";

const typeFilters: Array<{ id: "all" | LearningResourceType; label: string }> =
  [
    { id: "all", label: "All" },
    { id: "video", label: "Videos" },
    { id: "article", label: "Articles" },
    { id: "download", label: "Downloads" },
  ];

export function LearningHub() {
  const docs = useQuery(api.learning.listPublished);
  const resources = React.useMemo(
    () => (docs ?? []).map(toUiLearningResource),
    [docs]
  );
  const [category, setCategory] =
    React.useState<LearningCategory>("getting-started");
  const [typeFilter, setTypeFilter] = React.useState<
    "all" | LearningResourceType
  >("all");

  const filtered = resources.filter((r) => {
    if (r.category !== category) return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    return true;
  });

  if (docs === undefined) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="size-6" aria-hidden />
          <span className="text-sm font-medium uppercase tracking-wide">
            Learning Center
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Master evidence-based discussion
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Watch tutorials, read guides, and download checklists to get the most
          out of TypeReact — from your first reaction to opening an
          accountability case.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {learningCategories.map((cat) => (
          <Button
            key={cat.id}
            type="button"
            size="sm"
            variant={category === cat.id ? "default" : "outline"}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {learningCategories.find((c) => c.id === category)?.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => (
          <Badge
            key={filter.id}
            variant={typeFilter === filter.id ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setTypeFilter(filter.id)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No resources in this category yet"
          description="Check back soon — we're adding guides and tutorials regularly."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => (
            <LearningResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LearningResourceDetail({ slug }: { slug: string }) {
  const doc = useQuery(api.learning.getBySlug, { slug });
  const allDocs = useQuery(api.learning.listPublished);
  const resource = doc ? toUiLearningResource(doc) : null;
  const related = React.useMemo(() => {
    if (!resource || !allDocs) return [];
    return allDocs
      .map(toUiLearningResource)
      .filter(
        (r) => r.category === resource.category && r.slug !== resource.slug
      )
      .slice(0, 3);
  }, [allDocs, resource]);

  if (doc === undefined) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!resource) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="Resource not found"
        description="This guide may have been removed or is not published yet."
        action={
          <Button asChild variant="outline">
            <Link href="/learn">Back to Learning Center</Link>
          </Button>
        }
      />
    );
  }

  const typeMeta = learningTypeMeta[resource.type];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/learn">
            <ArrowLeft className="size-4" aria-hidden />
            Learning Center
          </Link>
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/learn">Learning Center</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {learningCategoryLabel(resource.category)}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[12rem] truncate sm:max-w-none">
                {resource.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{typeMeta.label}</Badge>
            <Badge variant="outline">
              {learningCategoryLabel(resource.category)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{resource.title}</h1>
          <p className="text-muted-foreground">{resource.description}</p>
        </div>
      </div>

      {resource.type === "video" ? (
        <LearningVideoPlayer resource={resource} />
      ) : null}
      {resource.type === "article" && resource.contentBlocks?.length ? (
        <LearningArticle blocks={resource.contentBlocks} />
      ) : null}
      {resource.type === "download" ? (
        <LearningDownload resource={resource} />
      ) : null}

      {related.length > 0 ? (
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-lg font-semibold">
            More in {learningCategoryLabel(resource.category)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <LearningResourceCard key={item.id} resource={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
