import { useQuery } from "@tanstack/react-query";
import { transportTypesService } from "@/features/transport-types/services/transportTypesService";
import { transportTypeKeys } from "@/features/transport-types/services/queryKeys";

export function useTransportTypes() {
  return useQuery({
    queryKey: transportTypeKeys.lists(),
    queryFn: transportTypesService.list,
  });
}
