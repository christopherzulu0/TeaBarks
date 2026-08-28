import type { Metadata } from "next";
import { OrgPricingTable } from "@/components/billing/org-pricing-table";
import { PersonalPricingTable } from "@/components/billing/personal-pricing-table";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
        <p className="text-sm text-muted-foreground">
          Writer and Pro unlock creating barks and the writer dashboard on your
          account. Team, Newsroom, and Enterprise do the same for every seat in
          an organization. If the header shows an organization, subscribe from
          Organizations below — or keep a personal Writer/Pro plan; both count.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold tracking-tight">Personal</h2>
          <p className="text-sm text-muted-foreground">
            For your own account. Writer and Pro both include{" "}
            <code className="rounded bg-muted px-1">create_bark</code> and{" "}
            <code className="rounded bg-muted px-1">writer_dashboard</code>.
          </p>
        </div>
        <PersonalPricingTable />
      </section>

      <section className="space-y-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold tracking-tight">
            Organizations
          </h2>
          <p className="text-sm text-muted-foreground">
            Billed per seat. Members need those features on the org plan; org
            admins can still publish and write.
          </p>
        </div>
        <OrgPricingTable />
      </section>
    </div>
  );
}
