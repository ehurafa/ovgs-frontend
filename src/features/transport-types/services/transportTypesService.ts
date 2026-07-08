import { httpClient } from "@/lib/api/httpClient";
import type { TransportType } from "@/features/transport-types/types";
import type { CreateTransportTypeInput } from "@/features/transport-types/schemas";

export const transportTypesService = {
  list: () => httpClient.get<TransportType[]>("/transport-types"),
  create: (input: CreateTransportTypeInput) =>
    httpClient.post<TransportType>("/transport-types", input),
  update: (id: string, input: CreateTransportTypeInput) =>
    httpClient.patch<TransportType>(`/transport-types/${id}`, input),
};
