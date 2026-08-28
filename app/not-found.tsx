import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="size-8 text-muted-foreground" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">
          This page doesn&apos;t exist
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The bark, case, or profile you&apos;re looking for may have been moved,
          renamed, or never existed. Check the code and try again.
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/explore">Explore discussions</Link>
        </Button>
      </div>
    </div>
  );
}
