"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { MentionField } from "@/components/comments/mention-field";
import { MentionText } from "@/components/comments/mention-text";
import {
  DraftAttachmentChips,
  PostAttachmentList,
  draftToPayload,
  listedToDraft,
  revokeDraftPreviews,
  useCirclePostAttachments,
  type DraftAttachment,
} from "@/components/circles/post-attachments";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { caseCategoryMeta } from "@/lib/meta";
import { formatDate } from "@/lib/format";
import { useRouter } from "next/navigation";

type PendingConfirm =
  | {
      kind: "transfer";
      memberClerkId: string;
      memberName: string;
    }
  | { kind: "delete" }
  | { kind: "deletePost"; postId: Id<"researchCirclePosts"> };

function extractInviteUsername(raw: string): string {
  const trimmed = raw.trim();
  const lastAt = trimmed.match(/@([a-zA-Z0-9_]{2,32})\s*$/);
  if (lastAt) return lastAt[1];
  return trimmed.replace(/^@/, "").split(/\s+/)[0] ?? "";
}

export function CircleDetail({
  circleId,
}: {
  circleId: Id<"researchCircles">;
}) {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const detail = useQuery(
    api.researchCircles.get,
    isSignedIn ? { circleId } : "skip"
  );
  const posts = useQuery(
    api.researchCircles.listPosts,
    isSignedIn ? { circleId } : "skip"
  );
  const pendingInvites = useQuery(
    api.researchCircles.listCirclePendingInvites,
    isSignedIn ? { circleId } : "skip"
  );
  const invite = useMutation(api.researchCircles.inviteByUsername);
  const cancelInvite = useMutation(api.researchCircles.cancelInvite);
  const addPost = useMutation(api.researchCircles.addPost);
  const updatePost = useMutation(api.researchCircles.updatePost);
  const deletePost = useMutation(api.researchCircles.deletePost);
  const leave = useMutation(api.researchCircles.leave);
  const remove = useMutation(api.researchCircles.remove);
  const updateCircle = useMutation(api.researchCircles.update);
  const removeMember = useMutation(api.researchCircles.removeMember);
  const transferOwnership = useMutation(api.researchCircles.transferOwnership);

  const [inviteText, setInviteText] = React.useState("");
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editName, setEditName] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  const [editingPostId, setEditingPostId] =
    React.useState<Id<"researchCirclePosts"> | null>(null);
  const [editPostBody, setEditPostBody] = React.useState("");
  const [savingPost, setSavingPost] = React.useState(false);
  const [composeAttachments, setComposeAttachments] = React.useState<
    DraftAttachment[]
  >([]);
  const [editAttachments, setEditAttachments] = React.useState<
    DraftAttachment[]
  >([]);
  const [pendingConfirm, setPendingConfirm] =
    React.useState<PendingConfirm | null>(null);

  const composeAttach = useCirclePostAttachments(
    composeAttachments,
    setComposeAttachments
  );
  const editAttach = useCirclePostAttachments(
    editAttachments,
    setEditAttachments
  );

  if (!isSignedIn) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Sign in to view this circle.
      </p>
    );
  }

  if (detail === undefined || posts === undefined) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Loading circle…
      </p>
    );
  }

  if (detail === null) {
    return (
      <div className="space-y-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Circle not found or you are not a member.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/circles">Back to circles</Link>
        </Button>
      </div>
    );
  }

  const { circle, members } = detail;
  const isOwner = circle.myRole === "owner";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link href="/circles">← Circles</Link>
        </Button>
        {editing ? (
          <Card className="gap-3 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-16"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={busy}
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      await updateCircle({
                        circleId,
                        name: editName,
                        description: editDescription || undefined,
                      });
                      toast.success("Circle updated");
                      setEditing(false);
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Could not update"
                      );
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{circle.name}</h1>
              {isOwner ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditName(circle.name);
                    setEditDescription(circle.description ?? "");
                    setEditing(true);
                  }}
                >
                  Edit
                </Button>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {circle.anchorKind === "case" ? (
                <>
                  Anchored to case{" "}
                  <Link
                    href={`/cases/${circle.caseCode}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {circle.caseCode}
                  </Link>
                </>
              ) : (
                <>
                  Anchored to topic{" "}
                  <Link
                    href={`/topics/${circle.topic}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {circle.topic
                      ? caseCategoryMeta[circle.topic]?.label
                      : "Topic"}
                  </Link>
                </>
              )}{" "}
              · {circle.memberCount} members
            </p>
            {circle.description ? (
              <p className="text-sm">{circle.description}</p>
            ) : null}
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_14rem]">
        <div className="space-y-4">
          <Card className="gap-3 p-4">
            <MentionField
              circleId={circleId}
              value={body}
              onChange={setBody}
              placeholder="Share a finding — use @ to mention someone…"
              className="min-h-24"
            />
            <DraftAttachmentChips
              attachments={composeAttachments}
              onRemove={(id) => void composeAttach.removeAttachment(id)}
            />
            <div className="flex flex-wrap items-center gap-2">
              {composeAttach.attachButton}
              <Button
                size="sm"
                disabled={
                  busy ||
                  composeAttach.uploading ||
                  (!body.trim() && composeAttachments.length === 0)
                }
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      await addPost({
                        circleId,
                        body,
                        attachments: draftToPayload(composeAttachments),
                      });
                      revokeDraftPreviews(composeAttachments);
                      setBody("");
                      setComposeAttachments([]);
                      toast.success("Posted");
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Could not post"
                      );
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Post
              </Button>
            </div>
          </Card>

          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="space-y-2">
              {posts.map((post) => {
                const isAuthor = post.authorClerkId === userId;
                const canDelete = isAuthor || isOwner;
                const isEditingPost = editingPostId === post._id;
                return (
                  <li key={post._id}>
                    <Card className="gap-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <PersonAvatar
                            id={post.authorClerkId}
                            name={post.authorName}
                            className="size-7"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {post.authorName}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {formatDate(
                                new Date(post.createdAt).toISOString()
                              )}
                              {post.editedAt ? " · Edited" : null}
                            </p>
                          </div>
                        </div>
                        {!isEditingPost && (isAuthor || canDelete) ? (
                          <div className="flex shrink-0 gap-1">
                            {isAuthor ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => {
                                  revokeDraftPreviews(editAttachments);
                                  setEditingPostId(post._id);
                                  setEditPostBody(post.body);
                                  setEditAttachments(
                                    listedToDraft(post.attachments)
                                  );
                                }}
                              >
                                Edit
                              </Button>
                            ) : null}
                            {canDelete ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-destructive"
                                onClick={() =>
                                  setPendingConfirm({
                                    kind: "deletePost",
                                    postId: post._id,
                                  })
                                }
                              >
                                Delete
                              </Button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                      {isEditingPost ? (
                        <div className="space-y-2">
                          <MentionField
                            circleId={circleId}
                            value={editPostBody}
                            onChange={setEditPostBody}
                            className="min-h-24"
                          />
                          <DraftAttachmentChips
                            attachments={editAttachments}
                            onRemove={(id) =>
                              void editAttach.removeAttachment(id)
                            }
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            {editAttach.attachButton}
                            <Button
                              size="sm"
                              disabled={
                                savingPost ||
                                editAttach.uploading ||
                                (!editPostBody.trim() &&
                                  editAttachments.length === 0)
                              }
                              onClick={() => {
                                void (async () => {
                                  setSavingPost(true);
                                  try {
                                    await updatePost({
                                      postId: post._id,
                                      body: editPostBody,
                                      attachments:
                                        draftToPayload(editAttachments),
                                    });
                                    revokeDraftPreviews(editAttachments);
                                    setEditingPostId(null);
                                    setEditPostBody("");
                                    setEditAttachments([]);
                                    toast.success("Post updated");
                                  } catch (error) {
                                    toast.error(
                                      error instanceof Error
                                        ? error.message
                                        : "Could not update"
                                    );
                                  } finally {
                                    setSavingPost(false);
                                  }
                                })();
                              }}
                            >
                              {savingPost ? "Saving…" : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={savingPost}
                              onClick={() => {
                                revokeDraftPreviews(editAttachments);
                                setEditingPostId(null);
                                setEditPostBody("");
                                setEditAttachments([]);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {post.body ? (
                            <p className="text-sm whitespace-pre-wrap">
                              <MentionText text={post.body} />
                            </p>
                          ) : null}
                          <PostAttachmentList
                            attachments={post.attachments}
                          />
                        </div>
                      )}
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="gap-3 p-4">
            <p className="text-sm font-semibold">Members</p>
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m._id}
                  className="flex flex-col gap-1 rounded-md border border-transparent p-1 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <PersonAvatar
                      id={m.clerkUserId}
                      name={m.name}
                      className="size-6"
                    />
                    <span className="min-w-0 flex-1 truncate">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {m.role}
                    </span>
                  </div>
                  {isOwner && m.clerkUserId !== userId ? (
                    <div className="flex gap-1 pl-8">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-1.5 text-[10px]"
                        onClick={() =>
                          setPendingConfirm({
                            kind: "transfer",
                            memberClerkId: m.clerkUserId,
                            memberName: m.name,
                          })
                        }
                      >
                        Make owner
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-1.5 text-[10px] text-destructive"
                        onClick={() => {
                          void (async () => {
                            try {
                              await removeMember({
                                circleId,
                                memberClerkId: m.clerkUserId,
                              });
                              toast.success("Member removed");
                            } catch (error) {
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Could not remove"
                              );
                            }
                          })();
                        }}
                      >
                        Kick
                      </Button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>

            {isOwner ? (
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const username = extractInviteUsername(inviteText);
                  if (!username) {
                    toast.error("Type @username to invite");
                    return;
                  }
                  void (async () => {
                    try {
                      await invite({ circleId, username });
                      setInviteText("");
                      toast.success("Invite sent");
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Could not invite"
                      );
                    }
                  })();
                }}
              >
                <Label className="text-xs">Invite with @</Label>
                <MentionField
                  searchSource="users"
                  value={inviteText}
                  onChange={setInviteText}
                  placeholder="@username"
                  className="min-h-12"
                />
                <Button type="submit" size="sm" variant="outline" className="w-full">
                  Send invite
                </Button>
              </form>
            ) : null}

            {isOwner && pendingInvites && pendingInvites.length > 0 ? (
              <div className="space-y-2 border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Pending invites
                </p>
                <ul className="space-y-1">
                  {pendingInvites.map((row) => (
                    <li
                      key={row._id}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="truncate">@{row.inviteeUsername}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-1.5"
                        onClick={() => {
                          void (async () => {
                            try {
                              await cancelInvite({ inviteId: row._id });
                              toast.success("Invite cancelled");
                            } catch (error) {
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Could not cancel"
                              );
                            }
                          })();
                        }}
                      >
                        Cancel
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {circle.myRole === "member" ? (
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-destructive"
                onClick={() => {
                  void (async () => {
                    try {
                      await leave({ circleId });
                      toast.success("Left circle");
                      router.push("/circles");
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Could not leave"
                      );
                    }
                  })();
                }}
              >
                Leave circle
              </Button>
            ) : null}
            {isOwner ? (
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-destructive"
                onClick={() => setPendingConfirm({ kind: "delete" })}
              >
                Delete circle
              </Button>
            ) : null}
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={pendingConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setPendingConfirm(null);
        }}
        title={
          pendingConfirm?.kind === "transfer"
            ? `Transfer ownership to ${pendingConfirm.memberName}?`
            : pendingConfirm?.kind === "deletePost"
              ? "Delete this post?"
              : "Delete this circle?"
        }
        description={
          pendingConfirm?.kind === "transfer"
            ? "You will become a member."
            : pendingConfirm?.kind === "deletePost"
              ? "This cannot be undone."
              : "This removes the circle and all posts."
        }
        confirmLabel={
          pendingConfirm?.kind === "transfer" ? "Transfer" : "Delete"
        }
        variant={
          pendingConfirm?.kind === "delete" ||
          pendingConfirm?.kind === "deletePost"
            ? "destructive"
            : "default"
        }
        onConfirm={async () => {
          if (!pendingConfirm) return;
          if (pendingConfirm.kind === "transfer") {
            try {
              await transferOwnership({
                circleId,
                newOwnerClerkId: pendingConfirm.memberClerkId,
              });
              toast.success("Ownership transferred");
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Could not transfer"
              );
            }
            return;
          }
          if (pendingConfirm.kind === "deletePost") {
            try {
              await deletePost({ postId: pendingConfirm.postId });
              if (editingPostId === pendingConfirm.postId) {
                setEditingPostId(null);
                setEditPostBody("");
              }
              toast.success("Post deleted");
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Could not delete"
              );
            }
            return;
          }
          try {
            await remove({ circleId });
            toast.success("Circle deleted");
            router.push("/circles");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Could not delete"
            );
          }
        }}
      />
    </div>
  );
}
