"use client";

import { useEffect, useState } from "react";

/**
 * Starts the MSW worker before rendering children.
 *
 * This project has no real backend — MSW mocks the entire API surface,
 * in local development AND in any deployed demo (e.g. Vercel) alike.
 * Mocking is ON by default everywhere; set
 * NEXT_PUBLIC_API_MOCKING=disabled (as an env var) to turn it off, e.g.
 * if a real backend is later plugged in behind the same REST contract.
 */
export function MockProvider({ children }: { children: React.ReactNode }) {
  const mockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING !== "disabled";
  const [ready, setReady] = useState(!mockingEnabled);

  useEffect(() => {
    if (!mockingEnabled) return;

    import("./browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, [mockingEnabled]);

  if (!ready) return null;
  return <>{children}</>;
}
