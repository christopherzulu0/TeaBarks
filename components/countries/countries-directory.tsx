"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useQuery } from "convex/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { countries } from "@/lib/countries";
import { formatNumber } from "@/lib/format";

export function CountriesDirectory() {
  const [query, setQuery] = React.useState("");
  const stats = useQuery(api.barks.countryStats);
  const q = query.trim().toLowerCase();
  const listed = React.useMemo(() => {
    const byCode = new Map(
      (stats ?? []).map((row) => [row.code.toUpperCase(), row] as const)
    );
    return countries
      .map((country) => {
        const live = byCode.get(country.code);
        return {
          ...country,
          barkCount: live?.barkCount ?? 0,
          activeDiscussions: live?.activeDiscussions ?? 0,
        };
      })
      .sort((a, b) => {
        if (b.barkCount !== a.barkCount) return b.barkCount - a.barkCount;
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });
  }, [stats]);
  const visible = q
    ? listed.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      )
    : listed;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          className="h-10 pl-9"
          placeholder="Search countries…"
          aria-label="Search countries"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {visible.length} of {countries.length} countries
      </p>
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No countries match.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <Link key={c.code} href={`/countries/${c.code}`} className="group">
              <Card className="flex-row items-center gap-4 p-4 transition-colors group-hover:border-primary/50">
                <span className="text-3xl" aria-hidden>
                  {c.flag}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(c.barkCount)} reactions · {c.activeDiscussions}{" "}
                    active discussions
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
