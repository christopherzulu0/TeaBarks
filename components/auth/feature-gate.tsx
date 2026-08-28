"use client";

import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useBillingAccess } from "@/components/auth/use-billing";
import { billingFeatureLabel } from "@/lib/billing";

export function FeatureGate({
  feature,
  children,
  fallback,
}: {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, orgId } = useAuth();
  const billing = useBillingAccess();
  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <>
        {fallback ?? (
          <div className="mx-auto max-w-lg space-y-3 rounded-xl border p-6 text-center">
            <p className="font-semibold">Sign in to continue</p>
            <p className="text-sm text-muted-foreground">
              This action needs an account on a plan that includes{" "}
              {billingFeatureLabel(feature)}.
            </p>
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          </div>
        )}
      </>
    );
  }

  if (billing.canUse(feature)) return <>{children}</>;

  const whose = orgId ? "Your organization" : "Your plan";

  return (
    <>
      {fallback ?? (
        <div className="mx-auto max-w-lg space-y-3 rounded-xl border p-6 text-center">
          <p className="font-semibold">This feature is on a paid plan</p>
          <p className="text-sm text-muted-foreground">
            {whose} needs Writer, Pro, or an organization plan (Team,
            Newsroom, or Enterprise). If you just subscribed, refresh once so
            the new plan is on your session.
          </p>
          <Button asChild>
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      )}
    </>
  );
}
