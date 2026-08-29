"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getConvexClerkToken } from "@/lib/convex-clerk";
import {
  channelUrlFromSource,
  resolveExternalIdentity,
} from "@/lib/creators/external-identity";
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

async function findUnclaimedUpgradeId(
  officialLinks: { url: string }[],
  platforms: SourcePlatform[]
): Promise<Id<"creators"> | undefined> {
  for (const link of officialLinks) {
    for (const platform of platforms) {
      const identity = resolveExternalIdentity({
        url: link.url,
        platform,
      });
      if (!identity) continue;
      const doc = await fetchQuery(api.creators.getByExternalIdentity, {
        platform: identity.platform,
        externalHandle: identity.externalHandle,
      });
      if (doc && doc.status === "unclaimed") {
        return doc._id;
      }
    }
  }
  return undefined;
}

export async function applyAsCreator(
  input: ApplyAsCreatorInput
): Promise<{ applicationCode: string }> {
  const token = await getConvexClerkToken("apply as a creator");
  const upgradeCreatorId = await findUnclaimedUpgradeId(
    input.officialLinks,
    input.platforms
  );
  return await fetchMutation(
    api.creators.apply,
    {
      ...input,
      ...(upgradeCreatorId ? { upgradeCreatorId } : {}),
    },
    { token }
  );
}

export async function listApprovedCreators(): Promise<Creator[]> {
  const docs = await fetchQuery(api.creators.listApproved, {});
  return docs.map(toUiCreator);
}

export async function listPublicCreators(): Promise<Creator[]> {
  const docs = await fetchQuery(api.creators.listPublic, {});
  return docs.map(toUiCreator);
}

export async function getCreatorByHandleAction(
  handle: string
): Promise<Creator | null> {
  const doc = await fetchQuery(api.creators.getByHandle, { handle });
  return doc ? toUiCreator(doc) : null;
}

export async function getCreatorByIdAction(
  id: string
): Promise<Creator | null> {
  const doc = await fetchQuery(api.creators.getById, {
    id: id as Id<"creators">,
  });
  return doc ? toUiCreator(doc) : null;
}

export async function getCreatorByExternalIdentityAction(input: {
  platform: SourcePlatform;
  externalHandle: string;
}): Promise<Creator | null> {
  const doc = await fetchQuery(api.creators.getByExternalIdentity, input);
  return doc ? toUiCreator(doc) : null;
}

export async function ensureUnclaimedCreatorAction(input: {
  url: string;
  platform: SourcePlatform;
  authorName?: string;
}): Promise<Creator | null> {
  const identity = resolveExternalIdentity(input);
  if (!identity) return null;

  const token = await getConvexClerkToken("publish a reaction");
  const channelUrl =
    channelUrlFromSource(input.url, identity.platform) ?? undefined;
  const { creatorId } = await fetchMutation(
    api.creators.ensureUnclaimedFromSource,
    {
      platform: identity.platform,
      externalHandle: identity.externalHandle,
      displayName: identity.displayName,
      sourceUrl: input.url,
      channelUrl,
    },
    { token }
  );
  return await getCreatorByIdAction(creatorId);
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
