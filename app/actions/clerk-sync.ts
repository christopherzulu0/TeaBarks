"use server";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function listClerkSync() {
  return await fetchQuery(api.clerk.listSynced, {});
}
