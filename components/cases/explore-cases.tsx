"use client";

import { Scale } from "lucide-react";
import { useQuery } from "convex/react";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";
import { api } from "@/convex/_generated/api";
import { toUiCase } from "@/lib/cases/query";
import type { AccountabilityCase } from "@/lib/types";

export function ExploreCases({
  initialCases,
}: {
  initialCases: AccountabilityCase[];
}) {
  const docs = useQuery(api.cases.list);
  const data = docs ? docs.map(toUiCase) : initialCases;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title="No published cases yet"
        description="When someone opens an accountability case, it will show up here."
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
