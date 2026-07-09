import { LinkButton } from "@/shared/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md text-center">
        <h1 className="text-on-surface text-4xl font-semibold">
          Sistema de Gestão de Ordens de Venda
        </h1>
        <p className="text-on-surface-muted mt-3 text-sm">
          Gerencie o ciclo completo das ordens de venda, do cadastro à entrega.
        </p>
        <LinkButton href="/sales-orders/new" className="mt-8">
          Nova Ordem de Venda
        </LinkButton>
      </div>
    </main>
  );
}
