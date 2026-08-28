import type { Doc } from "@/convex/_generated/dataModel";
import type { StoryGenre } from "@/lib/story-types";

export type WriterProfile = {
  id: string;
  handle: string;
  penName: string;
  applicationCode: string;
  language: string;
  genres: StoryGenre[];
  sampleTitle: string;
  followers: number;
};

export function toUiWriter(doc: Doc<"writers">): WriterProfile {
  return {
    id: doc._id,
    handle: doc.handle,
    penName: doc.penName,
    applicationCode: doc.applicationCode,
    language: doc.language,
    genres: doc.genres as StoryGenre[],
    sampleTitle: doc.sampleTitle,
    followers: doc.followers ?? 0,
  };
}
