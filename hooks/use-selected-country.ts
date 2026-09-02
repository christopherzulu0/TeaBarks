"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { countries } from "@/lib/countries";
import { defaultUserSettings } from "@/lib/user-settings";

function isValidCountryCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return countries.some((country) => country.code === normalized);
}

export function useSelectedCountry(basePath: "/" | "/explore") {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useConvexAuth();
  const settings = useQuery(
    api.userSettings.getMine,
    isAuthenticated ? {} : "skip"
  );

  const urlCountry = params.get("country")?.trim().toUpperCase() ?? "";
  const settingsCountry = settings?.country?.trim().toUpperCase() ?? "";

  const [selectedCountry, setSelectedCountry] = React.useState(
    defaultUserSettings.country
  );
  const [isCountryRefreshing, setIsCountryRefreshing] = React.useState(false);
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (urlCountry && isValidCountryCode(urlCountry)) {
      setSelectedCountry(urlCountry);
      initializedRef.current = true;
      return;
    }
    if (
      !initializedRef.current &&
      settingsCountry &&
      isValidCountryCode(settingsCountry)
    ) {
      setSelectedCountry(settingsCountry);
      initializedRef.current = true;
    }
  }, [urlCountry, settingsCountry]);

  React.useEffect(() => {
    if (!isCountryRefreshing) return;
    const timer = setTimeout(() => setIsCountryRefreshing(false), 200);
    return () => clearTimeout(timer);
  }, [selectedCountry, isCountryRefreshing]);

  const handleCountryChange = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!isValidCountryCode(normalized)) return;
    if (normalized === selectedCountry) return;
    setIsCountryRefreshing(true);
    setSelectedCountry(normalized);

    const next = new URLSearchParams(params.toString());
    next.set("country", normalized);
    const query = next.toString();
    router.replace(query ? `${basePath}?${query}` : basePath, { scroll: false });
  };

  const countryMeta = countries.find((c) => c.code === selectedCountry);
  const countryLabel = countryMeta
    ? `${countryMeta.flag} ${countryMeta.name}`
    : selectedCountry;

  return {
    selectedCountry,
    countryMeta,
    countryLabel,
    isCountryRefreshing,
    handleCountryChange,
  };
}
