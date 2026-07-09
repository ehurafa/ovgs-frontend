"use client";

import Link from "next/link";
import { useSalesOrders } from "@/features/sales-orders/hooks/useSalesOrders";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import { StatusBadge } from "./StatusBadge";
import type { SalesOrderFilters } from "@/features/sales-orders/services/salesOrdersService";

interface SalesOrdersListProps {
  filters?: SalesOrderFilters;
}

export function SalesOrdersList({ filters = {} }: SalesOrdersListProps) {
  const { data: salesOrders, isLoading } = useSalesOrders(filters);
  const { data: customers } = useCustomers();
  const { data: transportTypes } = useTransportTypes();

  if (isLoading) {
    return <p className="text-on-surface-muted text-sm">Carregando ordens de venda…</p>;
  }

  if (!salesOrders || salesOrders.length === 0) {
    return (
      <p className="text-on-surface-muted text-sm">
        Nenhuma ordem de venda encontrada para os filtros selecionados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-outline/40 text-on-surface-muted border-b text-xs uppercase">
            <th className="py-2 pr-4">Cliente</th>
            <th className="py-2 pr-4">Transporte</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Criada em</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {salesOrders.map((order) => {
            const customer = customers?.find((c) => c.id === order.customerId);
            const transportType = transportTypes?.find((t) => t.id === order.transportTypeId);

            return (
              <tr key={order.id} className="border-outline/20 border-b">
                <td className="text-on-surface py-3 pr-4">{customer?.name ?? order.customerId}</td>
                <td className="text-on-surface py-3 pr-4">
                  {transportType?.name ?? order.transportTypeId}
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="text-on-surface-muted py-3 pr-4">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="py-3">
                  <Link
                    href={`/sales-orders/${order.id}`}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
