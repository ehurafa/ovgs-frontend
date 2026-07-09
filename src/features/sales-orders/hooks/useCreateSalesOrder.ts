import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesOrdersService } from "@/features/sales-orders/services/salesOrdersService";
import { salesOrderKeys } from "@/features/sales-orders/services/queryKeys";
import { store } from "@/lib/store/store";
import { auditEventLogged } from "@/shared/store/auditSlice";

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesOrdersService.create,
    onSuccess: (createdOrder) => {
      queryClient.invalidateQueries({ queryKey: salesOrderKeys.lists() });

      store.dispatch(
        auditEventLogged({
          id: `audit-${Date.now()}`,
          entity: "SalesOrder",
          entityId: createdOrder.id,
          action: "CREATED",
          occurredAt: new Date().toISOString(),
          newState: createdOrder,
        })
      );
    },
  });
}
