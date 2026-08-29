"use client";

import Link from "next/link";
import { Compass, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHeroActions() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Button asChild size="lg">
        <Link href="/create">
          <PenSquare className="size-4" />
          Create Reaction
        </Link>
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
