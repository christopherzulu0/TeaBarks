import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { listPublicCreators } from "@/app/actions/creators";
import { CreatorsDirectory } from "@/components/creators/creators-directory";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Creators",
};

export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const creators = await listPublicCreators();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Creators</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Public figures and publishers under discussion on TypeReact — with
            the right to claim their profile, respond officially, and face
            evidence on the record.
          </p>
        </div>
        <Button asChild>
          <Link href="/creators/apply">
            <BadgeCheck className="size-4" />
            Become a Creator
          </Link>
        </Button>
      </div>
      <CreatorsDirectory initialCreators={creators} />
    </div>
  );
}
