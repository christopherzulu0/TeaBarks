import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { listPublicStoriesByGenre } from "@/app/actions/stories";
import { StoryCard } from "@/components/stories/story-card";
import { EmptyState } from "@/components/empty-state";
import { genreMeta } from "@/lib/story-meta";
import type { StoryGenre } from "@/lib/story-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/stories/genres/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const meta = genreMeta[slug as StoryGenre];
  return { title: meta ? `${meta.label} Stories` : "Genre not found" };
}

export default async function GenrePage(
  props: PageProps<"/stories/genres/[slug]">
) {
  const { slug } = await props.params;
  const meta = genreMeta[slug as StoryGenre];
  if (!meta) notFound();

  const items = await listPublicStoriesByGenre(slug as StoryGenre);
  const Icon = meta.icon;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/stories"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> All stories
      </Link>
      <div
        className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br p-6 text-white ${meta.gradient}`}
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Icon className="size-7" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm">
            {meta.label}
          </h1>
          <p className="text-sm text-white/85">{meta.description}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No stories in this genre yet"
          description="Be the first — writers can publish here after a quick application."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      )}
    </div>
  );
}
