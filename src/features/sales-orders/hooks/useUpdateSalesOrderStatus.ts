import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesOrdersService } from "@/features/sales-orders/services/salesOrdersService";
import { salesOrderKeys } from "@/features/sales-orders/services/queryKeys";
import type { SalesOrder, SalesOrderStatus } from "@/features/sales-orders/types";
import { store } from "@/lib/store/store";
import { auditEventLogged } from "@/shared/store/auditSlice";

export function useUpdateSalesOrderStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: SalesOrderStatus) => salesOrdersService.updateStatus(id, status),
    onSuccess: (updatedOrder) => {
      const previousOrder = queryClient.getQueryData<SalesOrder>(salesOrderKeys.detail(id));

      // Update the detail cache directly (avoids a refetch round-trip)...
      queryClient.setQueryData(salesOrderKeys.detail(id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: salesOrderKeys.lists() });

      store.dispatch(
        auditEventLogged({
          id: `audit-${Date.now()}`,
          entity: "SalesOrder",
          entityId: id,
          action: "STATUS_CHANGED",
          occurredAt: new Date().toISOString(),
          previousState: previousOrder?.status,
          newState: updatedOrder.status,
        })
      );
    },
  });
}
