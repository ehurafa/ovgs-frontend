import { useQuery } from "@tanstack/react-query";
import { customersService } from "@/features/customers/services/customersService";
import { customerKeys } from "@/features/customers/services/queryKeys";

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: customersService.list,
  });
}
