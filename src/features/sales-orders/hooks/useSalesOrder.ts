import { useQuery } from "@tanstack/react-query";
import { salesOrdersService } from "@/features/sales-orders/services/salesOrdersService";
import { salesOrderKeys } from "@/features/sales-orders/services/queryKeys";

export function useSalesOrder(id: string) {
  return useQuery({
    queryKey: salesOrderKeys.detail(id),
    queryFn: () => salesOrdersService.getById(id),
    enabled: Boolean(id),
  });
}
