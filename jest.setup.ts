import "@testing-library/jest-dom";
import { server } from "@/lib/api/mocks/server";
import { cancelActiveSagaTasks } from "@/shared/test-utils/renderWithProviders";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cancelActiveSagaTasks();
});
afterAll(() => server.close());
