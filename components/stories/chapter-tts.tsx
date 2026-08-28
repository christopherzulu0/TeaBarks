"use client";

import * as React from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_CHUNK = 240;
const SPEAK_WPM = 165;
const RATES = ["0.8", "1", "1.25"] as const;

type SpeakMode = "idle" | "playing" | "paused";

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function listenMinutes(wordCount: number, rate: number) {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.round(wordCount / (SPEAK_WPM * rate)));
}

function chunkText(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= MAX_CHUNK) return [trimmed];
  const chunks: string[] = [];
  let remaining = trimmed;
  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHUNK) {
      chunks.push(remaining);
      break;
    }
    const slice = remaining.slice(0, MAX_CHUNK);
    const punct = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("; ")
    );
    const space = slice.lastIndexOf(" ");
    const at =
      punct >= MAX_CHUNK * 0.4
        ? punct + 1
        : space >= MAX_CHUNK * 0.4
          ? space
          : MAX_CHUNK;
    chunks.push(remaining.slice(0, at).trim());
    remaining = remaining.slice(at).trim();
  }
  return chunks.filter(Boolean);
}

function flattenChunks(paragraphs: string[]) {
  return paragraphs.flatMap(chunkText);
}

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const googleEn = voices.find(
    (voice) =>
      /google/i.test(voice.name) && voice.lang.toLowerCase().startsWith("en")
  );
  if (googleEn) return googleEn;
  const google = voices.find((voice) => /google/i.test(voice.name));
  if (google) return google;
  return (
    voices.find(
      (voice) => voice.default && voice.lang.toLowerCase().startsWith("en")
    ) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    voices[0] ??
    null
  );
}

export function ChapterTts({
  paragraphs,
  wordCount,
  chapterKey,
}: {
  paragraphs: string[];
  wordCount: number;
  chapterKey: string;
}) {
  const [supported, setSupported] = React.useState(false);
  const [mode, setMode] = React.useState<SpeakMode>("idle");
  const [rate, setRate] = React.useState<string>("1");
  const [chunkIndex, setChunkIndex] = React.useState(0);

  const chunks = React.useMemo(() => flattenChunks(paragraphs), [paragraphs]);
  const chunksRef = React.useRef(chunks);
  const rateRef = React.useRef(Number(rate));
  const modeRef = React.useRef<SpeakMode>("idle");
  const indexRef = React.useRef(0);
  const generationRef = React.useRef(0);
  const voiceRef = React.useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  chunksRef.current = chunks;
  rateRef.current = Number(rate);
  modeRef.current = mode;

  const stopEngine = React.useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    generationRef.current += 1;
    window.speechSynthesis.cancel();
  }, []);

  const speakAt = React.useCallback((index: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const list = chunksRef.current;
    if (index >= list.length) {
      modeRef.current = "idle";
      indexRef.current = 0;
      setMode("idle");
      setChunkIndex(0);
      return;
    }
    const generation = generationRef.current;
    const utterance = new SpeechSynthesisUtterance(list[index]);
    utterance.rate = rateRef.current;
    const voice = voiceRef.current;
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.onend = () => {
      if (generationRef.current !== generation) return;
      if (modeRef.current !== "playing") return;
      const next = index + 1;
      indexRef.current = next;
      setChunkIndex(next);
      speakAt(next);
    };
    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      if (generationRef.current !== generation) return;
      modeRef.current = "idle";
      setMode("idle");
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  React.useEffect(() => {
    const available =
      typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(available);
    if (!available) return;

    const loadVoices = () => {
      voiceRef.current = pickVoice(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  React.useEffect(() => {
    if (mode !== "playing") return;
    const id = window.setInterval(() => {
      if (modeRef.current !== "playing") return;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 8000);
    return () => window.clearInterval(id);
  }, [mode]);

  React.useEffect(() => {
    modeRef.current = "idle";
    indexRef.current = 0;
    setMode("idle");
    setChunkIndex(0);
    stopEngine();
    return () => {
      modeRef.current = "idle";
      stopEngine();
    };
  }, [chapterKey, stopEngine]);

  const play = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    modeRef.current = "playing";
    setMode("playing");
    if (synth.paused) {
      synth.resume();
      return;
    }
    speakAt(indexRef.current);
  };

  const pause = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    modeRef.current = "paused";
    setMode("paused");
    synth.pause();
    window.setTimeout(() => {
      if (modeRef.current !== "paused") return;
      if (synth.speaking && !synth.paused) {
        generationRef.current += 1;
        synth.cancel();
      }
    }, 50);
  };

  const stop = () => {
    modeRef.current = "idle";
    indexRef.current = 0;
    setMode("idle");
    setChunkIndex(0);
    stopEngine();
  };

  const changeRate = (value: string) => {
    setRate(value);
    rateRef.current = Number(value);
    if (modeRef.current !== "playing") return;
    stopEngine();
    window.setTimeout(() => {
      if (modeRef.current === "playing") speakAt(indexRef.current);
    }, 0);
  };

  const rateNumber = Number(rate);
  const remainingWords = countWords(chunks.slice(chunkIndex).join(" "));
  const estimate =
    mode === "idle"
      ? listenMinutes(wordCount, rateNumber)
      : listenMinutes(remainingWords, rateNumber);

  const playLabel =
    mode === "paused" ? "Resume listening" : "Listen to this part";

  const controls = (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!supported || chunks.length === 0}
        aria-label={
          mode === "playing" ? "Pause listening" : playLabel
        }
        onClick={mode === "playing" ? pause : play}
      >
        {mode === "playing" ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
        <span className="hidden sm:inline">
          {mode === "playing" ? "Pause" : mode === "paused" ? "Resume" : "Listen"}
        </span>
      </Button>
      {mode !== "idle" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Stop listening"
          onClick={stop}
        >
          <Square className="size-3.5" />
        </Button>
      ) : null}
      <Select value={rate} onValueChange={changeRate} disabled={!supported}>
        <SelectTrigger
          size="sm"
          aria-label="Listening speed"
          className="h-7 min-w-16"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {RATES.map((value) => (
            <SelectItem key={value} value={value}>
              {value}x
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Volume2 className="size-3.5" aria-hidden />
        {mode === "idle"
          ? `${estimate} min listen`
          : estimate > 0
            ? `${estimate} min left`
            : "Done"}
      </span>
    </div>
  );

  if (!supported) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{controls}</span>
        </TooltipTrigger>
        <TooltipContent>Listen is not supported in this browser</TooltipContent>
      </Tooltip>
    );
  }

  return controls;
}
