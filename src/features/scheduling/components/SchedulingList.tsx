"use client";

import { useState } from "react";
import { useSalesOrders } from "@/features/sales-orders/hooks/useSalesOrders";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { StatusBadge } from "@/features/sales-orders/components/StatusBadge";
import { Button } from "@/shared/components/ui/Button";
import { SchedulingForm } from "./SchedulingForm";
import type { SalesOrder } from "@/features/sales-orders/types";

export function SchedulingList() {
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const { data: salesOrders, isLoading } = useSalesOrders();
  const { data: customers } = useCustomers();

  const eligibleOrders = (salesOrders ?? []).filter(
    (order) => order.status === "PLANEJADA" || order.status === "AGENDADA"
  );

  if (isLoading) {
    return <p className="text-on-surface-muted text-sm">Carregando ordens de venda…</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
          Ordens elegíveis para agendamento
        </h2>

        {eligibleOrders.length === 0 ? (
          <p className="text-on-surface-muted text-sm">
            Nenhuma ordem de venda planejada ou agendada no momento.
          </p>
        ) : (
          <ul className="divide-outline/40 divide-y">
            {eligibleOrders.map((order) => {
              const customer = customers?.find((c) => c.id === order.customerId);
              return (
                <li key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-on-surface text-sm font-medium">
                      {customer?.name ?? order.customerId}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={order.status} />
                      {order.scheduling && (
                        <span className="text-on-surface-muted text-xs">
                          {order.scheduling.deliveryDate} · {order.scheduling.window}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button type="button" variant="text" onClick={() => setSelectedOrder(order)}>
                    {order.status === "AGENDADA" ? "Reagendar" : "Agendar"}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
          {selectedOrder ? "Agendamento" : "Selecione uma ordem ao lado"}
        </h2>
        {selectedOrder && (
          <SchedulingForm order={selectedOrder} onDone={() => setSelectedOrder(null)} />
        )}
      </div>
    </div>
  );
}
