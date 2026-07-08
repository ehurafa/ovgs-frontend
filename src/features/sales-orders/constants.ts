import type { SalesOrderStatus } from "./types";

export const STATUS_LABELS: Record<SalesOrderStatus, string> = {
  CRIADA: "Criada",
  PLANEJADA: "Planejada",
  AGENDADA: "Agendada",
  EM_TRANSPORTE: "Em transporte",
  ENTREGUE: "Entregue",
};

export const STATUS_STYLES: Record<SalesOrderStatus, string> = {
  CRIADA: "bg-gray-100 text-gray-700",
  PLANEJADA: "bg-blue-100 text-blue-700",
  AGENDADA: "bg-purple-100 text-purple-700",
  EM_TRANSPORTE: "bg-amber-100 text-amber-800",
  ENTREGUE: "bg-green-100 text-green-700",
};
