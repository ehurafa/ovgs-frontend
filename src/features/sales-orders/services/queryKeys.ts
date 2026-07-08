import type { SalesOrderFilters } from "./salesOrdersService";

/**
 * Hierarchical query key factory. Keeping keys centralized (instead of
 * inlining arrays like ["sales-orders", filters] in every hook) avoids
 * typos/collisions and enables precise cache invalidation — e.g.
 * invalidating salesOrderKeys.lists() refreshes every filtered list
 * without touching individual sales-orders detail cache.
 */
export const salesOrderKeys = {
  all: ["sales-orders"] as const,
  lists: () => [...salesOrderKeys.all, "list"] as const,
  list: (filters: SalesOrderFilters) => [...salesOrderKeys.lists(), filters] as const,
  details: () => [...salesOrderKeys.all, "detail"] as const,
  detail: (id: string) => [...salesOrderKeys.details(), id] as const,
};
