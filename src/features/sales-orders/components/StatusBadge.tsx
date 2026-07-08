import type { SalesOrderStatus } from "@/features/sales-orders/types";
import { STATUS_LABELS, STATUS_STYLES } from "@/features/sales-orders/constants";

export function StatusBadge({ status }: { status: SalesOrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
