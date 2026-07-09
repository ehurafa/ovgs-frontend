"use client";

import { useAppSelector } from "@/lib/store/hooks";
import type { AuditEvent } from "@/shared/types";

const ENTITY_LABELS: Record<AuditEvent["entity"], string> = {
  SalesOrder: "Ordem de Venda",
  Scheduling: "Agendamento",
  TransportType: "Tipo de Transporte",
  Customer: "Cliente",
};

const ACTION_LABELS: Record<AuditEvent["action"], string> = {
  CREATED: "Criação",
  STATUS_CHANGED: "Alteração de status",
  SCHEDULING_CHANGED: "Alteração de agendamento",
  TRANSPORT_CHANGED: "Alteração de transporte",
};

function formatState(value: unknown): string {
  if (value === undefined || value === null) return "-";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export function AuditTrail() {
  // auditSlice.unshift()s new events, so this is already most-recent-first.
  const events = useAppSelector((state) => state.audit.events);

  if (events.length === 0) {
    return (
      <p className="text-on-surface-muted text-sm">Nenhum evento de auditoria registrado ainda.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-outline/40 text-on-surface-muted border-b text-xs uppercase">
            <th className="py-2 pr-4">Quando</th>
            <th className="py-2 pr-4">Entidade</th>
            <th className="py-2 pr-4">Ação</th>
            <th className="py-2 pr-4">De</th>
            <th className="py-2">Para</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-outline/20 border-b">
              <td className="text-on-surface-muted py-3 pr-4">
                {new Date(event.occurredAt).toLocaleString("pt-BR")}
              </td>
              <td className="text-on-surface py-3 pr-4">
                {ENTITY_LABELS[event.entity]}{" "}
                <span className="text-on-surface-muted">({event.entityId})</span>
              </td>
              <td className="text-on-surface py-3 pr-4">{ACTION_LABELS[event.action]}</td>
              <td className="text-on-surface-muted py-3 pr-4">
                {formatState(event.previousState)}
              </td>
              <td className="text-on-surface py-3">{formatState(event.newState)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
