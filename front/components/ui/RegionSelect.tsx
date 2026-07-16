import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { REGION_OPTIONS } from "@/lib/regions";

interface RegionSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const RegionSelect = forwardRef<HTMLSelectElement, RegionSelectProps>(function RegionSelect(
  { label, error, id, ...props },
  ref
) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-aluminum-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={`w-full appearance-none rounded-xl border bg-white/60 px-4 py-2.5 pr-10 text-aluminum-900 outline-none backdrop-blur-sm transition focus:bg-white/80 focus:ring-2 ${
            error
              ? "border-red-300 focus:ring-red-200"
              : "border-white/70 focus:border-brown-300 focus:ring-brown-200"
          }`}
          {...props}
        >
          <option value="" disabled hidden>
            Select your region
          </option>
          {REGION_OPTIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-aluminum-400"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
});
