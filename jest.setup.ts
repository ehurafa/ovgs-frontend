import "@testing-library/jest-dom";
import { server } from "@/lib/api/mocks/server";

// Fail loudly on any request that isn't explicitly mocked in a test —
// prevents a test from silently passing against real network calls.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
