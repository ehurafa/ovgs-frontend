import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="border-outline/40 bg-surface rounded-xl border p-6 shadow-sm">{children}</div>
  );
}
