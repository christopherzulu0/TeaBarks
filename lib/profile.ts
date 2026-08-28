export function profilePath(slug: string) {
  return `/profile/${encodeURIComponent(slug)}`;
}

export function profileSlug(user: { username?: string | null; id: string }) {
  return user.username || user.id;
}
