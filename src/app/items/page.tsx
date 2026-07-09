import { ItemForm } from "@/features/items/components/ItemForm";
import { ItemList } from "@/features/items/components/ItemList";
import { Card } from "@/shared/components/ui/Card";

export default function ItemsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Itens</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
            Novo item
          </h2>
          <ItemForm />
        </Card>

        <Card>
          <h2 className="text-on-surface mb-4 text-sm font-semibold tracking-wide uppercase">
            Cadastrados
          </h2>
          <ItemList />
        </Card>
      </div>
    </main>
  );
}
