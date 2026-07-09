"use client";

import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import type { Customer } from "@/features/customers/types";
import { Button } from "@/shared/components/ui/Button";

interface CustomerListProps {
  onEdit: (customer: Customer) => void;
  editingId?: string;
}

export function CustomerList({ onEdit, editingId }: CustomerListProps) {
  const { data: customers, isLoading } = useCustomers();
  const { data: transportTypes } = useTransportTypes();

  if (isLoading) {
    return <p className="text-on-surface-muted text-sm">Carregando clientes…</p>;
  }

  if (!customers || customers.length === 0) {
    return <p className="text-on-surface-muted text-sm">Nenhum cliente cadastrado ainda.</p>;
  }

  return (
    <ul className="divide-outline/40 divide-y">
      {customers.map((customer) => {
        const authorizedNames = customer.authorizedTransportTypeIds
          .map((id) => transportTypes?.find((t) => t.id === id)?.name)
          .filter(Boolean)
          .join(", ");

        return (
          <li key={customer.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-on-surface text-sm font-medium">{customer.name}</p>
              <p className="text-on-surface-muted text-xs">{customer.document}</p>
              {authorizedNames && (
                <p className="text-on-surface-muted mt-0.5 text-xs">
                  Transportes: {authorizedNames}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="text"
              onClick={() => onEdit(customer)}
              disabled={editingId === customer.id}
            >
              {editingId === customer.id ? "Editando…" : "Editar"}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
