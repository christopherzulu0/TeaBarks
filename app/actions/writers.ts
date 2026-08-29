"use server";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getConvexClerkToken } from "@/lib/convex-clerk";
import { toUiWriter, type WriterProfile } from "@/lib/writers/query";

export async function getMyWriterAction(): Promise<WriterProfile | null> {
  try {
    const token = await getConvexClerkToken("view your writer profile");
    const doc = await fetchQuery(api.writers.getMine, {}, { token });
    return doc ? toUiWriter(doc) : null;
  } catch {
    return null;
  }
}
