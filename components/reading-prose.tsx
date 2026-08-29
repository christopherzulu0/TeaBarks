"use client";

import * as React from "react";
import { useReadingTextSize } from "@/components/reading-text-size-provider";
import { readingTextSizeClass } from "@/lib/reading-text-size";
import { cn } from "@/lib/utils";

export const ReadingProse = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(function ReadingProse({ className, ...props }, ref) {
  const { textSize } = useReadingTextSize();

  return (
    <div
      ref={ref}
      className={cn("prose-bark", readingTextSizeClass[textSize], className)}
      {...props}
    />
  );
});
