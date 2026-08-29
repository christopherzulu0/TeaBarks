export const readingTextSizes = ["sm", "md", "lg"] as const;

export type ReadingTextSize = (typeof readingTextSizes)[number];

export const readingTextSizeLabels: Record<ReadingTextSize, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

export const readingTextSizeClass: Record<ReadingTextSize, string> = {
  sm: "text-[0.95rem] leading-[1.75]",
  md: "text-[1.0625rem] leading-[1.85]",
  lg: "text-[1.1875rem] leading-[1.9]",
};

export const defaultReadingTextSize: ReadingTextSize = "md";

export function isReadingTextSize(value: string): value is ReadingTextSize {
  return (readingTextSizes as readonly string[]).includes(value);
}
