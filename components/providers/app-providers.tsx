"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { makeQueryClient } from "@/lib/query/client";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => makeQueryClient());

  const tree = (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  if (!convex) return tree;

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {tree}
    </ConvexProviderWithClerk>
  );
}
