"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getConvexClerkToken } from "@/lib/convex-clerk";
import { toUiCreator } from "@/lib/creators/query";
import type { Creator, SourcePlatform } from "@/lib/types";

export type ApplyAsCreatorInput = {
  name: string;
  bio: string;
  country: string;
  category: string;
  platforms: SourcePlatform[];
  officialLinks: { label: string; url: string }[];
  verificationMethod: "connect" | "code";
};

export async function applyAsCreator(
  input: ApplyAsCreatorInput
): Promise<{ applicationCode: string }> {
  const token = await getConvexClerkToken("apply as a creator");
  return await fetchMutation(api.creators.apply, input, { token });
}

export async function listApprovedCreators(): Promise<Creator[]> {
  const docs = await fetchQuery(api.creators.listApproved, {});
  return docs.map(toUiCreator);
}

export async function getCreatorByHandleAction(
  handle: string
): Promise<Creator | null> {
  const doc = await fetchQuery(api.creators.getByHandle, { handle });
  return doc ? toUiCreator(doc) : null;
}

export async function getMyCreatorAction(): Promise<Creator | null> {
  try {
    const token = await getConvexClerkToken("view your creator profile");
    const doc = await fetchQuery(api.creators.getMine, {}, { token });
    return doc ? toUiCreator(doc) : null;
  } catch {
    return null;
  }
}
