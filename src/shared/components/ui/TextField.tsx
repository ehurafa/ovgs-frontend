"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={id} className="text-on-surface mb-1 block text-sm font-medium">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={`text-on-surface placeholder:text-on-surface-muted w-full rounded border px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
            error
              ? "border-error focus:border-error focus:ring-error/30"
              : "border-outline focus:border-primary focus:ring-primary/30"
          } ${className ?? ""}`}
          {...props}
        />
        {error ? (
          <p className="text-error mt-1 text-xs">{error}</p>
        ) : hint ? (
          <p className="text-on-surface-muted mt-1 text-xs">{hint}</p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = "TextField";
