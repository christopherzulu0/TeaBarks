import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { clerkUserId, requireIdentity } from "./lib/auth";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireIdentity(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const registerUpload = mutation({
  args: { storageId: v.id("_storage") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const existing = await ctx.db
      .query("evidenceUploads")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .unique();
    if (existing) return null;
    await ctx.db.insert("evidenceUploads", {
      storageId: args.storageId,
      uploaderClerkId: clerkUserId(identity),
      createdAt: Date.now(),
      bound: false,
    });
    return null;
  },
});

export const deleteUpload = mutation({
  args: { storageId: v.id("_storage") },
  returns: v.object({ deleted: v.boolean() }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const upload = await ctx.db
      .query("evidenceUploads")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .unique();
    if (!upload) return { deleted: false };
    if (upload.uploaderClerkId !== clerkUserId(identity)) {
      throw new Error("Forbidden");
    }
    if (upload.bound) return { deleted: false };
    await ctx.storage.delete(args.storageId);
    await ctx.db.delete(upload._id);
    return { deleted: true };
  },
});
