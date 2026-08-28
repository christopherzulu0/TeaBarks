"use client";

import {
  CreateOrganization,
  OrganizationProfile,
  useAuth,
} from "@clerk/nextjs";
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
            Switch into a workspace to manage members and domains.
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
            Profile, members, and domains.
          </p>
        </div>
        <OrganizationProfile
          routing="hash"
          appearance={{
            elements: { rootBox: "w-full", cardBox: "shadow-none w-full" },
          }}
        />
      </Card>
      <p className="text-sm text-muted-foreground">
        Invite teammates and assign roles from the Members tab above.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Verified domains</CardTitle>
          <CardDescription>
            Domain tools live in the Organization profile tabs above. A domain
            used for Enterprise SSO cannot also be a Verified Domain.
          </CardDescription>
        </CardHeader>
      </Card>
      <SsoStatusCard />
    </div>
  );
}
