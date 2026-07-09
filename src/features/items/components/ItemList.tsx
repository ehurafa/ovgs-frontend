"use client";

import { useItems } from "@/features/items/hooks/useItems";

export function ItemList() {
  const { data: items, isLoading } = useItems();

  if (isLoading) {
    return <p className="text-on-surface-muted text-sm">Carregando itens…</p>;
  }

  if (!items || items.length === 0) {
    return <p className="text-on-surface-muted text-sm">Nenhum item cadastrado ainda.</p>;
  }

  return (
    <ul className="divide-outline/40 divide-y">
      {items.map((item) => (
        <li key={item.id} className="py-3">
          <p className="text-on-surface text-sm font-medium">{item.name}</p>
          <p className="text-on-surface-muted text-xs">
            SKU: {item.sku}
            {item.unit && ` · Unidade: ${item.unit}`}
          </p>
        </li>
      ))}
    </ul>
  );
}
