"use server";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getConvexClerkToken } from "@/lib/convex-clerk";
import {
  toMineStory,
  toUiChapter,
  toUiStory,
  toUiStoryFromPublic,
  type MineStory,
  type UiStory,
} from "@/lib/stories/query";
import type { Chapter } from "@/lib/story-types";
import type { StoryGenre } from "@/lib/story-types";

export async function listPublicStories(): Promise<UiStory[]> {
  const docs = await fetchQuery(api.stories.listPublic, {});
  return docs.map((doc) => toUiStory(doc));
}

export async function listPublicStoriesByGenre(
  genre: StoryGenre
): Promise<UiStory[]> {
  const docs = await fetchQuery(api.stories.listPublicByGenre, { genre });
  return docs.map((doc) => toUiStory(doc));
}

export async function getPublicStoryBySlug(
  slug: string
): Promise<UiStory | null> {
  const doc = await fetchQuery(api.stories.getPublicBySlug, { slug });
  return doc ? toUiStoryFromPublic(doc) : null;
}

export async function getPublicChapterAction(
  slug: string,
  number: number
): Promise<{
  story: UiStory;
  chapter: Chapter;
  authorName: string;
  publishedChapterCount: number;
} | null> {
  const doc = await fetchQuery(api.stories.getPublicChapter, { slug, number });
  if (!doc) return null;
  return {
    story: toUiStory({
      ...doc.story,
      authorName: doc.authorName,
      authorHandle: doc.authorHandle,
      publishedChapterCount: doc.publishedChapterCount,
    }),
    chapter: toUiChapter(doc.chapter),
    authorName: doc.authorName,
    publishedChapterCount: doc.publishedChapterCount,
  };
}

export async function getMyStoriesAction(): Promise<MineStory[]> {
  try {
    const token = await getConvexClerkToken("view your stories");
    const docs = await fetchQuery(api.stories.listMine, {}, { token });
    return docs.map(toMineStory);
  } catch {
    return [];
  }
}

export async function getMyStoryBySlugAction(slug: string): Promise<{
  title: string;
  genre: StoryGenre;
  slug: string;
  draftTitle: string;
  draftBody: string;
  nextNumber: number;
} | null> {
  try {
    const token = await getConvexClerkToken("view your stories");
    const doc = await fetchQuery(api.stories.getMineBySlug, { slug }, { token });
    if (!doc) return null;
    const nextNumber = doc.draft
      ? doc.draft.number
      : doc.publishedChapterCount + 1;
    return {
      title: doc.story.title,
      genre: doc.story.genre as StoryGenre,
      slug: doc.story.slug,
      draftTitle: doc.draft?.title ?? `Part ${nextNumber}`,
      draftBody: doc.draft?.body ?? "",
      nextNumber,
    };
  } catch {
    return null;
  }
}
