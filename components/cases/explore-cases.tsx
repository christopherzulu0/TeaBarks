"use client";

import { Scale } from "lucide-react";
import { useQuery } from "convex/react";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";
import { api } from "@/convex/_generated/api";
import { toUiCase } from "@/lib/cases/query";
import type { AccountabilityCase } from "@/lib/types";

export function ExploreCases({
  selectedCountry,
  countryName,
}: {
  selectedCountry: string;
  countryName?: string;
}) {
  const docs = useQuery(api.cases.listByCountry, { country: selectedCountry });
  const data = docs ? docs.map(toUiCase) : null;

  if (data === null) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading cases">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title={`No cases in ${countryName ?? "this country"} yet`}
        description={`When accountability cases are opened from ${countryName ?? "your selected country"}, they will show up here.`}
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.map((c) => (
        <CaseCard key={c.id} accountabilityCase={c} />
      ))}
    </div>
  );
}
