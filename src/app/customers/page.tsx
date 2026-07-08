import { CustomerForm } from "@/features/customers/components/CustomerForm";
import { Card } from "@/shared/components/ui/Card";

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Novo cliente</h1>
      <Card>
        <CustomerForm />
      </Card>
    </main>
  );
}
