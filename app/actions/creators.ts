"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
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

async function convexToken() {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("Sign in to apply as a creator");
  const token = await getToken({ template: "convex" });
  if (!token) {
    throw new Error(
      "Missing Convex JWT. Create a Clerk JWT template named convex."
    );
  }
  return token;
}

export async function applyAsCreator(
  input: ApplyAsCreatorInput
): Promise<{ applicationCode: string }> {
  const token = await convexToken();
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
    const token = await convexToken();
    const doc = await fetchQuery(api.creators.getMine, {}, { token });
    return doc ? toUiCreator(doc) : null;
  } catch {
    return null;
  }
}
