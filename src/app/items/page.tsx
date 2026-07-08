import { ItemForm } from "@/features/items/components/ItemForm";
import { Card } from "@/shared/components/ui/Card";

export default function ItemsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Novo item</h1>
      <Card>
        <ItemForm />
      </Card>
    </main>
  );
}
