"use client";

import * as React from "react";
import Image from "next/image";
import { gradientFor, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PersonAvatar({
  id,
  name,
  imageUrl,
  className,
}: {
  id: string;
  name: string;
  imageUrl?: string;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const src =
    imageUrl ??
    `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(
      id
    )}&backgroundType=gradientLinear&fontWeight=600`;

  return (
    <span
      className={cn(
        "relative inline-flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      aria-hidden
    >
      {failed ? (
        <span
          className={cn(
            "flex size-full items-center justify-center bg-gradient-to-br text-[0.6em] font-semibold text-white",
            gradientFor(id)
          )}
        >
          {initials(name)}
        </span>
      ) : (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          unoptimized
          sizes="40px"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
