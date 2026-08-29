"use server";

import { unstable_noStore as noStore } from "next/cache";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toUiBark } from "@/lib/barks/query";
import { getConvexClerkToken } from "@/lib/convex-clerk";
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

export async function publishBark(input: PublishBarkInput): Promise<{ code: string }> {
  const token = await getConvexClerkToken("publish a bark");
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
  try {
    const docs = await fetchQuery(api.barks.listPublic, {});
    return docs.map(toUiBark);
  } catch (error) {
    console.error("Failed to list public barks:", error);
    return [];
  }
}

export async function listPublicBarksByCountry(country: string): Promise<Bark[]> {
  try {
    const docs = await fetchQuery(api.barks.listPublicByCountry, { country });
    return docs.map(toUiBark);
  } catch (error) {
    console.error("Failed to list public barks by country:", error);
    return [];
  }
}

export type CountryStat = {
  code: string;
  barkCount: number;
  activeDiscussions: number;
};

export async function listCountryStats(): Promise<CountryStat[]> {
  try {
    return await fetchQuery(api.barks.countryStats, {});
  } catch (error) {
    console.error("Failed to list country stats:", error);
    return [];
  }
}

export async function listPublicSources(): Promise<Source[]> {
  try {
    const docs = await fetchQuery(api.barks.listPublicSources, {});
    return docs.map(toUiSource);
  } catch (error) {
    console.error("Failed to list public sources:", error);
    return [];
  }
}

export async function getBarkByCodeAction(code: string): Promise<Bark | null> {
  noStore();
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  try {
    const doc = await fetchQuery(api.barks.getByCode, { code: normalized });
    return doc ? toUiBark(doc) : null;
  } catch (error) {
    console.error("Failed to get bark by code:", error);
    return null;
  }
}

export async function listMyBarks(): Promise<Bark[]> {
  try {
    const token = await getConvexClerkToken("view your barks");
    const docs = await fetchQuery(api.barks.listMine, {}, { token });
    return docs.map(toUiBark);
  } catch {
    return [];
  }
}
