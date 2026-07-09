import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Material-style elevated surface: rounded corners, subtle border,
 * soft shadow (elevation 1). Wraps forms/content that should read as
 * a distinct "card" on the page background.
 */
export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`border-outline/40 bg-surface rounded-xl border p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
