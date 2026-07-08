import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * Node-side MSW setup, used only in tests. Distinct from browser.ts
 * (which uses msw/browser + setupWorker for the actual running app) -
 * both share the same `handlers`, so tests exercise the same mocked
 * API contract the UI runs against in development.
 */
export const server = setupServer(...handlers);
