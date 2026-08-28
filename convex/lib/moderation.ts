import type { Infer } from "convex/values";
import type { MutationCtx } from "../_generated/server";
import { moderationEventKind } from "./validators";

type ModerationEventKind = Infer<typeof moderationEventKind>;

export async function recordModerationEvent(
  ctx: MutationCtx,
  args: {
    kind: ModerationEventKind;
    actorClerkId: string;
    actorName: string;
    targetLabel: string;
    note: string;
  }
) {
  await ctx.db.insert("moderationEvents", {
    kind: args.kind,
    actorClerkId: args.actorClerkId,
    actorName: args.actorName,
    targetLabel: args.targetLabel,
    note: args.note,
    createdAt: Date.now(),
  });
}
