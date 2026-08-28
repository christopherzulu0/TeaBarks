"use client";

import { Scale } from "lucide-react";
import { useQuery } from "convex/react";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";
import { PaginatedList } from "@/components/paginated-list";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { toUiCase } from "@/lib/cases/query";
import type { AccountabilityCase, CaseStatus } from "@/lib/types";

const statusTabs: { value: CaseStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "under-review", label: "Under Review" },
  { value: "responded", label: "Responded" },
  { value: "resolved", label: "Resolved" },
];

export function CasesList({
  initialCases,
}: {
  initialCases: AccountabilityCase[];
}) {
  const docs = useQuery(api.cases.list);
  const data = docs ? docs.map(toUiCase) : initialCases;
  const sorted = [...data].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full flex-wrap sm:w-auto">
        {statusTabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {statusTabs.map((t) => {
        const items =
          t.value === "all"
            ? sorted
            : sorted.filter((c) => c.status === t.value);
        return (
          <TabsContent key={t.value} value={t.value} className="mt-4">
            <PaginatedList
              items={items}
              pageSize={5}
              empty={
                <EmptyState
                  icon={Scale}
                  title={
                    t.value === "all"
                      ? "No published cases yet"
                      : "No cases with this status"
                  }
                  description={
                    t.value === "all"
                      ? "When someone opens an accountability case, it will show up here."
                      : "Cases move between statuses as evidence is added and creators respond."
                  }
                />
              }
              renderItem={(c) => (
                <CaseCard key={c.id} accountabilityCase={c} />
              )}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
