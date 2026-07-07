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

export interface TransportType {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  document: string;
  authorizedTransportTypeIds: TransportType["id"][];
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  unit?: string;
}

export interface SalesOrderItem {
  itemId: Item["id"];
  quantity: number;
}

/**
 * Fixed service windows, simplifying real-world availability rules
 * as permitted by the challenge scope.
 */
export type DeliveryWindow = "MANHA" | "TARDE" | "NOITE";

export interface DeliveryScheduling {
  deliveryDate: string;
  window: DeliveryWindow;
  confirmed: boolean;
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

/**
 * Audit event, mirrors backend traceability requirements
 * so the frontend can render a consistent history view.
 */
export interface AuditEvent {
  id: string;
  entity: "SalesOrder" | "Scheduling" | "TransportType" | "Customer";
  entityId: string;
  action: "CREATED" | "STATUS_CHANGED" | "SCHEDULING_CHANGED" | "TRANSPORT_CHANGED";
  occurredAt: string; // ISO datetime
  previousState?: unknown;
  newState?: unknown;
}
