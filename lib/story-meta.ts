import {
  Anchor,
  Archive,
  Award,
  Ban,
  BookMarked,
  BookOpen,
  Building2,
  CircleQuestionMark,
  CloudRain,
  Compass,
  Eye,
  FileSearch,
  FingerprintPattern,
  FlaskConical,
  Gavel,
  Ghost,
  HeartHandshake,
  Landmark,
  Leaf,
  Mountain,
  Plane,
  Puzzle,
  Radar,
  Scale,
  Scroll,
  Search,
  Shield,
  Snowflake,
  Sparkles,
  Sun,
  TriangleAlert,
  UserSearch,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { StoryGenre, StoryStatus, WriterApplicationStatus } from "./story-types";

export const genreMeta: Record<
  StoryGenre,
  { label: string; icon: LucideIcon; description: string; gradient: string }
> = {
  "true-crime": {
    label: "True Crime",
    icon: FingerprintPattern,
    description: "Real crimes, real records, and the people they never leave behind.",
    gradient: "from-rose-700/80 to-red-950/80",
  },
  "unsolved-cases": {
    label: "Unsolved Cases",
    icon: CircleQuestionMark,
    description: "Open files, missing pieces, and questions that still have no answer.",
    gradient: "from-amber-600/80 to-orange-800/80",
  },
  "missing-persons": {
    label: "Missing Persons",
    icon: UserSearch,
    description: "Disappearances, last sightings, and the search that never quite ends.",
    gradient: "from-sky-600/80 to-blue-900/80",
  },
  "cold-cases": {
    label: "Cold Cases",
    icon: Snowflake,
    description: "Years later, new light on files that were supposed to stay closed.",
    gradient: "from-slate-600/80 to-zinc-900/80",
  },
  "court-cases": {
    label: "Court Cases",
    icon: Gavel,
    description: "Trials, testimony, and the record the public was never meant to skip.",
    gradient: "from-stone-600/80 to-neutral-800/80",
  },
  "police-investigations": {
    label: "Police & Investigations",
    icon: Shield,
    description: "How a case was worked — interviews, evidence, and what got missed.",
    gradient: "from-blue-700/80 to-indigo-950/80",
  },
  "scary-stories": {
    label: "Scary Stories",
    icon: Ghost,
    description: "Dread in ordinary places after the lights go out.",
    gradient: "from-slate-700/80 to-zinc-950/80",
  },
  unexplained: {
    label: "Unexplained",
    icon: Sparkles,
    description: "Events that still don't fit the official account.",
    gradient: "from-violet-600/80 to-purple-900/80",
  },
  "ufo-uap": {
    label: "UFO & UAP",
    icon: Radar,
    description: "Sightings, reports, and the sky that refuses to stay empty.",
    gradient: "from-indigo-600/80 to-slate-900/80",
  },
  mysteries: {
    label: "Mysteries",
    icon: Search,
    description: "Puzzles with a paper trail — and a few that still won't close.",
    gradient: "from-amber-500/80 to-orange-800/80",
  },
  "historical-mysteries": {
    label: "Historical Mysteries",
    icon: Scroll,
    description: "The past that never quite added up, told from the documents.",
    gradient: "from-yellow-700/80 to-amber-950/80",
  },
  history: {
    label: "History",
    icon: Landmark,
    description: "Lives and turning points, reconstructed from what survived.",
    gradient: "from-yellow-600/80 to-stone-800/80",
  },
  "ancient-mysteries": {
    label: "Ancient Mysteries",
    icon: Landmark,
    description: "Civilizations, ruins, and questions older than the records.",
    gradient: "from-amber-800/80 to-yellow-950/80",
  },
  "legends-folklore": {
    label: "Legends & Folklore",
    icon: BookMarked,
    description: "Stories a culture kept telling until they felt like fact.",
    gradient: "from-orange-700/80 to-red-950/80",
  },
  "strange-cases": {
    label: "Strange Cases",
    icon: Puzzle,
    description: "The ones that don't belong in any other drawer.",
    gradient: "from-fuchsia-700/80 to-purple-950/80",
  },
  "witness-stories": {
    label: "Witness Stories",
    icon: Eye,
    description: "First-hand accounts, told by the people who were there.",
    gradient: "from-amber-700/80 to-orange-950/80",
  },
  "untold-stories": {
    label: "Untold Stories",
    icon: BookOpen,
    description: "What never made the headline, reconstructed anyway.",
    gradient: "from-yellow-700/80 to-amber-950/80",
  },
  "forgotten-stories": {
    label: "Forgotten Stories",
    icon: Archive,
    description: "Names, places, and cases the archive almost buried.",
    gradient: "from-neutral-600/80 to-stone-900/80",
  },
  "disasters-accidents": {
    label: "Disasters & Accidents",
    icon: TriangleAlert,
    description: "When systems fail, and the cost is counted in people.",
    gradient: "from-orange-600/80 to-red-900/80",
  },
  aviation: {
    label: "Aviation",
    icon: Plane,
    description: "Flights, investigations, and what happened after takeoff.",
    gradient: "from-sky-500/80 to-blue-800/80",
  },
  maritime: {
    label: "Maritime",
    icon: Anchor,
    description: "Ships, crews, and the water that keeps its own records.",
    gradient: "from-blue-800/80 to-indigo-950/80",
  },
  survival: {
    label: "Survival",
    icon: Mountain,
    description: "Against weather, wreckage, and the clock running out.",
    gradient: "from-orange-700/80 to-stone-900/80",
  },
  "human-stories": {
    label: "Human Stories",
    icon: Users,
    description: "People, choices, and the lives that don't fit a crime file.",
    gradient: "from-rose-500/80 to-pink-800/80",
  },
  "survivor-stories": {
    label: "Survivor Stories",
    icon: HeartHandshake,
    description: "Told by the people who made it through — and what came after.",
    gradient: "from-pink-600/80 to-rose-900/80",
  },
  tragedies: {
    label: "Tragedies",
    icon: CloudRain,
    description: "Loss that demands a careful telling, not a spectacle.",
    gradient: "from-slate-600/80 to-zinc-900/80",
  },
  "scams-frauds": {
    label: "Scams & Frauds",
    icon: Ban,
    description: "The pitch, the paper trail, and who paid for the lie.",
    gradient: "from-red-600/80 to-rose-950/80",
  },
  "corporate-stories": {
    label: "Corporate Stories",
    icon: Building2,
    description: "Companies, cover-ups, and decisions made behind the logo.",
    gradient: "from-zinc-600/80 to-neutral-900/80",
  },
  "science-mysteries": {
    label: "Science Mysteries",
    icon: FlaskConical,
    description: "Experiments, anomalies, and claims that outran the evidence.",
    gradient: "from-orange-600/80 to-red-900/80",
  },
  "ocean-mysteries": {
    label: "Ocean Mysteries",
    icon: Waves,
    description: "What the deep keeps — wrecks, disappearances, and the unmapped.",
    gradient: "from-amber-700/80 to-orange-950/80",
  },
  "lost-places-discoveries": {
    label: "Lost Places & Discoveries",
    icon: Compass,
    description: "Abandoned rooms, buried maps, and what turned up later.",
    gradient: "from-orange-600/80 to-amber-950/80",
  },
  "remarkable-people": {
    label: "Remarkable People",
    icon: Award,
    description: "Lives that bent the record around them.",
    gradient: "from-amber-500/80 to-yellow-800/80",
  },
  "inspiring-stories": {
    label: "Inspiring Stories",
    icon: Sun,
    description: "Courage, repair, and the work of coming back.",
    gradient: "from-yellow-500/80 to-orange-700/80",
  },
  investigations: {
    label: "Investigations",
    icon: FileSearch,
    description: "Follow the evidence — sources, claims, and what holds.",
    gradient: "from-indigo-600/80 to-blue-950/80",
  },
  "justice-convictions": {
    label: "Justice & Convictions",
    icon: Scale,
    description: "Verdicts, appeals, and whether the outcome matched the facts.",
    gradient: "from-orange-800/80 to-slate-900/80",
  },
  "teabarks-originals": {
    label: "TeaBarks Originals",
    icon: Leaf,
    description: "Stories commissioned and told here first.",
    gradient: "from-amber-600/80 to-orange-950/80",
  },
};

export function isStoryGenre(slug: string): slug is StoryGenre {
  return slug in genreMeta;
}

export function getGenreMeta(slug: string) {
  return isStoryGenre(slug)
    ? genreMeta[slug]
    : genreMeta.mysteries;
}

export const storyStatusMeta: Record<
  StoryStatus,
  { label: string; badgeClass: string }
> = {
  ongoing: {
    label: "Ongoing",
    badgeClass: "bg-verified/15 text-verified border-verified/30",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-agree/15 text-agree border-agree/30",
  },
  "on-hiatus": {
    label: "On Hiatus",
    badgeClass:
      "bg-mixed/20 text-mixed-foreground border-mixed/40 dark:text-mixed",
  },
};

export const writerApplicationStatusMeta: Record<
  WriterApplicationStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  "in-review": {
    label: "In Review",
    badgeClass:
      "bg-mixed/20 text-mixed-foreground border-mixed/40 dark:text-mixed",
  },
  approved: {
    label: "Approved",
    badgeClass: "bg-agree/15 text-agree border-agree/30",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-disagree/15 text-disagree border-disagree/30",
  },
};
