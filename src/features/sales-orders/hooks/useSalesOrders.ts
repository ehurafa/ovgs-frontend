import { useQuery } from "@tanstack/react-query";
import { salesOrdersService, type SalesOrderFilters } from "@/features/sales-orders/services/salesOrdersService";
import { salesOrderKeys } from "@/features/sales-orders/services/queryKeys";

export function useSalesOrders(filters: SalesOrderFilters = {}) {
  return useQuery({
    queryKey: salesOrderKeys.list(filters),
    queryFn: () => salesOrdersService.list(filters),
  });
};
