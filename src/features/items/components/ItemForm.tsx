"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createItemSchema, type CreateItemInput } from "@/features/items/schemas";
import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import { TextField } from "@/shared/components/ui/TextField";
import { Button } from "@/shared/components/ui/Button";

export function ItemForm() {
  const [justCreated, setJustCreated] = useState(false);
  const createItem = useCreateItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: { sku: "", name: "", unit: "" },
  });

  const onSubmit = handleSubmit((data) => {
    setJustCreated(false);
    createItem.mutate(data, {
      onSuccess: () => {
        reset();
        setJustCreated(true);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5" noValidate>
      <TextField id="sku" label="SKU" {...register("sku")} error={errors.sku?.message} />

      <TextField
        id="name"
        label="Nome do item"
        {...register("name")}
        error={errors.name?.message}
      />

      <TextField
        id="unit"
        label="Unidade (opcional)"
        placeholder="un, kg, cx..."
        {...register("unit")}
        error={errors.unit?.message}
      />

      {createItem.isError && (
        <p className="text-error text-sm" role="alert">
          Não foi possível salvar este item: {createItem.error.message}
        </p>
      )}

      {justCreated && (
        <p className="text-sm text-green-700" role="status">
          Item cadastrado.
        </p>
      )}

      <Button type="submit" disabled={createItem.isPending}>
        {createItem.isPending ? "Salvando…" : "Salvar item"}
      </Button>
    </form>
  );
}
