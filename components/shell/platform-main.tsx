"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/shell/footer";
import { cn } from "@/lib/utils";

export function PlatformMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMessages = pathname.startsWith("/messages");

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <main
        id="main"
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden",
          "pb-16 lg:pb-0",
          isMessages && "overflow-hidden"
        )}
      >
        {children}
      </main>
      {isMessages ? null : <Footer />}
    </div>
  );
}
