import { SalesOrderDetail } from "@/features/sales-orders/components/SalesOrderDetail";
import { Card } from "@/shared/components/ui/Card";

export default async function SalesOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Card>
        <SalesOrderDetail id={id} />
      </Card>
    </main>
  );
}
