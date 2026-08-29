"use client";

import type { ContentBlock } from "@/lib/types";
import { ReadingProse } from "@/components/reading-prose";

export function CreatorReviewContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <ReadingProse className="space-y-5">
      {blocks.map((block, i) => {
        if (block.kind === "paragraph") {
          return <p key={i}>{block.text}</p>;
        }
        return null;
      })}
    </ReadingProse>
  );
}
