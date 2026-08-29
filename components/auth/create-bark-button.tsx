"use client";

import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateBarkButton() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <Button size="sm" className="hidden sm:inline-flex">
            <PenSquare className="size-4" />
            Create Reaction
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/create">
            <PenSquare className="size-4" />
            Create Reaction
          </Link>
        </Button>
      </Show>
    </>
  );
}
