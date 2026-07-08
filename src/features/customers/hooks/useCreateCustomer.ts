import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customersService } from "@/features/customers/services/customersService";
import { customerKeys } from "@/features/customers/services/queryKeys";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};
