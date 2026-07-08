import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transportTypesService } from "@/features/transport-types/services/transportTypesService";
import { transportTypeKeys } from "@/features/transport-types/services/queryKeys";

export function useCreateTransportType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transportTypesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.lists() });
    },
  });
};
