import { clerkMiddleware } from "@clerk/nextjs/server";

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

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/webhooks")) return;
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
