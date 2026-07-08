// lib/api/mocks/MockProvider.tsx
"use client";

import { useEffect, useState } from "react";

/**
 * Starts the MSW worker before rendering children, only in development.
 * Prevents a flash of unmocked requests on initial load.
 */
export function MockProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    import("./browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
