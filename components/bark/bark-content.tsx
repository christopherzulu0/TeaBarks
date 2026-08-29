"use client";

import { EvidenceCard } from "@/components/evidence-card";
import { ReadingProse } from "@/components/reading-prose";
import type { ContentBlock, Evidence } from "@/lib/types";

export function BarkContent({
  content,
  evidence,
}: {
  content: ContentBlock[];
  evidence: Evidence[];
}) {
  const evidenceById = new Map(evidence.map((e) => [e.id, e]));

  return (
    <ReadingProse>
      {content.map((block, i) => {
        switch (block.kind) {
          case "heading":
            return <h2 key={i}>{block.text}</h2>;
          case "paragraph":
            return <p key={i}>{block.text}</p>;
          case "quote":
            return (
              <blockquote key={i}>
                {block.text}
                {block.attribution && (
                  <footer className="mt-2 font-sans text-xs not-italic text-muted-foreground">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            );
          case "list":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "evidence": {
            const ev = evidenceById.get(block.evidenceId);
            if (!ev) return null;
            return (
              <div key={i} className="my-6 font-sans not-italic">
                <EvidenceCard evidence={ev} className="border-primary/30 bg-primary/[0.03]" />
              </div>
            );
          }
        }
      })}
    </ReadingProse>
  );
}
