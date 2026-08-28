"use client";

import * as React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PersonAvatar } from "@/components/person-avatar";
import { ReportButton } from "@/components/report-dialog";
import { EmojiPicker } from "@/components/comments/emoji-picker";
import {
  MentionField,
  type MentionFieldHandle,
} from "@/components/comments/mention-field";
import { MentionText } from "@/components/comments/mention-text";
import { StickerPicker } from "@/components/comments/sticker-picker";
import {
  VoiceNoteRecorder,
  formatVoiceDuration,
  type VoiceDraft,
} from "@/components/comments/voice-note";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { barkKeys } from "@/lib/barks/query";
import {
  BarkSticker,
  isBarkStickerId,
  type BarkStickerId,
} from "@/lib/barks/stickers";
import { formatDate } from "@/lib/format";
import { slugifyMentionHandle } from "@/lib/mentions/handle";
import { cn } from "@/lib/utils";

type Comment = {
  _id: Id<"barkComments">;
  parentId?: Id<"barkComments">;
  body: string;
  authorClerkId: string;
  authorName: string;
  authorImageUrl?: string;
  stickerId?: BarkStickerId;
  voiceUrl: string | null;
  voiceDurationMs?: number;
  createdAt: number;
};

function ReplyComposer({
  nested,
  userId,
  userName,
  userImageUrl,
  parentName,
  onCancel,
  mentionRef,
  barkCode,
  body,
  onBodyChange,
  stickerId,
  onStickerChange,
  voiceDraft,
  onVoiceDraftChange,
  replyCountLabel,
  posting,
  onPost,
}: {
  nested?: boolean;
  userId: string;
  userName: string;
  userImageUrl?: string;
  parentName: string | null;
  onCancel: () => void;
  mentionRef: React.RefObject<MentionFieldHandle | null>;
  barkCode: string;
  body: string;
  onBodyChange: (next: string) => void;
  stickerId: BarkStickerId | null;
  onStickerChange: (id: BarkStickerId | null) => void;
  voiceDraft: VoiceDraft | null;
  onVoiceDraftChange: (draft: VoiceDraft | null) => void;
  replyCountLabel: string;
  posting: boolean;
  onPost: () => void;
}) {
  return (
    <div
      className={cn(
        "relative",
        nested && "ml-5 border-l-2 border-border pl-5 sm:ml-6"
      )}
    >
      <Card className="gap-0 p-0">
        <div className="flex gap-3 p-4">
          <PersonAvatar
            id={userId}
            name={userName}
            imageUrl={userImageUrl}
            className="size-8"
          />
          <div className="flex-1 space-y-2">
            {parentName && (
              <p className="text-xs text-muted-foreground">
                Replying to {parentName}{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </p>
            )}
            <MentionField
              ref={mentionRef}
              barkCode={barkCode}
              value={body}
              onChange={onBodyChange}
              placeholder="Add to the reply chain — type @ to mention someone"
            />
            <div className="flex flex-wrap items-center gap-1">
              <EmojiPicker
                onPick={(emoji) => mentionRef.current?.insertAtCaret(emoji)}
              />
              <StickerPicker value={stickerId} onPick={onStickerChange} />
              <VoiceNoteRecorder
                draft={voiceDraft}
                onDraftChange={onVoiceDraftChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{replyCountLabel}</p>
              <Button size="sm" onClick={onPost} disabled={posting}>
                {posting ? "Posting…" : "Post reply"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CommentItem({
  comment,
  code,
  isChild,
  onReply,
}: {
  comment: Comment;
  code: string;
  isChild?: boolean;
  onReply: (id: Id<"barkComments">, name: string) => void;
}) {
  const sticker =
    comment.stickerId && isBarkStickerId(comment.stickerId)
      ? comment.stickerId
      : null;
  return (
    <div
      className={cn(
        "relative",
        isChild && "ml-5 border-l-2 border-border pl-5 sm:ml-6"
      )}
    >
      <Card className="gap-0 p-0">
        <div className="space-y-2.5 p-4">
          <div className="flex items-center gap-2 text-sm">
            <PersonAvatar
              id={comment.authorClerkId}
              name={comment.authorName}
              imageUrl={comment.authorImageUrl}
              className="size-7"
            />
            <span className="font-medium">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(new Date(comment.createdAt).toISOString())}
            </span>
          </div>
          {sticker ? <BarkSticker id={sticker} className="size-16" /> : null}
          {comment.body.trim() ? (
            <p className="text-sm leading-relaxed text-foreground/90">
              <MentionText text={comment.body} />
            </p>
          ) : null}
          {comment.voiceUrl ? (
            <div className="flex flex-wrap items-center gap-2">
              <audio
                controls
                src={comment.voiceUrl}
                className="h-8 max-w-full flex-1"
              />
              {comment.voiceDurationMs ? (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {formatVoiceDuration(comment.voiceDurationMs)}
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-center gap-1 pt-1">
            {!isChild && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onReply(comment._id, comment.authorName)}
              >
                Reply
              </Button>
            )}
            <span className="ml-auto">
              <ReportButton
                target={`comment by ${comment.authorName}`}
                barkCode={code}
                targetKind="comment"
                targetId={comment._id}
                iconOnly
              />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function LiveReplyThread({
  code,
  replyCount,
}: {
  code: string;
  replyCount: number;
}) {
  const { user, isSignedIn, isLoaded } = useUser();
  const signedIn = Boolean(isLoaded && isSignedIn);
  const queryClient = useQueryClient();
  const comments =
    useQuery(api.barks.listComments, signedIn ? { code } : "skip") ?? [];
  const addComment = useMutation(api.barks.addComment);
  const generateUploadUrl = useMutation(api.evidenceFiles.generateUploadUrl);
  const mentionRef = React.useRef<MentionFieldHandle>(null);
  const composerRef = React.useRef<HTMLDivElement>(null);
  const [body, setBody] = React.useState("");
  const [stickerId, setStickerId] = React.useState<BarkStickerId | null>(null);
  const [voiceDraft, setVoiceDraft] = React.useState<VoiceDraft | null>(null);
  const [parentId, setParentId] = React.useState<Id<"barkComments"> | null>(
    null
  );
  const [parentName, setParentName] = React.useState<string | null>(null);
  const [posting, setPosting] = React.useState(false);

  const startReply = (id: Id<"barkComments">, name: string) => {
    setParentId(id);
    setParentName(name);
    const handle = slugifyMentionHandle(name);
    setBody((current) =>
      current.includes(`@${handle}`)
        ? current
        : `@${handle} ${current}`.replace(/^\s+/, "")
    );
  };

  const cancelReply = () => {
    setParentId(null);
    setParentName(null);
  };

  React.useEffect(() => {
    if (!parentId) return;
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [parentId]);
  const topLevel = comments.filter((c) => !c.parentId);
  const childrenOf = (id: Id<"barkComments">) =>
    comments.filter((c) => c.parentId === id);

  if (!signedIn) {
    return (
      <Card className="gap-0 p-0">
        <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Sign in to view and join the reply chain.
          </p>
          <SignInButton>
            <Button size="sm">Sign in</Button>
          </SignInButton>
        </div>
      </Card>
    );
  }

  const post = async () => {
    const text = body.trim();
    if (!text && !stickerId && !voiceDraft) {
      toast.error("Write a comment, send a sticker, or record a voice note");
      return;
    }
    setPosting(true);
    try {
      let voiceStorageId: Id<"_storage"> | undefined;
      let voiceDurationMs: number | undefined;
      if (voiceDraft) {
        const postUrl = await generateUploadUrl();
        const uploaded = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": voiceDraft.contentType || "audio/webm",
          },
          body: voiceDraft.blob,
        });
        if (!uploaded.ok) throw new Error("Voice upload failed");
        const payload = (await uploaded.json()) as { storageId?: string };
        if (!payload.storageId) throw new Error("Voice upload failed");
        voiceStorageId = payload.storageId as Id<"_storage">;
        voiceDurationMs = voiceDraft.durationMs;
      }
      await addComment({
        code,
        body,
        ...(parentId ? { parentId } : {}),
        ...(stickerId ? { stickerId } : {}),
        ...(voiceStorageId
          ? { voiceStorageId, voiceDurationMs }
          : {}),
      });
      setBody("");
      setStickerId(null);
      setVoiceDraft(null);
      setParentId(null);
      setParentName(null);
      await queryClient.invalidateQueries({ queryKey: barkKeys.public });
      await queryClient.invalidateQueries({ queryKey: barkKeys.detail(code) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not post");
    } finally {
      setPosting(false);
    }
  };

  const replyCountLabel = `${comments.length || replyCount} ${
    comments.length === 1 ? "reply" : "replies"
  }`;

  const composer = (
    <div ref={composerRef}>
      <ReplyComposer
        nested={Boolean(parentId)}
        userId={user?.id ?? "guest"}
        userName={user?.fullName ?? "You"}
        userImageUrl={user?.imageUrl}
        parentName={parentName}
        onCancel={cancelReply}
        mentionRef={mentionRef}
        barkCode={code}
        body={body}
        onBodyChange={setBody}
        stickerId={stickerId}
        onStickerChange={setStickerId}
        voiceDraft={voiceDraft}
        onVoiceDraftChange={setVoiceDraft}
        replyCountLabel={replyCountLabel}
        posting={posting}
        onPost={() => void post()}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {!parentId ? composer : null}
      {topLevel.map((comment) => (
        <div key={comment._id} className="space-y-3">
          <CommentItem
            comment={comment}
            code={code}
            onReply={startReply}
          />
          {childrenOf(comment._id).map((child) => (
            <CommentItem
              key={child._id}
              comment={child}
              code={code}
              isChild
              onReply={startReply}
            />
          ))}
          {parentId === comment._id ? composer : null}
        </div>
      ))}
    </div>
  );
}
