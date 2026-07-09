import Link from "next/link";
import { Card } from "@/shared/components/ui/Card";

const sections = [
  {
    href: "/sales-orders",
    title: "Ordens de Venda",
    description: "Criar, consultar e acompanhar o status das ordens de venda.",
  },
  {
    href: "/monitoring",
    title: "Monitoramento Operacional",
    description: "Consultar ordens de venda com filtros por status, cliente, transporte e data.",
  },
  {
    href: "/scheduling",
    title: "Central de Agendamento",
    description: "Confirmar e reagendar entregas das ordens planejadas.",
  },
  {
    href: "/customers",
    title: "Clientes",
    description: "Cadastrar, editar e consultar clientes e seus transportes autorizados.",
  },
  {
    href: "/transport-types",
    title: "Tipos de Transporte",
    description: "Cadastrar, editar e consultar os tipos de transporte disponíveis.",
  },
  {
    href: "/items",
    title: "Itens",
    description: "Cadastrar e consultar os itens disponíveis para as ordens de venda.",
  },
  {
    href: "/audit",
    title: "Auditoria",
    description: "Consultar a trilha de eventos registrados no sistema.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-on-surface text-2xl font-semibold">
          Sistema de Gestão de Ordens de Venda
        </h1>
        <p className="text-on-surface-muted mt-2 text-sm">Escolha uma área para começar.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="block">
              <Card className="h-full transition-shadow hover:shadow-md">
                <h2 className="text-on-surface text-base font-semibold">{section.title}</h2>
                <p className="text-on-surface-muted mt-1 text-sm">{section.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
