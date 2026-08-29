"use client";

import { ReadingTextSizeControl } from "@/components/reading-text-size-control";

export function ReviewReadingToolbar() {
  return (
    <div className="mb-4 flex items-center justify-end">
      <ReadingTextSizeControl />
    </div>
  );
}
