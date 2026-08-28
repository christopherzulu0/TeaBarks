"use client";

import * as React from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

let audio: HTMLAudioElement | null = null;
let unlocked = false;
let pending = 0;

function buildChimeUrl() {
  const sampleRate = 44100;
  const duration = 0.42;
  const n = Math.floor(sampleRate * duration);
  const samples = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const env = Math.min(1, t / 0.012) * Math.exp(-t * 5.5);
    const freq = t < 0.14 ? 880 : 1318.5;
    const value = Math.sin(2 * Math.PI * freq * t) * env * 0.62;
    samples[i] = Math.max(-1, Math.min(1, value)) * 32767;
  }
  const bytes = samples.byteLength;
  const buffer = new ArrayBuffer(44 + bytes);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + bytes, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, bytes, true);
  new Uint8Array(buffer, 44).set(new Uint8Array(samples.buffer));
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function getAudio() {
  if (!audio) {
    audio = new Audio(buildChimeUrl());
    audio.preload = "auto";
    audio.volume = 0.75;
  }
  return audio;
}

async function unlockAudio() {
  unlocked = true;
  try {
    const el = getAudio();
    el.muted = true;
    el.volume = 0;
    await el.play();
    el.pause();
    el.currentTime = 0;
    el.muted = false;
    el.volume = 0.75;
  } catch {
    // Browser still blocking until a louder, later gesture.
  }
  if (pending > 0) {
    const queued = pending;
    pending = 0;
    for (let i = 0; i < Math.min(queued, 3); i++) {
      await playNotificationChime();
    }
  }
}

export async function playNotificationChime() {
  try {
    const el = getAudio();
    el.muted = false;
    el.volume = 0.75;
    el.currentTime = 0;
    await el.play();
    unlocked = true;
    return true;
  } catch {
    pending += 1;
    return false;
  }
}

export function NotificationSound() {
  const { isAuthenticated } = useConvexAuth();
  const prefs = useQuery(
    api.notifications.getPrefs,
    isAuthenticated ? {} : "skip"
  );
  const unread = useQuery(
    api.notifications.unreadCount,
    isAuthenticated ? {} : "skip"
  );
  const primed = React.useRef(false);
  const lastAt = React.useRef<number | null>(null);
  const lastCount = React.useRef(0);

  React.useEffect(() => {
    const onGesture = () => {
      void unlockAudio();
    };
    window.addEventListener("pointerdown", onGesture, { capture: true });
    window.addEventListener("keydown", onGesture, { capture: true });
    window.addEventListener("touchstart", onGesture, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture, { capture: true });
      window.removeEventListener("keydown", onGesture, { capture: true });
      window.removeEventListener("touchstart", onGesture, { capture: true });
    };
  }, []);

  const latestCreatedAt = unread?.latestCreatedAt ?? null;
  const count = unread?.count ?? 0;
  const soundEnabled = prefs?.soundEnabled !== false;

  React.useEffect(() => {
    if (unread === undefined) return;
    if (!primed.current) {
      lastAt.current = latestCreatedAt;
      lastCount.current = count;
      primed.current = true;
      return;
    }
    const arrived =
      (latestCreatedAt != null &&
        (lastAt.current == null || latestCreatedAt > lastAt.current)) ||
      count > lastCount.current;
    lastAt.current = latestCreatedAt;
    lastCount.current = count;
    if (arrived && soundEnabled) {
      void playNotificationChime();
    }
  }, [unread, latestCreatedAt, count, soundEnabled]);

  return null;
}
