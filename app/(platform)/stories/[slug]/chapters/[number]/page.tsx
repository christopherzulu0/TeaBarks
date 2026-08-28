import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicChapterAction } from "@/app/actions/stories";
import { ChapterReader } from "@/components/stories/chapter-reader";

export const dynamic = "force-dynamic";

async function loadChapter(slug: string, rawNumber: string) {
  const number = Number(rawNumber);
  if (!Number.isFinite(number) || number < 1) return null;
  return getPublicChapterAction(slug, number);
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; number: string }>;
}): Promise<Metadata> {
  const { slug, number } = await props.params;
  const data = await loadChapter(slug, number);
  return {
    title: data
      ? `${data.chapter.title} — ${data.story.title}`
      : "Chapter not found",
  };
}

export default async function ChapterPage(props: {
  params: Promise<{ slug: string; number: string }>;
}) {
  const { slug, number } = await props.params;
  const data = await loadChapter(slug, number);
  if (!data) notFound();

  return (
    <ChapterReader
      storySlug={data.story.slug}
      storyTitle={data.story.title}
      authorName={data.authorName}
      chapter={data.chapter}
      totalChapters={data.publishedChapterCount}
      storyVotes={data.story.votes}
    />
  );
}
