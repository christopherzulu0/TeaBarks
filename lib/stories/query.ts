import type { Doc } from "@/convex/_generated/dataModel";
import type { Chapter, Story, StoryGenre, StoryStatus } from "@/lib/story-types";

export type UiStory = Story & {
  authorName: string;
  authorHandle: string;
  partCount: number;
};

export type MineStory = {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  genre: StoryGenre;
  tags: string[];
  status: StoryStatus;
  mature: boolean;
  visibility: "draft" | "public";
  coverImage?: string;
  publishedChapterCount: number;
  reads: number;
  votes: number;
  createdAt: string;
  updatedAt: string;
};

type PublicListDoc = Doc<"stories"> & {
  authorName: string;
  authorHandle: string;
  publishedChapterCount: number;
};

function readingMinutes(wordCount: number) {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.round(wordCount / 200));
}

export function bodyToParagraphs(body: string): string[] {
  const parts = body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : body.trim() ? [body.trim()] : [];
}

export function toUiStory(
  doc: PublicListDoc,
  chapters: Chapter[] = []
): UiStory {
  const partCount = chapters.length || doc.publishedChapterCount;
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    blurb: doc.blurb,
    genre: doc.genre as StoryGenre,
    tags: doc.tags,
    status: doc.status as StoryStatus,
    mature: doc.mature,
    authorId: doc.writerId,
    authorName: doc.authorName,
    authorHandle: doc.authorHandle,
    reads: doc.reads,
    votes: doc.votes,
    commentCount: doc.commentCount,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
    coverImage: doc.coverImage,
    featured: false,
    chapters:
      chapters.length > 0
        ? chapters
        : Array.from({ length: partCount }, (_, i) => ({
            number: i + 1,
            title: "",
            wordCount: 0,
            readingMinutes: 0,
            reads: 0,
            votes: 0,
            publishedAt: doc.updatedAt
              ? new Date(doc.updatedAt).toISOString()
              : new Date().toISOString(),
            paragraphs: [],
          })),
    partCount,
  };
}

export function toUiStoryFromPublic(doc: {
  story: Doc<"stories">;
  authorName: string;
  authorHandle: string;
  chapters: {
    number: number;
    title: string;
    wordCount: number;
    publishedAt?: number;
    updatedAt: number;
  }[];
}): UiStory {
  const chapters: Chapter[] = doc.chapters.map((chapter) => ({
    number: chapter.number,
    title: chapter.title,
    wordCount: chapter.wordCount,
    readingMinutes: readingMinutes(chapter.wordCount),
    reads: 0,
    votes: 0,
    publishedAt: new Date(
      chapter.publishedAt ?? chapter.updatedAt
    ).toISOString(),
    paragraphs: [],
  }));
  return toUiStory(
    {
      ...doc.story,
      authorName: doc.authorName,
      authorHandle: doc.authorHandle,
      publishedChapterCount: chapters.length,
    },
    chapters
  );
}

export function toUiChapter(doc: Doc<"storyChapters">): Chapter {
  return {
    number: doc.number,
    title: doc.title,
    wordCount: doc.wordCount,
    readingMinutes: readingMinutes(doc.wordCount),
    reads: 0,
    votes: 0,
    publishedAt: new Date(doc.publishedAt ?? doc.updatedAt).toISOString(),
    paragraphs: bodyToParagraphs(doc.body),
  };
}

export function toMineStory(
  doc: Doc<"stories"> & { publishedChapterCount: number }
): MineStory {
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    blurb: doc.blurb,
    genre: doc.genre as StoryGenre,
    tags: doc.tags,
    status: doc.status as StoryStatus,
    mature: doc.mature,
    visibility: doc.visibility,
    coverImage: doc.coverImage,
    publishedChapterCount: doc.publishedChapterCount,
    reads: doc.reads,
    votes: doc.votes,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

export function totalReadingMinutes(story: Pick<UiStory, "chapters" | "partCount">) {
  const fromChapters = story.chapters.reduce(
    (sum, chapter) => sum + chapter.readingMinutes,
    0
  );
  return fromChapters > 0 ? fromChapters : story.partCount;
}

export function filterUiStories(
  stories: UiStory[],
  opts: {
    q?: string;
    genre?: string;
    status?: string;
    tag?: string;
    hideMature?: boolean;
  }
) {
  const q = opts.q?.trim().toLowerCase() ?? "";
  return stories.filter((story) => {
    if (opts.hideMature && story.mature) return false;
    if (opts.genre && opts.genre !== "any" && story.genre !== opts.genre) {
      return false;
    }
    if (opts.status && opts.status !== "any" && story.status !== opts.status) {
      return false;
    }
    if (opts.tag && !story.tags.includes(opts.tag)) return false;
    if (!q) return true;
    const haystack = [
      story.title,
      story.blurb,
      story.authorName,
      story.authorHandle,
      ...story.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function storyTags(stories: UiStory[]) {
  const counts = new Map<string, number>();
  for (const story of stories) {
    for (const tag of story.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
