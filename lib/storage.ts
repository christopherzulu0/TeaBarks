/** Tiny typed localStorage helpers for the mock frontend. */

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode / quota — ignore
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function scopedKey(userId: string, key: string): string {
  return `teabarks.${userId}.${key}`;
}

export function readUserJson<T>(
  userId: string | undefined | null,
  key: string,
  fallback: T
): T {
  if (!userId) return fallback;
  return readJson(scopedKey(userId, key), fallback);
}

export function writeUserJson<T>(
  userId: string | undefined | null,
  key: string,
  value: T
): boolean {
  if (!userId) return false;
  writeJson(scopedKey(userId, key), value);
  return true;
}

export function removeUserKey(
  userId: string | undefined | null,
  key: string
): void {
  if (!userId) return;
  removeKey(scopedKey(userId, key));
}

export const STORAGE_KEYS = {
  barkDraft: "bark-draft",
  locale: "teabarks.locale",
  savedBarks: "saved-barks",
  following: "following",
  storyVotes: "story-votes",
  storyDraft: (slug: string) => `story-draft.${slug}`,
  reading: (slug: string) => `reading.${slug}`,
} as const;
