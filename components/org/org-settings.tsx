"use client";

import {
  CreateOrganization,
  OrganizationProfile,
  useAuth,
} from "@clerk/nextjs";
import { PermissionGate } from "@/components/auth/permission-gate";
import { SsoStatusCard } from "@/components/org/sso-status-card";
import { RouteLoading } from "@/components/route-loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OrgSettings() {
  const { isLoaded, orgId } = useAuth();
  if (!isLoaded) return <RouteLoading variant="detail" />;

  if (!orgId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create an organization</CardTitle>
          <CardDescription>
            Switch into a workspace to manage members, domains, and billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <CreateOrganization afterCreateOrganizationUrl="/settings/organization" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="p-4">
          <h2 className="font-semibold">Organization</h2>
          <p className="text-sm text-muted-foreground">
            Profile, members, domains, and billing. Tabs respect your role.
          </p>
        </div>
        <OrganizationProfile
          routing="hash"
          appearance={{
            elements: { rootBox: "w-full", cardBox: "shadow-none w-full" },
          }}
        />
      </Card>
      <PermissionGate permission="org:sys_memberships:manage" hideWhenDenied>
        <p className="text-sm text-muted-foreground">
          You can invite teammates and assign editor or moderator roles from
          the Members tab above.
        </p>
      </PermissionGate>

      <PermissionGate permission="org:sys_domains:manage" hideWhenDenied>
        <Card>
          <CardHeader>
            <CardTitle>Verified domains</CardTitle>
            <CardDescription>
              Domain tools live in the Organization profile tabs above. A domain
              used for Enterprise SSO cannot also be a Verified Domain.
            </CardDescription>
          </CardHeader>
        </Card>
      </PermissionGate>

      <PermissionGate permission="org:sys_billing:manage" hideWhenDenied>
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>
              Change the organization plan and seat count.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/pricing" className="text-sm font-medium text-primary hover:underline">
              Open pricing
            </a>
          </CardContent>
        </Card>
      </PermissionGate>

      <SsoStatusCard />
    </div>
  );
}
