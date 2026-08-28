import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe } from "lucide-react";
import { BarkCard } from "@/components/bark-card";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  listPublicBarksByCountry,
} from "@/app/actions/barks";
import { listCasesByCountry } from "@/app/actions/cases";
import { countries } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export function generateStaticParams() {
  return countries.map((c) => ({ code: c.code }));
}

export async function generateMetadata(props: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await props.params;
  const country = countries.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );
  return { title: country ? `${country.name} discussions` : "Country not found" };
}

export default async function CountryDetailPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const country = countries.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );
  if (!country) notFound();

  const [localBarks, localCases] = await Promise.all([
    listPublicBarksByCountry(country.code),
    listCasesByCountry(country.code),
  ]);
  const barkCount = localBarks.length;
  const activeDiscussions = localBarks.filter((b) => b.replyCount > 0).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link
        href="/countries"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> All countries
      </Link>

      <div className="flex items-start gap-4">
        <span className="text-5xl" aria-hidden>
          {country.flag}
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{country.name}</h1>
          <p className="text-sm text-muted-foreground">
            Local feed of barks and cases grounded in sources from{" "}
            {country.name}.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {formatNumber(barkCount)} barks
            </Badge>
            <Badge variant="outline">
              {activeDiscussions} active discussions
            </Badge>
            <Badge variant="outline" className="font-mono">
              {country.code}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="barks">
        <TabsList>
          <TabsTrigger value="barks">
            Barks ({localBarks.length})
          </TabsTrigger>
          <TabsTrigger value="cases">
            Cases ({localCases.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="barks" className="mt-4 space-y-3">
          {localBarks.length === 0 ? (
            <EmptyState
              icon={Globe}
              title="No local barks yet"
              description="Discussions tagged to this country will appear here."
            />
          ) : (
            localBarks.map((b) => <BarkCard key={b.id} bark={b} />)
          )}
        </TabsContent>
        <TabsContent value="cases" className="mt-4 space-y-3">
          {localCases.length === 0 ? (
            <EmptyState
              icon={Globe}
              title="No local cases"
              description="Accountability cases tied to local sources will show here."
            />
          ) : (
            localCases.map((c) => (
              <CaseCard key={c.id} accountabilityCase={c} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
