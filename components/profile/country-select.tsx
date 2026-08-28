"use client";

import { countries } from "@/lib/countries";
import { cn } from "@/lib/utils";

export function CountrySelect({
  id,
  value,
  onChange,
  disabled,
  className,
  allowEmpty = false,
  emptyLabel = "Select a country",
}: {
  id?: string;
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  className?: string;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const selected = countries.some((country) => country.code === value)
    ? value
    : "";

  return (
    <select
      id={id}
      value={selected}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Country"
      className={cn(
        "h-10 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px] bg-[right_0.65rem_center] bg-no-repeat px-2.5 pr-8 text-base outline-none transition-colors",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:h-8 md:text-sm dark:bg-input/30",
        className
      )}
    >
      {allowEmpty || !selected ? (
        <option value="" disabled={!allowEmpty}>
          {emptyLabel}
        </option>
      ) : null}
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.name}
        </option>
      ))}
    </select>
  );
}
