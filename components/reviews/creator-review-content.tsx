import type { ContentBlock } from "@/lib/types";

export function CreatorReviewContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-bark space-y-5">
      {blocks.map((block, i) => {
        if (block.kind === "paragraph") {
          return <p key={i}>{block.text}</p>;
        }
        return null;
      })}
    </div>
  );
}
