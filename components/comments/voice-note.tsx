"use client";

import * as React from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MAX_MS = 60_000;

function pickMime() {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function formatMs(ms: number) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export type VoiceDraft = {
  blob: Blob;
  durationMs: number;
  contentType: string;
};

export function VoiceNoteRecorder({
  draft,
  onDraftChange,
}: {
  draft: VoiceDraft | null;
  onDraftChange: (draft: VoiceDraft | null) => void;
}) {
  const [recording, setRecording] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const startedAt = React.useRef(0);
  const cancelledRef = React.useRef(false);
  const previewUrl = React.useMemo(
    () => (draft ? URL.createObjectURL(draft.blob) : null),
    [draft]
  );

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  React.useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => {
      setElapsed(Date.now() - startedAt.current);
    }, 200);
    return () => window.clearInterval(id);
  }, [recording]);

  const stopRecorder = React.useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
  }, []);

  React.useEffect(() => {
    if (recording && elapsed >= MAX_MS) stopRecorder();
  }, [elapsed, recording, stopRecorder]);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Voice notes are not supported in this browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      cancelledRef.current = false;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        recorderRef.current = null;
        if (cancelledRef.current) {
          cancelledRef.current = false;
          chunksRef.current = [];
          return;
        }
        const type = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const durationMs = Math.min(
          MAX_MS,
          Math.max(1, Date.now() - startedAt.current)
        );
        onDraftChange({ blob, durationMs, contentType: type });
      };
      recorderRef.current = recorder;
      startedAt.current = Date.now();
      setElapsed(0);
      setRecording(true);
      recorder.start();
    } catch {
      toast.error("Microphone access was denied");
    }
  };

  if (draft) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-2 py-1.5">
        <audio src={previewUrl ?? undefined} controls className="h-8 max-w-full flex-1" />
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatMs(draft.durationMs)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onDraftChange(null)}
          aria-label="Remove voice note"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    );
  }

  if (recording) {
    return (
      <div className="flex items-center gap-2">
        <span className="size-2 animate-pulse rounded-full bg-destructive" />
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatMs(elapsed)} / 1:00
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={stopRecorder}
        >
          <Square className="size-3.5" />
          Stop
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => {
            cancelledRef.current = true;
            stopRecorder();
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 px-2"
      onClick={() => void start()}
    >
      <Mic className="size-4" aria-hidden />
      <span className="sr-only">Record voice note</span>
    </Button>
  );
}

export function formatVoiceDuration(ms: number) {
  return formatMs(ms);
}
