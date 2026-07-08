"use client";

import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import type { TransportType } from "@/features/transport-types/types";
import { Button } from "@/shared/components/ui/Button";

interface TransportTypeListProps {
  onEdit: (transportType: TransportType) => void;
  editingId?: string;
}

export function TransportTypeList({ onEdit, editingId }: TransportTypeListProps) {
  const { data: transportTypes, isLoading } = useTransportTypes();

  if (isLoading) {
    return <p className="text-on-surface-muted text-sm">Carregando tipos de transporte…</p>;
  }

  if (!transportTypes || transportTypes.length === 0) {
    return (
      <p className="text-on-surface-muted text-sm">Nenhum tipo de transporte cadastrado ainda.</p>
    );
  }

  return (
    <ul className="divide-outline/40 divide-y">
      {transportTypes.map((transportType) => (
        <li key={transportType.id} className="flex items-center justify-between py-3">
          <span className="text-on-surface text-sm">{transportType.name}</span>
          <Button
            type="button"
            variant="text"
            onClick={() => onEdit(transportType)}
            disabled={editingId === transportType.id}
          >
            {editingId === transportType.id ? "Editando…" : "Editar"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
