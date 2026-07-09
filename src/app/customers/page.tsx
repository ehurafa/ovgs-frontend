"use client";

import { useState } from "react";
import { CustomerForm } from "@/features/customers/components/CustomerForm";
import { CustomerList } from "@/features/customers/components/CustomerList";
import { Card } from "@/shared/components/ui/Card";
import type { Customer } from "@/features/customers/types";

export default function CustomersPage() {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Clientes</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
            {editingCustomer ? "Editar cliente" : "Novo cliente"}
          </h2>
          <CustomerForm customer={editingCustomer} onCancelEdit={() => setEditingCustomer(null)} />
        </Card>

        <Card>
          <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
            Cadastrados
          </h2>
          <CustomerList onEdit={setEditingCustomer} editingId={editingCustomer?.id} />
        </Card>
      </div>
    </main>
  );
}
