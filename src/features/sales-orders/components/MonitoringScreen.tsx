"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { MonitoringFilters } from "./MonitoringFilters";
import { SalesOrdersList } from "./SalesOrdersList";

export function MonitoringScreen() {
  const filters = useAppSelector((state) => state.salesOrderFilters);

  return (
    <>
      <MonitoringFilters />
      <SalesOrdersList filters={filters} />
    </>
  );
}
