"use client";

import * as React from "react";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

type Locale = "en" | "ar" | "es" | "de" | "fr" | "ko" | "hi";

const RTL: Locale[] = ["ar"];

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
};

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: "en",
  dir: "ltr",
  setLocale: () => {},
});

export function useLocale() {
  return React.useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    const saved = readJson<Locale>(STORAGE_KEYS.locale, "en");
    setLocaleState(saved);
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    writeJson(STORAGE_KEYS.locale, next);
  }, []);

  const dir = RTL.includes(locale) ? "rtl" : "ltr";

  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <LocaleContext.Provider value={{ locale, dir, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
