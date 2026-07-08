"use client";

import { useState } from "react";
import Link from "next/link";
import { useSalesOrder } from "@/features/sales-orders/hooks/useSalesOrder";
import { useUpdateSalesOrderStatus } from "@/features/sales-orders/hooks/useUpdateSalesOrderStatus";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import { useItems } from "@/features/items/hooks/useItems";
import { VALID_STATUS_TRANSITIONS, type SalesOrderStatus } from "@/features/sales-orders/types";
import { STATUS_LABELS } from "@/features/sales-orders/constants";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/shared/components/ui/Button";

export function SalesOrderDetail({ id }: { id: string }) {
  const [transitionError, setTransitionError] = useState<string | null>(null);

  const { data: order, isLoading, error } = useSalesOrder(id);
  const { data: customers } = useCustomers();
  const { data: transportTypes } = useTransportTypes();
  const { data: items } = useItems();
  const updateStatus = useUpdateSalesOrderStatus(id);

  if (isLoading) {
    return <p className="text-on-surface-muted text-sm">Carregando ordem de venda…</p>;
  }

  if (error || !order) {
    return <p className="text-error text-sm">Ordem de venda não encontrada.</p>;
  }

  const customer = customers?.find((c) => c.id === order.customerId);
  const transportType = transportTypes?.find((t) => t.id === order.transportTypeId);
  // A UI só oferece transições válidas — a mesma fonte de verdade
  // (VALID_STATUS_TRANSITIONS) que valida isso no mock da API.
  const nextStatuses = VALID_STATUS_TRANSITIONS[order.status];

  function handleTransition(nextStatus: SalesOrderStatus) {
    setTransitionError(null);
    updateStatus.mutate(nextStatus, {
      onError: (err) => setTransitionError(err.message),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-on-surface text-lg font-semibold">Ordem de venda #{order.id}</h2>
        <StatusBadge status={order.status} />
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-on-surface-muted">Cliente</dt>
          <dd className="text-on-surface">{customer?.name ?? order.customerId}</dd>
        </div>
        <div>
          <dt className="text-on-surface-muted">Transporte</dt>
          <dd className="text-on-surface">{transportType?.name ?? order.transportTypeId}</dd>
        </div>
        <div>
          <dt className="text-on-surface-muted">Criada em</dt>
          <dd className="text-on-surface">{new Date(order.createdAt).toLocaleString("pt-BR")}</dd>
        </div>
        <div>
          <dt className="text-on-surface-muted">Atualizada em</dt>
          <dd className="text-on-surface">{new Date(order.updatedAt).toLocaleString("pt-BR")}</dd>
        </div>
      </dl>

      <div>
        <h3 className="text-on-surface mb-2 text-sm font-semibold">Itens</h3>
        <ul className="divide-outline/40 divide-y text-sm">
          {order.items.map((orderItem) => {
            const item = items?.find((i) => i.id === orderItem.itemId);
            return (
              <li key={orderItem.itemId} className="flex justify-between py-2">
                <span className="text-on-surface">
                  {item ? `${item.sku} - ${item.name}` : orderItem.itemId}
                </span>
                <span className="text-on-surface-muted">Qtd: {orderItem.quantity}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="text-on-surface mb-2 text-sm font-semibold">Avançar status</h3>

        {nextStatuses.length === 0 ? (
          <p className="text-on-surface-muted text-sm">
            Esta ordem de venda já está no status final.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                type="button"
                onClick={() => handleTransition(status)}
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? "Atualizando…" : `Marcar como ${STATUS_LABELS[status]}`}
              </Button>
            ))}
          </div>
        )}

        {transitionError && (
          <p className="text-error mt-2 text-sm" role="alert">
            {transitionError}
          </p>
        )}
      </div>

      <Link href="/sales-orders" className="text-primary text-sm font-medium hover:underline">
        ← Voltar para a lista
      </Link>
    </div>
  );
}
