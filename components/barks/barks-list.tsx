"use client";

import { MessageSquare } from "lucide-react";
import { useQuery } from "convex/react";
import { BarkCard } from "@/components/bark-card";
import { EmptyState } from "@/components/empty-state";
import { PaginatedList } from "@/components/paginated-list";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { sortBarksByPublishedAt, toUiBark } from "@/lib/barks/query";
import type { Bark, BarkType } from "@/lib/types";

const types: { value: BarkType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "agree", label: "Agree" },
  { value: "disagree", label: "Disagree" },
  { value: "mixed", label: "Mixed" },
  { value: "unpack", label: "Unpack" },
];

const empty = (
  <EmptyState
    icon={MessageSquare}
    title="No published reactions yet"
    description="When someone publishes a reaction, it will show up here."
  />
);

export function BarksList({ initialBarks }: { initialBarks: Bark[] }) {
  const docs = useQuery(api.barks.listPublic);
  const data = docs ? docs.map(toUiBark) : initialBarks;
  const sorted = sortBarksByPublishedAt(data);

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full sm:w-auto">
        {types.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {types.map((t) => {
        const items =
          t.value === "all" ? sorted : sorted.filter((b) => b.type === t.value);
        return (
          <TabsContent key={t.value} value={t.value} className="mt-4">
            <PaginatedList
              items={items}
              pageSize={5}
              empty={empty}
              renderItem={(b) => <BarkCard key={b.id} bark={b} />}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
