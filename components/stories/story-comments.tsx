"use client";

import * as React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ThumbsUp } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { CitedText } from "@/components/cited-text";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

type Comment = {
  _id: Id<"storyComments">;
  parentId?: Id<"storyComments">;
  chapterNumber?: number;
  body: string;
  authorClerkId: string;
  authorName: string;
  createdAt: number;
};

function CommentItem({
  comment,
  isChild,
  onReply,
}: {
  comment: Comment;
  isChild?: boolean;
  onReply: (id: Id<"storyComments">, name: string) => void;
}) {
  return (
    <div className={cn(isChild && "ml-5 border-l-2 border-border pl-5 sm:ml-6")}>
      <div className="flex gap-3">
        <PersonAvatar
          id={comment.authorClerkId}
          name={comment.authorName}
          className="size-8 shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm">
            <span className="font-medium">{comment.authorName}</span>{" "}
            <span className="text-xs text-muted-foreground">
              · {timeAgo(new Date(comment.createdAt).toISOString())}
              {comment.chapterNumber !== undefined &&
                ` · on part ${comment.chapterNumber}`}
            </span>
          </p>
          <p className="text-sm leading-relaxed text-foreground/90">
            <CitedText text={comment.body} />
          </p>
          <div className="flex items-center gap-1 pt-0.5">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
              <ThumbsUp className="size-3.5" aria-hidden />0
            </Button>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoryComments({
  slug,
  chapterNumber,
}: {
  slug: string;
  chapterNumber?: number;
}) {
  const { user, isSignedIn, isLoaded } = useUser();
  const comments =
    useQuery(api.storySocial.listComments, {
      slug,
      ...(chapterNumber !== undefined ? { chapterNumber } : {}),
    }) ?? [];
  const addComment = useMutation(api.storySocial.addComment);
  const [body, setBody] = React.useState("");
  const [parentId, setParentId] = React.useState<Id<"storyComments"> | null>(
    null
  );
  const [parentName, setParentName] = React.useState<string | null>(null);
  const [posting, setPosting] = React.useState(false);

  const topLevel = comments.filter((c) => !c.parentId);
  const childrenOf = (id: Id<"storyComments">) =>
    comments.filter((c) => c.parentId === id);

  const post = async () => {
    if (!isSignedIn) {
      toast.error("Sign in to comment");
      return;
    }
    if (!body.trim()) {
      toast.error("Write a comment first");
      return;
    }
    setPosting(true);
    try {
      await addComment({
        slug,
        body,
        ...(parentId ? { parentId } : {}),
        ...(chapterNumber !== undefined ? { chapterNumber } : {}),
      });
      setBody("");
      setParentId(null);
      setParentName(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not post comment"
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="gap-0 p-0">
        {isLoaded && !isSignedIn ? (
          <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Sign in to leave a comment.
            </p>
            <SignInButton mode="modal">
              <Button size="sm">Sign in</Button>
            </SignInButton>
          </div>
        ) : (
          <div className="flex gap-3 p-4">
            <PersonAvatar
              id={user?.id ?? "guest"}
              name={user?.fullName ?? user?.username ?? "You"}
              imageUrl={user?.imageUrl}
              className="size-8"
            />
            <div className="flex-1 space-y-2">
              {parentName && (
                <p className="text-xs text-muted-foreground">
                  Replying to {parentName}{" "}
                  <button
                    type="button"
                    className="underline underline-offset-2"
                    onClick={() => {
                      setParentId(null);
                      setParentName(null);
                    }}
                  >
                    Cancel
                  </button>
                </p>
              )}
              <Textarea
                placeholder="Share what this story did to you (no spoilers without warning)…"
                aria-label="Write a comment"
                className="min-h-16 resize-y"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => void post()}
                  disabled={posting}
                >
                  {posting ? "Posting…" : "Post comment"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
      {topLevel.map((c) => (
        <div key={c._id} className="space-y-3">
          <CommentItem
            comment={c}
            onReply={(id, name) => {
              setParentId(id);
              setParentName(name);
            }}
          />
          {childrenOf(c._id).map((child) => (
            <CommentItem
              key={child._id}
              comment={child}
              isChild
              onReply={() => undefined}
            />
          ))}
        </div>
      ))}
      {comments.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No comments yet — be the first reader to leave one.
        </p>
      )}
    </div>
  );
}
