"use client";

import { RedirectToSignIn, Show, useAuth } from "@clerk/nextjs";
import { RouteLoading } from "@/components/route-loading";

export function RequireSignIn({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <RouteLoading variant="detail" />;

  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}
