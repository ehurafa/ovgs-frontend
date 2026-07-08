import Link from "next/link";
import { SalesOrdersList } from "@/features/sales-orders/components/SalesOrdersList";
import { Card } from "@/shared/components/ui/Card";

export default function SalesOrdersPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-on-surface text-xl font-semibold">Ordens de venda</h1>
        <Link
          href="/sales-orders/new"
          className="bg-primary text-on-primary hover:bg-primary-dark inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium shadow-sm transition-all hover:shadow-md"
        >
          + Nova ordem de venda
        </Link>
      </div>
      <Card>
        <SalesOrdersList />
      </Card>
    </main>
  );
}
