import { CustomerForm } from "@/features/customers/components/CustomerForm";

export default function CustomersPage() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Novo cliente</h1>
      <CustomerForm />
    </main>
  );
}
