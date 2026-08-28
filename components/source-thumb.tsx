"use client";

import Image from "next/image";
import { PlatformIcon } from "@/components/platform-icon";
import { gradientFor } from "@/lib/format";
import type { Source } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Thumbnail for a source — Dicebear pattern + platform badge overlay. */
export function SourceThumb({
  source,
  className,
}: {
  source: Source;
  className?: string;
}) {
  const remoteThumb = source.thumbnailUrl;
  const src =
    remoteThumb ??
    `https://api.dicebear.com/9.x/shapes/png?seed=${encodeURIComponent(
      source.id
    )}&size=320`;

  return (
    <div
      className={cn(
        "relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-gradient-to-br",
        gradientFor(source.id),
        className
      )}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        className={
          remoteThumb
            ? "object-cover"
            : "object-cover opacity-70 mix-blend-overlay"
        }
        unoptimized
        sizes="224px"
      />
      <PlatformIcon
        platform={source.platform}
        className="relative z-10 size-6 text-white/90 drop-shadow"
      />
      {source.length && (
        <span className="absolute bottom-1 right-1 z-10 rounded bg-black/60 px-1 py-0.5 text-[10px] font-medium text-white">
          {source.length}
        </span>
      )}
    </div>
  );
}
