import type { Metadata } from "next";
import { CountriesDirectory } from "@/components/countries/countries-directory";

export const metadata: Metadata = {
  title: "Countries",
};

export default function CountriesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Countries</h1>
        <p className="text-sm text-muted-foreground">
          Local discussions grounded in local sources, from every region.
        </p>
      </div>
      <CountriesDirectory />
    </div>
  );
}
