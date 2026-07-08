import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="text-on-surface flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        className={`border-outline text-primary focus:ring-primary/30 h-5 w-5 rounded focus:ring-2 ${className ?? ""}`}
        {...props}
      />
      {label}
    </label>
  );
}
