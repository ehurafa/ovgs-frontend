import type { TransportType } from "@/features/transport-types/types";

export interface Customer {
  id: string;
  name: string;
  document: string; // CNPJ/CPF
  authorizedTransportTypeIds: TransportType["id"][];
}