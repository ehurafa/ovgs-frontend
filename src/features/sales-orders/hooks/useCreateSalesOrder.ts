import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesOrdersService } from "@/features/sales-orders/services/salesOrdersService";
import { salesOrderKeys } from "@/features/sales-orders/services/queryKeys";

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesOrdersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesOrderKeys.lists() });
    },
  });
};
