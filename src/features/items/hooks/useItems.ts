import { useQuery } from "@tanstack/react-query";
import { itemsService } from "@/features/items/services/itemsService";
import { itemKeys } from "@/features/items/services/queryKeys";

export function useItems() {
  return useQuery({
    queryKey: itemKeys.lists(),
    queryFn: itemsService.list,
  });
}
