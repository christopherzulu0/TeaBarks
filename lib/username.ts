export const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

export function normalizeUsername(raw: string): string {
  return raw.trim().replace(/^@/, "").toLowerCase();
}

export function usernameError(raw: string): string | null {
  const value = normalizeUsername(raw);
  if (!value) return "Username is required";
  if (!USERNAME_PATTERN.test(value)) {
    return "Use 3–30 letters, numbers, or underscores.";
  }
  return null;
}
