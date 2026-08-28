import type { Doc } from "@/convex/_generated/dataModel";
import type {
  AccountabilityCase,
  CaseCategory,
  CaseStatus,
  ClaimStatus,
  Evidence,
  EvidenceType,
  TimelineEvent,
} from "@/lib/types";

export const caseKeys = {
  list: ["cases", "list"] as const,
  detail: (code: string) => ["cases", code] as const,
};

export function toUiCase(doc: Doc<"cases">): AccountabilityCase {
  const evidence: Evidence[] = doc.evidence.map((item) => {
    const isTimestamp = item.type === "timestamp";
    const looksLikeUrl = /^https?:\/\//i.test(item.url);
    return {
      id: item.id,
      type: item.type as EvidenceType,
      title: item.title,
      description: item.title,
      url: !isTimestamp && looksLikeUrl ? item.url : undefined,
      timestamp: isTimestamp ? item.url || undefined : undefined,
      addedById: doc.openedByClerkId,
      addedByName: doc.openedByName,
      addedAt: new Date(doc.openedAt).toISOString(),
      verified: false,
    };
  });

  const timeline: TimelineEvent[] = doc.timeline.map((event) => ({
    id: event.id,
    date: new Date(event.date).toISOString(),
    title: event.title,
    description: event.description,
    type: event.type,
  }));

  return {
    id: doc._id,
    code: doc.code,
    title: doc.title,
    status: doc.status as CaseStatus,
    sourceId: "",
    creatorId: doc.creatorId,
    openedById: doc.openedByClerkId,
    openedAt: new Date(doc.openedAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
    summary: doc.summary,
    claims: doc.claims.map((claim) => ({
      id: claim.id,
      text: claim.text,
      status: claim.status as ClaimStatus,
      evidenceIds: claim.evidenceIds,
    })),
    evidence,
    timeline,
    strengths: doc.strengths,
    weaknesses: doc.weaknesses,
    contradictions: doc.contradictions,
    missingEvidence: doc.missingEvidence,
    communityAnalysis: (doc.communityAnalysis ?? []).map((note) => ({
      authorId: note.authorClerkId,
      authorName: note.authorName,
      text: note.text,
      postedAt: new Date(note.postedAt).toISOString(),
    })),
    creatorResponse: doc.creatorResponse
      ? {
          content: doc.creatorResponse.content,
          respondedAt: new Date(doc.creatorResponse.respondedAt).toISOString(),
          verified: doc.creatorResponse.verified,
        }
      : undefined,
    versions: [],
    followers: doc.followers,
    category: doc.category as CaseCategory,
    creatorName: doc.creatorName,
    creatorHandle: doc.creatorHandle,
    creatorVerified: doc.creatorVerified,
    openedByName: doc.openedByName,
    live: true,
  };
}
