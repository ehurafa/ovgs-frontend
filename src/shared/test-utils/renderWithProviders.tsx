import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { createAppStore } from "@/lib/store/store";
import type { ReactElement } from "react";
import type { Task } from "redux-saga";

/**
 * Like renderWithQueryClient, but also wraps a fresh Redux store (with
 * its own saga middleware instance) — needed for anything that
 * dispatches actions or reads slices (e.g. the scheduling flow).
 *
 * Every saga task created here is tracked and must be cancelled after
 * each test via cancelActiveSagaTasks() (called from jest.setup.ts) —
 * otherwise sagas keep running in the background after the test ends,
 * which can leak into later tests and leave Jest workers hanging.
 */
const activeTasks: Task[] = [];

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const { store, task } = createAppStore();
  activeTasks.push(task);

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{ui}</Provider>
    </QueryClientProvider>
  );
}

export function cancelActiveSagaTasks() {
  while (activeTasks.length > 0) {
    activeTasks.pop()?.cancel();
  }
}
