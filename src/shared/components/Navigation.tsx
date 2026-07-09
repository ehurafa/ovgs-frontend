"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sales-orders", label: "Ordens de Venda" },
  { href: "/monitoring", label: "Monitoramento" },
  { href: "/scheduling", label: "Agendamento" },
  { href: "/customers", label: "Clientes" },
  { href: "/transport-types", label: "Tipos de Transporte" },
  { href: "/items", label: "Itens" },
  { href: "/audit", label: "Auditoria" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-outline/40 bg-surface border-b">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3">
        <Link href="/" className="text-on-surface mr-4 text-sm font-semibold whitespace-nowrap">
          OVGS
        </Link>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-muted hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
