import type { Metadata } from "next";
import Link from "next/link";
import { TeamTable } from "@/components/org/team-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { orgRoleMeta } from "@/lib/meta";
import type { OrgRole } from "@/lib/types";

export const metadata: Metadata = {
  title: "Team Members",
};

export default function TeamPage() {
  const roles = Object.keys(orgRoleMeta) as OrgRole[];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/org">Organization</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/settings">Settings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Team Members</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
        <p className="text-sm text-muted-foreground">
          Manage who can research, write, and publish on behalf of your
          organization.
        </p>
      </div>

      <TeamTable />

      <section aria-labelledby="roles">
        <h2 id="roles" className="mb-3 text-lg font-semibold tracking-tight">
          Role permissions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <Card key={r} className="gap-1 p-4">
              <p className="font-semibold">{orgRoleMeta[r].label}</p>
              <p className="text-sm text-muted-foreground">
                {orgRoleMeta[r].description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
