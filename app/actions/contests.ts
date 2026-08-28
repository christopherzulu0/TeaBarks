"use server";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { toUiContest, type UiContest } from "@/lib/contests/query";

export async function listActiveContests(): Promise<UiContest[]> {
  const docs = await fetchQuery(api.contests.listActive, {});
  return docs.map(toUiContest);
}

export async function listClosedContests(): Promise<UiContest[]> {
  const docs = await fetchQuery(api.contests.listClosed, {});
  return docs.map(toUiContest);
}
