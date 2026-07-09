import { http, HttpResponse } from "msw";
import { customers, transportTypes, items, salesOrders } from "./data";
import {
  VALID_STATUS_TRANSITIONS,
  type SalesOrderStatus,
  type SalesOrder,
} from "@/features/sales-orders/types";
import type { CreateCustomerInput } from "@/features/customers/schemas";
import type { CreateTransportTypeInput } from "@/features/transport-types/schemas";
import type { CreateItemInput } from "@/features/items/schemas";
import type { CreateSalesOrderInput } from "@/features/sales-orders/schemas";

const BASE = "/api";

export const handlers = [
  // --- Customers ---
  http.get(`${BASE}/customers`, () => HttpResponse.json(customers)),

  http.post(`${BASE}/customers`, async ({ request }) => {
    const body = (await request.json()) as CreateCustomerInput;
    const created = { id: `cust-${customers.length + 1}`, ...body };
    customers.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  // --- Transport Types ---
  http.get(`${BASE}/transport-types`, () => HttpResponse.json(transportTypes)),

  http.post(`${BASE}/transport-types`, async ({ request }) => {
    const body = (await request.json()) as CreateTransportTypeInput;
    const created = { id: `tt-${transportTypes.length + 1}`, ...body };
    transportTypes.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${BASE}/transport-types/:id`, async ({ params, request }) => {
    const transportType = transportTypes.find((t) => t.id === params.id);
    if (!transportType) {
      return HttpResponse.json({ message: "Transport type not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateTransportTypeInput;
    Object.assign(transportType, body);
    return HttpResponse.json(transportType);
  }),

  // --- Items ---
  http.get(`${BASE}/items`, () => HttpResponse.json(items)),

  http.post(`${BASE}/items`, async ({ request }) => {
    const body = (await request.json()) as CreateItemInput;
    const created = { id: `item-${items.length + 1}`, ...body };
    items.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  // --- Sales Orders ---
  http.get(`${BASE}/sales-orders`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const customerId = url.searchParams.get("customerId");
    const transportTypeId = url.searchParams.get("transportTypeId");
    const date = url.searchParams.get("date");

    const filtered = salesOrders.filter((order) => {
      if (status && order.status !== status) return false;
      if (customerId && order.customerId !== customerId) return false;
      if (transportTypeId && order.transportTypeId !== transportTypeId) return false;
      if (date && !order.createdAt.startsWith(date)) return false;
      return true;
    });

    return HttpResponse.json(filtered);
  }),

  http.get(`${BASE}/sales-orders/:id`, ({ params }) => {
    const order = salesOrders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Sales order not found" }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/sales-orders`, async ({ request }) => {
    const body = (await request.json()) as CreateSalesOrderInput;
    const now = new Date().toISOString();
    const created = {
      id: `so-${salesOrders.length + 1}`,
      status: "CRIADA" as SalesOrderStatus,
      createdAt: now,
      updatedAt: now,
      ...body,
    };
    salesOrders.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  // Simulates real API-side guard against invalid transitions —
  // useful for integration tests that exercise error handling.
  http.patch(`${BASE}/sales-orders/:id/status`, async ({ params, request }) => {
    const order = salesOrders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Sales order not found" }, { status: 404 });

    const { status: nextStatus } = (await request.json()) as { status: SalesOrderStatus };
    const allowedNext = VALID_STATUS_TRANSITIONS[order.status];

    if (!allowedNext.includes(nextStatus)) {
      return HttpResponse.json(
        { message: `Invalid transition from ${order.status} to ${nextStatus}` },
        { status: 400 }
      );
    }

    order.status = nextStatus;
    order.updatedAt = new Date().toISOString();
    return HttpResponse.json(order);
  }),

  // Confirms (or reschedules) delivery scheduling for an order.
  // Allowed from PLANEJADA (first confirmation) or AGENDADA (reschedule).
  http.patch(`${BASE}/sales-orders/:id/scheduling`, async ({ params, request }) => {
    const order = salesOrders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Sales order not found" }, { status: 404 });

    const isReschedule = order.status === "AGENDADA";
    if (order.status !== "PLANEJADA" && !isReschedule) {
      return HttpResponse.json(
        { message: `Scheduling cannot be set while order is ${order.status}` },
        { status: 400 }
      );
    }

    const body = (await request.json()) as { deliveryDate: string; window: string };
    order.scheduling = { ...body, confirmed: true } as SalesOrder["scheduling"];
    order.status = "AGENDADA";
    order.updatedAt = new Date().toISOString();
    return HttpResponse.json(order);
  }),
];
