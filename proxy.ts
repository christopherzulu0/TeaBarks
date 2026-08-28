import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminPath = createRouteMatcher(["/admin(.*)"]);

function isProtectedPath(pathname: string) {
  if (pathname === "/profile") return true;
  return (
    pathname === "/create" ||
    pathname.startsWith("/create/") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/org") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/stories/dashboard") ||
    pathname.startsWith("/stories/write")
  );
}

function isClerkAdmin(authData: {
  userId: string | null;
  orgRole?: string | null;
  sessionClaims?: unknown;
  has?: (params: { role: string } | { permission: string }) => boolean;
}): boolean {
  if (!authData.userId) return false;

  const adminIds = (process.env.ADMIN_CLERK_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (adminIds.includes(authData.userId)) return true;

  if (
    authData.has?.({ role: "org:admin" }) ||
    authData.has?.({ role: "admin" })
  ) {
    return true;
  }

  if (authData.orgRole === "org:admin" || authData.orgRole === "admin") {
    return true;
  }

  const claims = authData.sessionClaims as Record<string, unknown> | undefined;
  if (claims) {
    if (claims.role === "admin" || claims.role === "org:admin") return true;
    if (claims.org_role === "org:admin" || claims.org_role === "admin") return true;
    const metadata =
      (claims.metadata as Record<string, unknown> | undefined)?.role ??
      (claims.public_metadata as Record<string, unknown> | undefined)?.role ??
      (claims.publicMetadata as Record<string, unknown> | undefined)?.role;
    if (metadata === "admin" || metadata === "org:admin") return true;
  }

  return false;
}

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/webhooks")) return;

  if (isAdminPath(req)) {
    const authData = await auth();
    if (!authData.isAuthenticated) {
      return authData.redirectToSignIn({ returnBackUrl: req.url });
    }
    if (!isClerkAdmin(authData)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return;
  }

  if (!isProtectedPath(pathname)) return;

  const { isAuthenticated, redirectToSignIn } = await auth();
  if (!isAuthenticated) return redirectToSignIn();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
