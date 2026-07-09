"use client";

import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);
  const linkClassName = (href: string) =>
    `rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
      isActive(href)
        ? "bg-primary text-on-primary"
        : "text-on-surface-muted hover:bg-primary/10 hover:text-primary"
    }`;

  return (
    <nav className="border-outline/40 bg-surface border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-on-surface mr-4 text-sm font-semibold whitespace-nowrap"
        >
          OVGS
        </Link>

        {/* Desktop: full horizontal link list, md and up */}
        <div className="hidden items-center gap-1 overflow-x-auto md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName(link.href)}>
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          className="text-on-surface flex h-9 w-9 items-center justify-center rounded-md md:hidden"
        >
          {isOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile: expanded link list, stacked vertically, below md */}
      {isOpen && (
        <div className="border-outline/40 flex flex-col gap-1 border-t px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-muted hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
