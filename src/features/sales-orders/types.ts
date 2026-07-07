import type { Customer } from "@/features/customers/types";
import type { TransportType } from "@/features/transport-types/types";
import type { Item } from "@/features/items/types";
import type { DeliveryScheduling } from "@/features/scheduling/types";

/**
 * Sales Order lifecycle statuses.
 * Modeled as a union type (not `enum`) to avoid unnecessary runtime
 * artifacts and to integrate cleanly with Zod schema validation.
 */
export type SalesOrderStatus =
  | "CRIADA"
  | "PLANEJADA"
  | "AGENDADA"
  | "EM_TRANSPORTE"
  | "ENTREGUE";

/**
 * Defines which status transitions are valid.
 * Used by both UI (disabling invalid actions) and any client-side
 * guard before dispatching a status update.
 */
export const VALID_STATUS_TRANSITIONS: Record<SalesOrderStatus, SalesOrderStatus[]> = {
  CRIADA: ["PLANEJADA"],
  PLANEJADA: ["AGENDADA"],
  AGENDADA: ["EM_TRANSPORTE"],
  EM_TRANSPORTE: ["ENTREGUE"],
  ENTREGUE: [],
};

export interface SalesOrderItem {
  itemId: Item["id"];
  quantity: number;
}

export interface SalesOrder {
  id: string;
  customerId: Customer["id"];
  transportTypeId: TransportType["id"];
  items: SalesOrderItem[];
  status: SalesOrderStatus;
  scheduling?: DeliveryScheduling;
  createdAt: string;
  updatedAt: string;
}
