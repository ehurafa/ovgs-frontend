import type { Customer } from "@/features/customers/types";
import type { TransportType } from "@/features/transport-types/types";
import type { Item } from "@/features/items/types";
import type { SalesOrder } from "@/features/sales-orders/types";

/**
 * In-memory fixtures. Mutated directly by the handlers to simulate
 * persistence across requests during a browser session.
 * Resets on every page reload — acceptable for this challenge's scope.
 */

export const transportTypes: TransportType[] = [
  { id: "tt-1", name: "Caminhão" },
  { id: "tt-2", name: "Carreta" },
  { id: "tt-3", name: "Bi-truck" },
];

export const customers: Customer[] = [
  {
    id: "cust-1",
    name: "Distribuidora Central",
    document: "12.345.678/0001-90",
    authorizedTransportTypeIds: ["tt-1", "tt-2"],
  },
  {
    id: "cust-2",
    name: "Comércio Real Ltda",
    document: "98.765.432/0001-10",
    authorizedTransportTypeIds: ["tt-3"],
  },
];

export const items: Item[] = [
  { id: "item-1", sku: "SKU-001", name: "Caixa de parafusos", unit: "cx" },
  { id: "item-2", sku: "SKU-002", name: "Chapa de aço", unit: "un" },
];

export const salesOrders: SalesOrder[] = [
  {
    id: "so-1",
    customerId: "cust-1",
    transportTypeId: "tt-1",
    items: [{ itemId: "item-1", quantity: 10 }],
    status: "CRIADA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
