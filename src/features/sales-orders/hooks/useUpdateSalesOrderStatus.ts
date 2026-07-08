import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesOrdersService } from "@/features/sales-orders/services/salesOrdersService";
import { salesOrderKeys } from "@/features/sales-orders/services/queryKeys";
import type { SalesOrderStatus } from "@/features/sales-orders/types";

export function useUpdateSalesOrderStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: SalesOrderStatus) => salesOrdersService.updateStatus(id, status),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(salesOrderKeys.detail(id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: salesOrderKeys.lists() });
    },
  });
};
