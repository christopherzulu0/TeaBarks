"use client";

import Link from "next/link";
import { Compass, PenSquare } from "lucide-react";
import { FeatureLink } from "@/components/auth/feature-link";
import { Button } from "@/components/ui/button";
import { FEATURES } from "@/lib/billing";

export function HomeHeroActions() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Button asChild size="lg">
        <FeatureLink feature={FEATURES.createBark} href="/create">
          <PenSquare className="size-4" />
          Create a Bark
        </FeatureLink>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href="/explore">
          <Compass className="size-4" />
          Explore Discussions
        </Link>
      </Button>
    </div>
  );
}
