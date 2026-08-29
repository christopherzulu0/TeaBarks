"use client";

import { MessageSquare } from "lucide-react";
import { useQuery } from "convex/react";
import { BarkCard } from "@/components/bark-card";
import { EmptyState } from "@/components/empty-state";
import { api } from "@/convex/_generated/api";
import { sortBarksByViews, toUiBark } from "@/lib/barks/query";
import type { Bark } from "@/lib/types";

export function ExploreBarks({ initialBarks }: { initialBarks: Bark[] }) {
  const docs = useQuery(api.barks.listPublic);
  const data = docs ? docs.map(toUiBark) : initialBarks;
  const trending = sortBarksByViews(data);

  if (trending.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No published reactions yet"
        description="When someone publishes a reaction, it will show up here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {trending.map((b) => (
        <BarkCard key={b.id} bark={b} />
      ))}
    </div>
  );
}
