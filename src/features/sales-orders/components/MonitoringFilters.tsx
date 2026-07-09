"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  filtersChanged,
  filtersCleared,
} from "@/features/sales-orders/store/salesOrderFiltersSlice";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import { STATUS_LABELS } from "@/features/sales-orders/constants";
import type { SalesOrderStatus } from "@/features/sales-orders/types";
import { Select } from "@/shared/components/ui/Select";
import { TextField } from "@/shared/components/ui/TextField";
import { Button } from "@/shared/components/ui/Button";

const statusOptions = (Object.keys(STATUS_LABELS) as SalesOrderStatus[]).map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

export function MonitoringFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.salesOrderFilters);
  const { data: customers } = useCustomers();
  const { data: transportTypes } = useTransportTypes();

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      <Select
        id="filter-status"
        label="Status"
        placeholder="Todos os status"
        options={statusOptions}
        value={filters.status ?? ""}
        onChange={(e) =>
          dispatch(
            filtersChanged({
              status: (e.target.value || undefined) as SalesOrderStatus | undefined,
            })
          )
        }
      />

      <Select
        id="filter-customer"
        label="Cliente"
        placeholder="Todos os clientes"
        options={(customers ?? []).map((c) => ({ value: c.id, label: c.name }))}
        value={filters.customerId ?? ""}
        onChange={(e) => dispatch(filtersChanged({ customerId: e.target.value || undefined }))}
      />

      <Select
        id="filter-transport-type"
        label="Tipo de transporte"
        placeholder="Todos os transportes"
        options={(transportTypes ?? []).map((t) => ({ value: t.id, label: t.name }))}
        value={filters.transportTypeId ?? ""}
        onChange={(e) => dispatch(filtersChanged({ transportTypeId: e.target.value || undefined }))}
      />

      <div className="flex items-end gap-2">
        <TextField
          id="filter-date"
          label="Data de criação"
          type="date"
          value={filters.date ?? ""}
          onChange={(e) => dispatch(filtersChanged({ date: e.target.value || undefined }))}
        />
        <Button type="button" variant="text" onClick={() => dispatch(filtersCleared())}>
          Limpar
        </Button>
      </div>
    </div>
  );
}
