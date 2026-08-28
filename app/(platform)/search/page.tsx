import type { Metadata } from "next";
import { Suspense } from "react";
import { listPublicBarks } from "@/app/actions/barks";
import { listCases } from "@/app/actions/cases";
import { SearchView } from "@/components/search/search-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Search",
};

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [cases, barks] = await Promise.all([listCases(), listPublicBarks()]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-11 w-full" />
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      }
    >
      <SearchView initialCases={cases} initialBarks={barks} />
    </Suspense>
  );
}
