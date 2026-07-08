import { SalesOrderForm } from "@/features/sales-orders/components/SalesOrderForm";
import { Card } from "@/shared/components/ui/Card";

export default function NewSalesOrderPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Nova ordem de venda</h1>
      <Card>
        <SalesOrderForm />
      </Card>
    </main>
  );
}
