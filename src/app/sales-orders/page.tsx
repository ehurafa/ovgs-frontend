import { SalesOrdersList } from "@/features/sales-orders/components/SalesOrdersList";
import { Card } from "@/shared/components/ui/Card";
import { LinkButton } from "@/shared/components/ui/Button";

export default function SalesOrdersPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-on-surface text-xl font-semibold">Ordens de venda</h1>
        <LinkButton href="/sales-orders/new">+ Nova ordem de venda</LinkButton>
      </div>
      <Card>
        <SalesOrdersList />
      </Card>
    </main>
  );
}
