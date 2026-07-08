import { httpClient } from "@/lib/api/httpClient";
import type { SalesOrder } from "@/features/sales-orders/types";
import type { SchedulingInput } from "@/features/scheduling/schemas";

export const schedulingService = {
  confirm: (orderId: string, input: SchedulingInput) =>
    httpClient.patch<SalesOrder>(`/sales-orders/${orderId}/scheduling`, input),
};
