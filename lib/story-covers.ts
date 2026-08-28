import type { Story } from "@/lib/story-types";

/**
 * Curated Unsplash covers keyed by story id.
 * Deterministic fallback uses Picsum seeded by slug.
 */
const COVERS: Record<string, string> = {
  // The Cartographer's Debt — maps / antique
  "st-1":
    "https://images.unsplash.com/photo-1524661132062-86567d9bde1f?auto=format&fit=crop&w=1200&q=80",
  // The House That Wasn't on the Lease — haunted house
  "st-2":
    "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80",
  // The Alibi Orchard — orchard / small town
  "st-3":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  // Terms and Conditions of Us — city romance
  "st-4":
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
  // Lagrange Point Zero — space
  "st-5":
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
  // The Year of Borrowed Uniforms — school / teen
  "st-6":
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  // The Winter Typist — historical wartime
  "st-7":
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
  // Field Notes on a Vanishing — nature / poetry
  "st-8":
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  // Salt and Circuitry — climate / tech
  "st-9":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  // The Understudy — theatre
  "st-10":
    "https://images.unsplash.com/photo-1503096630326-40c5b5c7d0b5?auto=format&fit=crop&w=1200&q=80",
  // How to Unwrite a Summer — friendship / summer
  "st-11":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  // The Second Spring of Widow Esperanza — letters / town
  "st-12":
    "https://images.unsplash.com/photo-1516414447565-b14be529dff2?auto=format&fit=crop&w=1200&q=80",
};

/** Genre fallbacks when a story id is missing from the map. */
const GENRE_COVERS: Record<string, string> = {
  "true-crime":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "unsolved-cases":
    "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
  "missing-persons":
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
  "cold-cases":
    "https://images.unsplash.com/photo-1483664852095-d6ccdc07069e?auto=format&fit=crop&w=1200&q=80",
  "court-cases":
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  "police-investigations":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "scary-stories":
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=80",
  unexplained:
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1200&q=80",
  "ufo-uap":
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
  mysteries:
    "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
  "historical-mysteries":
    "https://images.unsplash.com/photo-1461360228754-6e81c26f0d37?auto=format&fit=crop&w=1200&q=80",
  history:
    "https://images.unsplash.com/photo-1461360228754-6e81c26f0d37?auto=format&fit=crop&w=1200&q=80",
  "ancient-mysteries":
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
  "legends-folklore":
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
  "strange-cases":
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
  "witness-stories":
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
  "untold-stories":
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  "forgotten-stories":
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
  "disasters-accidents":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
  aviation:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  maritime:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  survival:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  "human-stories":
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  "survivor-stories":
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  tragedies:
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
  "scams-frauds":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  "corporate-stories":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "science-mysteries":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "ocean-mysteries":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "lost-places-discoveries":
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
  "remarkable-people":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  "inspiring-stories":
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  investigations:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "justice-convictions":
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  "teabarks-originals":
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
};

export function storyCoverUrl(story: Pick<Story, "id" | "slug" | "genre" | "coverImage">): string {
  if (story.coverImage) return story.coverImage;
  return (
    COVERS[story.id] ??
    GENRE_COVERS[story.genre] ??
    `https://picsum.photos/seed/teabarks-${encodeURIComponent(story.slug)}/960/540`
  );
}
