"use client";

import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBillingAccess } from "@/components/auth/use-billing";
import { FEATURES } from "@/lib/billing";

export function CreateBarkButton() {
  const billing = useBillingAccess();
  const allowed = billing.canUse(FEATURES.createBark);

  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <Button size="sm" className="hidden sm:inline-flex">
            <PenSquare className="size-4" />
            Create Bark
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        {!billing.isLoaded ? null : allowed ? (
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/create">
              <PenSquare className="size-4" />
              Create Bark
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex"
          >
            <Link href="/pricing">Upgrade to create</Link>
          </Button>
        )}
      </Show>
    </>
  );
}
