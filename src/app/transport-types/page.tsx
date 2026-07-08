"use client";

import { useState } from "react";
import { TransportTypeForm } from "@/features/transport-types/components/TransportTypeForm";
import { TransportTypeList } from "@/features/transport-types/components/TransportTypeList";
import { Card } from "@/shared/components/ui/Card";
import type { TransportType } from "@/features/transport-types/types";

export default function TransportTypesPage() {
  const [editingTransportType, setEditingTransportType] = useState<TransportType | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Tipos de transporte</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
            {editingTransportType ? "Editar tipo de transporte" : "Novo tipo de transporte"}
          </h2>
          <TransportTypeForm
            transportType={editingTransportType}
            onCancelEdit={() => setEditingTransportType(null)}
          />
        </Card>

        <Card>
          <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
            Cadastrados
          </h2>
          <TransportTypeList
            onEdit={setEditingTransportType}
            editingId={editingTransportType?.id}
          />
        </Card>
      </div>
    </main>
  );
}
