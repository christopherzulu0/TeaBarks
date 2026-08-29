"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toUiCreatorReview } from "@/lib/creator-reviews/query";
import { toUiCreator } from "@/lib/creators/query";
import { getConvexClerkToken } from "@/lib/convex-clerk";
import type { BarkType, CreatorReview, EvidenceType } from "@/lib/types";

export type PublishCreatorReviewInput = {
  creatorId: string;
  type: BarkType;
  title: string;
  body: string;
  status: "public" | "draft";
  evidence: {
    type: EvidenceType;
    title: string;
    url: string;
    storageId?: string;
    fileName?: string;
    contentType?: string;
  }[];
};

export async function publishCreatorReview(
  input: PublishCreatorReviewInput
): Promise<{ code: string }> {
  const token = await getConvexClerkToken("publish a review");
  return await fetchMutation(
    api.creatorReviews.create,
    {
      creatorId: input.creatorId as Id<"creators">,
      type: input.type,
      title: input.title,
      body: input.body,
      status: input.status,
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

export async function listPublicCreatorReviews(): Promise<CreatorReview[]> {
  try {
    const docs = await fetchQuery(api.creatorReviews.listPublic, {});
    const creators = await fetchQuery(api.creators.listApproved, {});
    const creatorById = new Map(
      creators.map((c) => [c._id, toUiCreator(c)])
    );
    return docs.map((doc) =>
      toUiCreatorReview(
        doc,
        creatorById.get(doc.creatorId)
          ? {
              name: creatorById.get(doc.creatorId)!.name,
              handle: creatorById.get(doc.creatorId)!.handle,
            }
          : undefined
      )
    );
  } catch (error) {
    console.error("Failed to list public creator reviews:", error);
    return [];
  }
}

export async function listCreatorReviewsByCreator(
  creatorId: string
): Promise<CreatorReview[]> {
  try {
    const docs = await fetchQuery(api.creatorReviews.listByCreator, {
      creatorId: creatorId as Id<"creators">,
    });
    const creator = await fetchQuery(api.creators.getById, {
      id: creatorId as Id<"creators">,
    });
    const meta = creator
      ? { name: creator.name, handle: creator.handle }
      : undefined;
    return docs.map((doc) => toUiCreatorReview(doc, meta));
  } catch (error) {
    console.error("Failed to list creator reviews:", error);
    return [];
  }
}

export async function getCreatorReviewByCode(
  code: string
): Promise<CreatorReview | null> {
  try {
    const doc = await fetchQuery(api.creatorReviews.getByCode, { code });
    if (!doc) return null;
    const creator = await fetchQuery(api.creators.getById, {
      id: doc.creatorId,
    });
    return toUiCreatorReview(
      doc,
      creator ? { name: creator.name, handle: creator.handle } : undefined
    );
  } catch (error) {
    console.error("Failed to fetch creator review:", error);
    return null;
  }
}
