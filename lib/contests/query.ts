import type { Doc } from "@/convex/_generated/dataModel";

export type UiContest = {
  id: string;
  slug: string;
  name: string;
  theme: string;
  prize: string;
  description: string;
  deadlineAt: number;
  entries: number;
  status: "active" | "closed";
  winnerSlug?: string;
};

export function toUiContest(doc: Doc<"contests">): UiContest {
  return {
    id: doc._id,
    slug: doc.slug,
    name: doc.name,
    theme: doc.theme,
    prize: doc.prize,
    description: doc.description,
    deadlineAt: doc.deadlineAt,
    entries: doc.entryCount,
    status: doc.status,
    winnerSlug: doc.winnerSlug,
  };
}

export function daysLeft(deadlineAt: number): number {
  return Math.max(
    0,
    Math.ceil((deadlineAt - Date.now()) / 86_400_000)
  );
}
