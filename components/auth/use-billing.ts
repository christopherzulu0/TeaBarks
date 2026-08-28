"use client";

import { useAuth } from "@clerk/nextjs";
import { canUseFeature, featureHref } from "@/lib/billing";

export function useBillingAccess() {
  const { isLoaded, isSignedIn, orgId, has, sessionClaims } = useAuth();
  const claims = sessionClaims as
    | { fea?: unknown; pla?: unknown; features?: unknown }
    | null
    | undefined;

  return {
    isLoaded,
    isSignedIn,
    canUse: (feature: string) =>
      canUseFeature(has, { orgId, feature, sessionClaims: claims }),
    hrefFor: (feature: string, href: string, fallback?: string) =>
      featureHref(has, {
        isLoaded,
        isSignedIn,
        orgId,
        feature,
        href,
        fallback,
        sessionClaims: claims,
      }),
  };
}
