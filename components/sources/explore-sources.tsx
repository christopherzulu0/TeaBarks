"use client";

import { FileText } from "lucide-react";
import { useQuery } from "convex/react";
import { EmptyState } from "@/components/empty-state";
import { SourceCard } from "@/components/source-card";
import { api } from "@/convex/_generated/api";
import { toUiSource } from "@/lib/sources/query";
import type { Source } from "@/lib/types";

export function ExploreSources({
  initialSources,
}: {
  initialSources: Source[];
}) {
  const docs = useQuery(api.barks.listPublicSources);
  const sources = docs ? docs.map(toUiSource) : initialSources;

  if (sources.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No sources yet"
        description="When reactions are published, their original sources will show up here."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sources.map((source) => (
        <SourceCard
          key={source.id}
          source={source}
          mobileSourceLinkActions
        />
      ))}
    </div>
  );
}
