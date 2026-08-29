"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { toUiCase } from "@/lib/cases/query";
import { getConvexClerkToken } from "@/lib/convex-clerk";
import type {
  AccountabilityCase,
  CaseCategory,
  EvidenceType,
} from "@/lib/types";

export type PublishCaseInput = {
  title: string;
  category: CaseCategory;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorVerified: boolean;
  claims: {
    text: string;
    evidence: { type: EvidenceType; title: string; url: string }[];
  }[];
};

export async function publishCase(
  input: PublishCaseInput
): Promise<{ code: string }> {
  const token = await getConvexClerkToken("open a case");
  return await fetchMutation(api.cases.create, input, { token });
}

export async function listCases(): Promise<AccountabilityCase[]> {
  const docs = await fetchQuery(api.cases.list, {});
  return docs.map(toUiCase);
}

export async function listCasesByCountry(
  country: string
): Promise<AccountabilityCase[]> {
  const docs = await fetchQuery(api.cases.listByCountry, { country });
  return docs.map(toUiCase);
}

export type CaseCategoryStat = {
  slug: string;
  caseCount: number;
};

export async function listCaseCategoryStats(): Promise<CaseCategoryStat[]> {
  return await fetchQuery(api.cases.categoryStats, {});
}

export async function listCasesByCategory(
  category: CaseCategory
): Promise<AccountabilityCase[]> {
  const docs = await fetchQuery(api.cases.listByCategory, { category });
  return docs.map(toUiCase);
}

export async function getCaseByCodeAction(
  code: string
): Promise<AccountabilityCase | null> {
  const doc = await fetchQuery(api.cases.getByCode, { code });
  return doc ? toUiCase(doc) : null;
}

export async function listOpenedByMeCases(): Promise<AccountabilityCase[]> {
  try {
    const token = await getConvexClerkToken("view your cases");
    const docs = await fetchQuery(api.cases.listOpenedByMe, {}, { token });
    return docs.map(toUiCase);
  } catch {
    return [];
  }
}

export async function listCasesAboutCreator(
  creatorId: string
): Promise<AccountabilityCase[]> {
  const docs = await fetchQuery(api.cases.listAboutCreator, { creatorId });
  return docs.map(toUiCase);
}
