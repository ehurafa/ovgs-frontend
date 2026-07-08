"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSalesOrderSchema,
  type CreateSalesOrderInput,
} from "@/features/sales-orders/schemas";
import { useCreateSalesOrder } from "@/features/sales-orders/hooks/useCreateSalesOrder";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import { useItems } from "@/features/items/hooks/useItems";
import { Select } from "@/shared/components/ui/Select";
import { TextField } from "@/shared/components/ui/TextField";
import { Button } from "@/shared/components/ui/Button";

const emptyOrder: CreateSalesOrderInput = {
  customerId: "",
  transportTypeId: "",
  items: [{ itemId: "", quantity: 1 }],
};

export function SalesOrderForm() {
  const [justCreated, setJustCreated] = useState(false);
  const [businessRuleError, setBusinessRuleError] = useState<string | null>(null);

  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const { data: transportTypes } = useTransportTypes();
  const { data: items, isLoading: isLoadingItems } = useItems();
  const createSalesOrder = useCreateSalesOrder();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSalesOrderInput>({
    resolver: zodResolver(createSalesOrderSchema),
    defaultValues: emptyOrder,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const selectedCustomerId = watch("customerId");
  const selectedItems = watch("items");
  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);

  const availableTransportTypes = selectedCustomer
    ? (transportTypes ?? []).filter((t) =>
        selectedCustomer.authorizedTransportTypeIds.includes(t.id)
      )
    : [];

  const onSubmit = handleSubmit((data) => {
    setBusinessRuleError(null);
    setJustCreated(false);

    const customer = customers?.find((c) => c.id === data.customerId);
    if (!customer?.authorizedTransportTypeIds.includes(data.transportTypeId)) {
      setBusinessRuleError(
        "Este tipo de transporte não está autorizado para o cliente selecionado."
      );
      return;
    }

    createSalesOrder.mutate(data, {
      onSuccess: () => {
        reset(emptyOrder);
        setJustCreated(true);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6" noValidate>
      <Select
        id="customerId"
        label="Cliente"
        placeholder={isLoadingCustomers ? "Carregando clientes…" : "Selecione um cliente"}
        options={(customers ?? []).map((customer) => ({
          value: customer.id,
          label: customer.name,
        }))}
        error={errors.customerId?.message}
        {...register("customerId", {
          onChange: () => setValue("transportTypeId", ""), // transporte anterior pode não ser mais válido
        })}
      />

      <Select
        id="transportTypeId"
        label="Tipo de transporte"
        placeholder={
          !selectedCustomerId
            ? "Selecione um cliente primeiro"
            : availableTransportTypes.length === 0
              ? "Nenhum transporte autorizado para este cliente"
              : "Selecione um tipo de transporte"
        }
        options={availableTransportTypes.map((t) => ({ value: t.id, label: t.name }))}
        disabled={!selectedCustomerId || availableTransportTypes.length === 0}
        error={errors.transportTypeId?.message}
        {...register("transportTypeId")}
      />

      <div>
        <span className="text-on-surface block text-sm font-medium">Itens</span>

        <div className="mt-2 space-y-3">
          {fields.map((field, index) => {
            const chosenElsewhere = selectedItems
              .filter((_, i) => i !== index)
              .map((i) => i.itemId);
            const availableItems = (items ?? []).filter(
              (item) =>
                !chosenElsewhere.includes(item.id) || item.id === selectedItems[index]?.itemId
            );

            return (
              <div key={field.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <Select
                    id={`items.${index}.itemId`}
                    label={index === 0 ? "Item" : ""}
                    placeholder={isLoadingItems ? "Carregando itens…" : "Selecione um item"}
                    options={availableItems.map((item) => ({
                      value: item.id,
                      label: `${item.sku} - ${item.name}`,
                    }))}
                    error={errors.items?.[index]?.itemId?.message}
                    {...register(`items.${index}.itemId` as const)}
                  />
                </div>
                <div className="w-28">
                  <TextField
                    id={`items.${index}.quantity`}
                    label={index === 0 ? "Qtd." : ""}
                    type="number"
                    min={1}
                    error={errors.items?.[index]?.quantity?.message}
                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                  />
                </div>
                <Button
                  type="button"
                  variant="text"
                  className={index === 0 ? "mt-6" : ""}
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  Remover
                </Button>
              </div>
            );
          })}
        </div>

        {errors.items?.message && <p className="text-error mt-1 text-sm">{errors.items.message}</p>}

        <Button
          type="button"
          variant="text"
          className="mt-2"
          onClick={() => append({ itemId: "", quantity: 1 })}
        >
          + Adicionar item
        </Button>
      </div>

      {businessRuleError && (
        <p className="text-error text-sm" role="alert">
          {businessRuleError}
        </p>
      )}

      {createSalesOrder.isError && (
        <p className="text-error text-sm" role="alert">
          Não foi possível criar a ordem de venda: {createSalesOrder.error.message}
        </p>
      )}

      {justCreated && (
        <p className="text-sm text-green-700" role="status">
          Ordem de venda criada.
        </p>
      )}

      <Button type="submit" disabled={createSalesOrder.isPending}>
        {createSalesOrder.isPending ? "Salvando…" : "Criar ordem de venda"}
      </Button>
    </form>
  );
}
