import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customersService } from "@/features/customers/services/customersService";
import { customerKeys } from "@/features/customers/services/queryKeys";
import type { CreateCustomerInput } from "@/features/customers/schemas";

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCustomerInput) => customersService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
