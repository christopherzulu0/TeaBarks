"use client";

import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SsoStatusCard() {
  const { user } = useUser();
  const account = user?.enterpriseAccounts?.[0];
  const conn = account?.enterpriseConnection;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Enterprise SSO</CardTitle>
        <CardDescription>
          IdP connections are configured in the Clerk Dashboard. A domain used
          for Enterprise SSO cannot also be a Verified Domain.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        {account && conn ? (
          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd>{account.emailAddress}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Provider</dt>
              <dd>{conn.provider}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Protocol</dt>
              <dd>{conn.protocol}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Domain</dt>
              <dd>{conn.domain}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-muted-foreground">
            No enterprise connection on this account. Add a SAML or OIDC
            connection under Clerk Dashboard → Enterprise Connections, then
            members on that domain will see SSO on the sign-in page.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
