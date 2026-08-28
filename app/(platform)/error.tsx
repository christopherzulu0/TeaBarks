"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-disagree/10">
        <AlertTriangle className="size-7 text-disagree" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight">Page error</h1>
        <p className="text-sm text-muted-foreground">
          This section failed to load. Retrying often fixes transient issues.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>Retry</Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
