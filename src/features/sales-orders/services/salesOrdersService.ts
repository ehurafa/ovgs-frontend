import { httpClient } from "@/lib/api/httpClient";
import type { SalesOrder, SalesOrderStatus } from "@/features/sales-orders/types";
import type { CreateSalesOrderInput } from "@/features/sales-orders/schemas";

export interface SalesOrderFilters {
  status?: SalesOrderStatus;
  customerId?: string;
  transportTypeId?: string;
  /** ISO date (YYYY-MM-DD); matches orders created on that day. */
  date?: string;
}

function toQueryString(filters: SalesOrderFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.customerId) params.set("customerId", filters.customerId);
  if (filters.transportTypeId) params.set("transportTypeId", filters.transportTypeId);
  if (filters.date) params.set("date", filters.date);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const salesOrdersService = {
  list: (filters: SalesOrderFilters = {}) =>
    httpClient.get<SalesOrder[]>(`/sales-orders${toQueryString(filters)}`),

  getById: (id: string) => httpClient.get<SalesOrder>(`/sales-orders/${id}`),

  create: (input: CreateSalesOrderInput) => httpClient.post<SalesOrder>("/sales-orders", input),

  updateStatus: (id: string, status: SalesOrderStatus) =>
    httpClient.patch<SalesOrder>(`/sales-orders/${id}/status`, { status }),
};
