import { caseCategoryMeta } from "./meta";
import type { CaseCategory, Topic } from "./types";

export const topicSlugs = Object.keys(caseCategoryMeta) as CaseCategory[];

export const topics: Topic[] = topicSlugs.map((slug) => {
  const meta = caseCategoryMeta[slug];
  return {
    slug,
    name: meta.label,
    description: meta.policy,
    barkCount: 0,
    caseCount: 0,
    trending: false,
  };
});

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function isCaseCategory(slug: string): slug is CaseCategory {
  return slug in caseCategoryMeta;
}
