import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, id, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-aluminum-700">
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white/60 px-4 py-2.5 text-aluminum-900 placeholder:text-aluminum-400 outline-none backdrop-blur-sm transition focus:bg-white/80 focus:ring-2 ${
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-white/70 focus:border-brown-300 focus:ring-brown-200"
        }`}
        {...props}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
});
