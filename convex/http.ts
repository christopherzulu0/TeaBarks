import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!secret) {
      return new Response("Webhook secret is not configured", { status: 500 });
    }

    const payload = await request.text();
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    let evt: { type?: unknown; data?: unknown };
    try {
      const wh = new Webhook(secret);
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as { type?: unknown; data?: unknown };
    } catch {
      return new Response("Verification failed", { status: 400 });
    }

    if (typeof evt.type !== "string") {
      return new Response("Invalid event", { status: 400 });
    }

    await ctx.runMutation(internal.clerk.ingest, {
      type: evt.type,
      payloadJson: JSON.stringify(evt.data ?? {}),
    });

    return new Response("OK", { status: 200 });
  }),
});

export default http;
