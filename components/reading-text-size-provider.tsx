"use client";

import * as React from "react";
import {
  defaultReadingTextSize,
  isReadingTextSize,
  type ReadingTextSize,
} from "@/lib/reading-text-size";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

type ReadingTextSizeContextValue = {
  textSize: ReadingTextSize;
  setTextSize: (size: ReadingTextSize) => void;
};

const ReadingTextSizeContext = React.createContext<ReadingTextSizeContextValue>({
  textSize: defaultReadingTextSize,
  setTextSize: () => {},
});

export function useReadingTextSize() {
  return React.useContext(ReadingTextSizeContext);
}

export function ReadingTextSizeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [textSize, setTextSizeState] = React.useState<ReadingTextSize>(
    defaultReadingTextSize
  );

  React.useEffect(() => {
    const saved = readJson<string>(
      STORAGE_KEYS.readingTextSize,
      defaultReadingTextSize
    );
    if (isReadingTextSize(saved)) {
      setTextSizeState(saved);
    }
  }, []);

  const setTextSize = React.useCallback((next: ReadingTextSize) => {
    setTextSizeState(next);
    writeJson(STORAGE_KEYS.readingTextSize, next);
  }, []);

  return (
    <ReadingTextSizeContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </ReadingTextSizeContext.Provider>
  );
}
