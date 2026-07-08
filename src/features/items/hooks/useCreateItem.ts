import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsService } from "@/features/items/services/itemsService";
import { itemKeys } from "@/features/items/services/queryKeys";

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
};
