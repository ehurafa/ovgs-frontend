"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, hint, id, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={id} className="text-on-surface mb-1 block text-sm font-medium">
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={`text-on-surface disabled:text-on-surface-muted w-full rounded border bg-white px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
            error
              ? "border-error focus:border-error focus:ring-error/30"
              : "border-outline focus:border-primary focus:ring-primary/30"
          } ${className ?? ""}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-error mt-1 text-xs">{error}</p>
        ) : hint ? (
          <p className="text-on-surface-muted mt-1 text-xs">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
