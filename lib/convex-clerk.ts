import { auth } from "@clerk/nextjs/server";

type ClerkApiError = {
  clerkError?: boolean;
  errors?: Array<{ code?: string; message?: string; longMessage?: string }>;
};

export async function getConvexClerkToken(action = "continue") {
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new Error(`Sign in to ${action}.`);
  }

  try {
    const token = await getToken({ template: "convex" });
    if (!token) {
      throw new Error(
        'Missing Convex JWT. In the Clerk dashboard, create a JWT template named "convex".'
      );
    }
    return token;
  } catch (error) {
    const clerkError = error as ClerkApiError;
    if (clerkError.clerkError) {
      const detail =
        clerkError.errors?.[0]?.longMessage ??
        clerkError.errors?.[0]?.message ??
        "Clerk auth configuration error.";
      if (detail.toLowerCase().includes("jwt template")) {
        throw new Error(
          'Production auth is not configured: create a Clerk JWT template named "convex", then set CLERK_JWT_ISSUER_DOMAIN on your Convex deployment.'
        );
      }
      throw new Error(detail);
    }
    throw error;
  }
}
