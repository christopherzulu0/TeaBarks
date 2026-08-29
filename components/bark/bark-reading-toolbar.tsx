"use client";

import { ReadingTextSizeControl } from "@/components/reading-text-size-control";

export function BarkReadingToolbar() {
  return (
    <div className="mb-3 flex items-center justify-end">
      <ReadingTextSizeControl />
    </div>
  );
}
