"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { toUiWriter, type WriterProfile } from "@/lib/writers/query";

async function convexToken() {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("Sign in to continue");
  const token = await getToken({ template: "convex" });
  if (!token) {
    throw new Error(
      "Missing Convex JWT. Create a Clerk JWT template named convex."
    );
  }
  return token;
}

export async function getMyWriterAction(): Promise<WriterProfile | null> {
  try {
    const token = await convexToken();
    const doc = await fetchQuery(api.writers.getMine, {}, { token });
    return doc ? toUiWriter(doc) : null;
  } catch {
    return null;
  }
}
