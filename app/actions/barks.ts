"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toUiBark } from "@/lib/barks/query";
import { toUiSource } from "@/lib/sources/query";
import type { Bark, BarkType, EvidenceType, Source, SourcePlatform } from "@/lib/types";

export type PublishBarkInput = {
  type: BarkType;
  title: string;
  body: string;
  status: "public" | "draft";
  sourceUrl: string;
  sourceTitle: string;
  sourcePlatform: SourcePlatform;
  sourceCreatorName: string;
  sourceThumbnailUrl?: string;
  evidence: {
    type: EvidenceType;
    title: string;
    url: string;
    storageId?: string;
    fileName?: string;
    contentType?: string;
  }[];
};

async function convexToken() {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("Sign in to publish");
  const token = await getToken({ template: "convex" });
  if (!token) {
    throw new Error(
      "Missing Convex JWT. Create a Clerk JWT template named convex."
    );
  }
  return token;
}

export async function publishBark(input: PublishBarkInput): Promise<{ code: string }> {
  const token = await convexToken();
  return await fetchMutation(
    api.barks.create,
    {
      ...input,
      evidence: input.evidence.map((item) => ({
        type: item.type,
        title: item.title,
        url: item.url,
        storageId: item.storageId
          ? (item.storageId as Id<"_storage">)
          : undefined,
        fileName: item.fileName,
        contentType: item.contentType,
      })),
    },
    { token }
  );
}

export async function listPublicBarks(): Promise<Bark[]> {
  const docs = await fetchQuery(api.barks.listPublic, {});
  return docs.map(toUiBark);
}

export async function listPublicBarksByCountry(country: string): Promise<Bark[]> {
  const docs = await fetchQuery(api.barks.listPublicByCountry, { country });
  return docs.map(toUiBark);
}

export type CountryStat = {
  code: string;
  barkCount: number;
  activeDiscussions: number;
};

export async function listCountryStats(): Promise<CountryStat[]> {
  return await fetchQuery(api.barks.countryStats, {});
}

export async function listPublicSources(): Promise<Source[]> {
  const docs = await fetchQuery(api.barks.listPublicSources, {});
  return docs.map(toUiSource);
}

export async function getBarkByCodeAction(code: string): Promise<Bark | null> {
  const doc = await fetchQuery(api.barks.getByCode, { code });
  return doc ? toUiBark(doc) : null;
}

export async function listMyBarks(): Promise<Bark[]> {
  try {
    const token = await convexToken();
    const docs = await fetchQuery(api.barks.listMine, {}, { token });
    return docs.map(toUiBark);
  } catch {
    return [];
  }
}
