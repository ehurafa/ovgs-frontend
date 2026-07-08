import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transportTypesService } from "@/features/transport-types/services/transportTypesService";
import { transportTypeKeys } from "@/features/transport-types/services/queryKeys";
import type { CreateTransportTypeInput } from "@/features/transport-types/schemas";

export function useUpdateTransportType(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransportTypeInput) => transportTypesService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.lists() });
    },
  });
}
