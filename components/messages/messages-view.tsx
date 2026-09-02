"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  FileText,
  Mail,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { PersonAvatar } from "@/components/person-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const MAX_ATTACHMENTS = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPT =
  "image/*,application/pdf,.pdf,.doc,.docx,.txt,.md,text/plain,text/markdown";

type DraftAttachment = {
  id: string;
  storageId: Id<"_storage">;
  fileName: string;
  contentType?: string;
  previewUrl?: string;
};

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const kindLabel = {
  bark: "Reaction",
  case: "Case",
  creator: "Creator",
} as const;

function isImageType(contentType?: string, fileName?: string) {
  if (contentType?.startsWith("image/")) return true;
  return Boolean(fileName?.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/i));
}

function Bubble({
  mine,
  body,
  createdAt,
  read,
  attachments,
}: {
  mine: boolean;
  body: string;
  createdAt: number;
  read: boolean;
  attachments: Array<{
    storageId: Id<"_storage">;
    fileName?: string;
    contentType?: string;
    url: string | null;
  }>;
}) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] space-y-2 break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          mine
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted"
        )}
      >
        {body ? <p>{body}</p> : null}
        {attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((file) => {
              const label = file.fileName || "Attachment";
              if (file.url && isImageType(file.contentType, file.fileName)) {
                return (
                  <a
                    key={file.storageId}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-lg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={label}
                      className="max-h-56 w-full object-cover"
                    />
                  </a>
                );
              }
              return (
                <a
                  key={file.storageId}
                  href={file.url ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex max-w-full items-center gap-1.5 underline-offset-2 hover:underline",
                    mine
                      ? "text-primary-foreground/90"
                      : "text-foreground"
                  )}
                >
                  <FileText className="size-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </a>
              );
            })}
          </div>
        ) : null}
        <p
          className={cn(
            "flex items-center justify-end gap-1 text-[10px]",
            mine ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {formatTime(createdAt)}
          {mine &&
            (read ? (
              <CheckCheck className="size-3" aria-label="Read" />
            ) : (
              <Check className="size-3" aria-label="Sent" />
            ))}
        </p>
      </div>
    </div>
  );
}

export function MessagesView() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const params = useSearchParams();
  const requestedId = params.get("c") as Id<"messageThreads"> | null;
  const inbox =
    useQuery(api.messages.listMine, isAuthenticated ? {} : "skip") ?? [];
  const [query, setQuery] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [attachments, setAttachments] = React.useState<DraftAttachment[]>([]);
  const [sending, setSending] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const send = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markRead);
  const generateUploadUrl = useMutation(api.evidenceFiles.generateUploadUrl);
  const registerUpload = useMutation(api.evidenceFiles.registerUpload);
  const deleteUpload = useMutation(api.evidenceFiles.deleteUpload);

  const filtered = inbox.filter((row) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      row.otherName.toLowerCase().includes(q) ||
      row.subjectTitle.toLowerCase().includes(q) ||
      row.lastPreview.toLowerCase().includes(q)
    );
  });

  const active =
    requestedId && inbox.some((row) => row.threadId === requestedId)
      ? inbox.find((row) => row.threadId === requestedId)
      : undefined;

  const messages = useQuery(
    api.messages.listMessages,
    isAuthenticated && active ? { threadId: active.threadId } : "skip"
  );

  React.useEffect(() => {
    if (!active) return;
    void markRead({ threadId: active.threadId }).catch(() => undefined);
  }, [active, markRead, messages?.length]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    setDraft("");
    setAttachments((prev) => {
      for (const file of prev) {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      }
      return [];
    });
  }, [active?.threadId]);

  const openThread = (threadId: Id<"messageThreads">) => {
    router.replace(`/messages?c=${threadId}`);
  };

  const closeThread = () => {
    router.replace("/messages");
  };

  const removeDraftAttachment = async (id: string) => {
    const file = attachments.find((row) => row.id === id);
    if (!file) return;
    if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    try {
      await deleteUpload({ storageId: file.storageId });
    } catch {
      // Keep UI responsive if cleanup fails.
    }
    setAttachments((prev) => prev.filter((row) => row.id !== id));
  };

  const onPickFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_ATTACHMENTS - attachments.length;
    if (remaining <= 0) {
      toast.message(`You can attach up to ${MAX_ATTACHMENTS} files`);
      return;
    }
    const chosen = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      for (const file of chosen) {
        if (file.size > MAX_FILE_BYTES) {
          toast.error(`${file.name} is larger than 10MB`);
          continue;
        }
        const postUrl = await generateUploadUrl();
        const uploaded = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });
        if (!uploaded.ok) throw new Error("Upload failed");
        const body = (await uploaded.json()) as { storageId?: string };
        if (!body.storageId) throw new Error("Upload failed");
        const storageId = body.storageId as Id<"_storage">;
        await registerUpload({ storageId });
        const previewUrl = isImageType(file.type, file.name)
          ? URL.createObjectURL(file)
          : undefined;
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${storageId}`,
            storageId,
            fileName: file.name,
            contentType: file.type || undefined,
            previewUrl,
          },
        ]);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not attach file"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const post = async () => {
    if (!active) return;
    if (!draft.trim() && attachments.length === 0) return;
    setSending(true);
    try {
      await send({
        threadId: active.threadId,
        body: draft,
        attachments: attachments.map((file) => ({
          storageId: file.storageId,
          fileName: file.fileName,
          contentType: file.contentType,
        })),
      });
      for (const file of attachments) {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      }
      setDraft("");
      setAttachments([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send");
    } finally {
      setSending(false);
    }
  };

  const canSend =
    !sending &&
    !uploading &&
    (Boolean(draft.trim()) || attachments.length > 0);

  const listPane = (
    <div
      className={cn(
        "h-full min-h-0 min-w-0 flex-col overflow-hidden md:border-r",
        active ? "hidden md:flex" : "flex"
      )}
    >
      <div className="shrink-0 border-b p-3">
        <Input
          placeholder="Search conversations…"
          aria-label="Search conversations"
          className="h-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              className="border-0 py-10"
              icon={Mail}
              title={inbox.length === 0 ? "No conversations yet" : "No matches"}
              description={
                inbox.length === 0
                  ? "Message someone from a reaction, case, or creator page."
                  : "No matching conversations."
              }
            />
          </div>
        ) : (
          <ul className="w-full min-w-0">
            {filtered.map((row) => (
              <li key={row.threadId} className="w-full min-w-0">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openThread(row.threadId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openThread(row.threadId);
                    }
                  }}
                  className={cn(
                    "flex w-full min-w-0 max-w-full cursor-pointer items-center gap-3 overflow-hidden border-b px-3 py-3 text-left transition-colors hover:bg-muted/60",
                    row.threadId === active?.threadId && "bg-muted"
                  )}
                >
                  <PersonAvatar
                    id={row.otherClerkId}
                    name={row.otherName}
                    imageUrl={row.otherImageUrl ?? undefined}
                    className="size-9 shrink-0"
                  />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="truncate text-sm font-medium">
                      {row.otherName}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {kindLabel[row.subjectKind]} · {row.subjectTitle}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {row.lastPreview || "No messages yet"}
                    </div>
                  </div>
                  {row.unreadCount > 0 ? (
                    <Badge className="size-5 shrink-0 justify-center rounded-full p-0 text-[10px]">
                      {row.unreadCount > 9 ? "9+" : row.unreadCount}
                    </Badge>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const chatPane = (
    <div
      className={cn(
        "h-full min-h-0 min-w-0 flex-col overflow-hidden",
        active ? "flex" : "hidden md:flex"
      )}
    >
      {active ? (
        <>
          <div className="flex min-w-0 shrink-0 items-center gap-3 overflow-hidden border-b px-3 py-3 md:px-4">
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={closeThread}
                aria-label="Back to conversations"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <PersonAvatar
                id={active.otherClerkId}
                name={active.otherName}
                imageUrl={active.otherImageUrl ?? undefined}
                className="size-8"
              />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{active.otherName}</p>
              <Link
                href={active.subjectHref}
                className="block truncate text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                {kindLabel[active.subjectKind]} · {active.subjectTitle}
              </Link>
            </div>
          </div>
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {(messages ?? []).map((m) => (
                <Bubble
                  key={m._id}
                  mine={m.mine}
                  body={m.body}
                  createdAt={m.createdAt}
                  read={m.read}
                  attachments={m.attachments}
                />
              ))}
              <div ref={endRef} />
            </div>
          </div>
          <Separator />
          {attachments.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-b px-3 py-2">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex max-w-full items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs"
                >
                  {file.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.previewUrl}
                      alt=""
                      className="size-6 rounded object-cover"
                    />
                  ) : (
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className="truncate">{file.fileName}</span>
                  <button
                    type="button"
                    className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                    aria-label={`Remove ${file.fileName}`}
                    onClick={() => void removeDraftAttachment(file.id)}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <form
            className="flex shrink-0 items-center gap-2 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void post();
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={ACCEPT}
              multiple
              onChange={(e) => void onPickFiles(e.target.files)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Attach file"
              disabled={uploading || attachments.length >= MAX_ATTACHMENTS}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="size-4.5" />
            </Button>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${active.otherName.split(" ")[0]}…`}
              aria-label="Message text"
              className="min-w-0 flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0"
              aria-label="Send message"
              disabled={!canSend}
            >
              <Send className="size-4" />
            </Button>
          </form>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-6">
          <EmptyState
            icon={Mail}
            title="Select a conversation"
            description="Private research coordination starts from a reaction, case, or creator profile."
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden px-3 py-3 md:px-4 md:py-4 lg:px-6">
      <div className="mb-3 shrink-0 md:mb-4">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">
          Messages
        </h1>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Private threads about a reaction, case, or creator.
        </p>
      </div>
      <div className="grid min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border md:grid-cols-[20rem_minmax(0,1fr)]">
        {listPane}
        {chatPane}
      </div>
    </div>
  );
}
