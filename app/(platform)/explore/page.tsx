import type { Metadata } from "next";
import Link from "next/link";
import { ExploreBarks } from "@/components/barks/explore-barks";
import { ExploreCases } from "@/components/cases/explore-cases";
import { ExploreSources } from "@/components/sources/explore-sources";
import { RightPanel } from "@/components/shell/right-panel";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { listPublicBarks, listPublicSources } from "@/app/actions/barks";
import { listCases } from "@/app/actions/cases";
import { topics } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore",
};

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const [publishedCases, publishedBarks, publishedSources] = await Promise.all([
    listCases(),
    listPublicBarks(),
    listPublicSources(),
  ]);
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 space-y-6 px-4 py-8 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Explore</h1>
          <p className="text-sm text-muted-foreground">
            Discover what the world is analyzing right now.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <Link key={t.slug} href={`/topics/${t.slug}`}>
              <Badge
                variant={t.trending ? "default" : "secondary"}
                className="cursor-pointer"
              >
                {t.name}
              </Badge>
            </Link>
          ))}
        </div>

        <Tabs defaultValue="sources">
          <TabsList>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="barks">Reactions</TabsTrigger>
            <TabsTrigger value="cases">Cases</TabsTrigger>
          </TabsList>
          <TabsContent value="sources" className="mt-4">
            <ExploreSources initialSources={publishedSources} />
          </TabsContent>
          <TabsContent value="barks" className="mt-4">
            <ExploreBarks initialBarks={publishedBarks} />
          </TabsContent>
          <TabsContent value="cases" className="mt-4">
            <ExploreCases initialCases={publishedCases} />
          </TabsContent>
        </Tabs>
      </div>
      <RightPanel />
    </div>
  );
}
