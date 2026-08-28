"use client";

import Link from "next/link";
import {
  CreateOrganization,
  OrganizationProfile,
  useOrganization,
} from "@clerk/nextjs";
import {
  Activity,
  FileText,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SsoStatusCard } from "@/components/org/sso-status-card";
import { ActivityChart } from "@/components/org/activity-chart";
import { PersonAvatar } from "@/components/person-avatar";
import { BarkCard } from "@/components/bark-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toUiBark } from "@/lib/barks/query";
import { toUiCase } from "@/lib/cases/query";
import { formatNumber } from "@/lib/format";
import { caseStatusMeta } from "@/lib/meta";

const statMeta: {
  label: string;
  icon: LucideIcon;
  suffix?: string;
}[] = [
  { label: "Total Barks", icon: FileText },
  { label: "Active Cases", icon: Scale },
  { label: "Team Members", icon: Users },
  { label: "Research Activity", icon: Activity, suffix: "%" },
];

function clerkRoleLabel(role: string) {
  const slug = role.replace(/^org:/, "");
  if (!slug) return "Member";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

type OrgMemberRow = {
  id: string;
  role: string;
  publicUserData?: {
    userId?: string;
    firstName?: string | null;
    lastName?: string | null;
    identifier?: string;
    imageUrl?: string;
  } | null;
};

export function OrgWorkspace() {
  const { organization: clerkOrg, isLoaded, memberships } = useOrganization({
    memberships: { infinite: true },
  });
  const dashboard = useQuery(api.org.dashboard);
  const team = (
    (memberships as { data?: OrgMemberRow[] } | null | undefined)?.data ?? []
  ).slice(0, 6);
  const stats = [
    dashboard?.stats.totalBarks ?? 0,
    dashboard?.stats.activeCases ?? 0,
    clerkOrg?.membersCount ?? team.length,
    dashboard?.stats.researchActivity ?? 0,
  ];
  const recentBarks = (dashboard?.recentBarks ?? []).map(toUiBark);
  const activeCases = (dashboard?.activeCases ?? []).map(toUiCase);
  const activity = dashboard?.activity ?? [];

  if (!isLoaded) return null;

  if (!clerkOrg) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-12 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Create an organization
        </h1>
        <p className="text-sm text-muted-foreground">
          Organizations let newsrooms and research desks publish under a shared
          name and invite members.
        </p>
        <div className="flex justify-center">
          <CreateOrganization afterCreateOrganizationUrl="/org" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
            {clerkOrg.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              {clerkOrg.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              @{clerkOrg.slug} · workspace
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statMeta.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="gap-1 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <Icon className="size-4 text-primary" aria-hidden />
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {formatNumber(stats[i] ?? 0)}
                {s.suffix ?? ""}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-4">
          <h2 className="text-sm font-semibold">Organization profile</h2>
          <p className="text-xs text-muted-foreground">
            Members and domains live in Clerk.
          </p>
        </div>
        <OrganizationProfile
          routing="hash"
          appearance={{
            elements: { rootBox: "w-full", cardBox: "shadow-none w-full" },
          }}
        />
      </Card>

      <SsoStatusCard />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Research Activity</CardTitle>
              <CardDescription>
                Barks published, cases opened, and evidence filed per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityChart data={activity} />
            </CardContent>
          </Card>

          <section>
            <h2 className="mb-3 text-lg font-semibold tracking-tight">
              Recent team publications
            </h2>
            <div className="space-y-3">
              {recentBarks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No published barks yet.
                </p>
              ) : (
                recentBarks.map((b) => <BarkCard key={b.id} bark={b} />)
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <Card className="gap-3 py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-sm">Active cases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4">
              {activeCases.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No active cases yet.
                </p>
              )}
              {activeCases.map((c) => (
                <Link key={c.id} href={`/cases/${c.code}`} className="group block">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {c.code}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${caseStatusMeta[c.status].badgeClass}`}
                    >
                      {caseStatusMeta[c.status].label}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-primary">
                    {c.title}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="gap-3 py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-sm">Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4">
              {team.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members yet.</p>
              ) : (
                team.map((m) => {
                  const user = m.publicUserData;
                  const name =
                    [user?.firstName, user?.lastName]
                      .filter(Boolean)
                      .join(" ")
                      .trim() ||
                    user?.identifier ||
                    "Member";
                  const id = user?.userId ?? m.id;
                  return (
                    <div key={m.id} className="flex items-center gap-2.5">
                      <PersonAvatar
                        id={id}
                        name={name}
                        imageUrl={user?.imageUrl}
                        className="size-8"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">
                          {clerkRoleLabel(m.role)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
