export type StoryGenre =
  | "true-crime"
  | "unsolved-cases"
  | "missing-persons"
  | "cold-cases"
  | "court-cases"
  | "police-investigations"
  | "scary-stories"
  | "unexplained"
  | "ufo-uap"
  | "mysteries"
  | "historical-mysteries"
  | "history"
  | "ancient-mysteries"
  | "legends-folklore"
  | "strange-cases"
  | "witness-stories"
  | "untold-stories"
  | "forgotten-stories"
  | "disasters-accidents"
  | "aviation"
  | "maritime"
  | "survival"
  | "human-stories"
  | "survivor-stories"
  | "tragedies"
  | "scams-frauds"
  | "corporate-stories"
  | "science-mysteries"
  | "ocean-mysteries"
  | "lost-places-discoveries"
  | "remarkable-people"
  | "inspiring-stories"
  | "investigations"
  | "justice-convictions"
  | "teabarks-originals";

export type StoryStatus = "ongoing" | "completed" | "on-hiatus";

export type WriterApplicationStatus =
  | "pending"
  | "in-review"
  | "approved"
  | "rejected";

export interface StoryAuthor {
  id: string;
  handle: string;
  name: string;
  bio: string;
  followers: number;
  isWriter: boolean;
  writerSince: string;
  storiesPublished: number;
}

export interface Chapter {
  number: number;
  title: string;
  wordCount: number;
  readingMinutes: number;
  reads: number;
  votes: number;
  publishedAt: string;
  paragraphs: string[];
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  genre: StoryGenre;
  tags: string[];
  status: StoryStatus;
  mature: boolean;
  authorId: string;
  reads: number;
  votes: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  /** Optional override; otherwise resolved via lib/story-covers.ts */
  coverImage?: string;
  chapters: Chapter[];
}

export interface StoryComment {
  id: string;
  storyId: string;
  /** Chapter number the comment is anchored to; undefined = story-level */
  chapter?: number;
  authorId: string;
  authorName: string;
  content: string;
  postedAt: string;
  likes: number;
  parentId?: string;
}

export interface ReadingProgress {
  storyId: string;
  chapter: number;
  /** 0-100 percent through the story */
  percent: number;
  lastReadAt: string;
}

export interface ReadingList {
  id: string;
  name: string;
  description: string;
  storyIds: string[];
}

export interface Contest {
  id: string;
  slug: string;
  name: string;
  theme: string;
  prize: string;
  deadline: string;
  entries: number;
  status: "active" | "closed";
  description: string;
  winnerStoryId?: string;
}

export interface WriterApplication {
  id: string;
  penName: string;
  genres: StoryGenre[];
  sampleTitle: string;
  status: WriterApplicationStatus;
  submittedAt: string;
}
