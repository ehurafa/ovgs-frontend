"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema, type CreateCustomerInput } from "@/features/customers/schemas";
import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer";
import { useUpdateCustomer } from "@/features/customers/hooks/useUpdateCustomer";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import type { Customer } from "@/features/customers/types";
import { TextField } from "@/shared/components/ui/TextField";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { Button } from "@/shared/components/ui/Button";

interface CustomerFormProps {
  customer?: Customer | null;
  onCancelEdit?: () => void;
}

const emptyValues: CreateCustomerInput = {
  name: "",
  document: "",
  authorizedTransportTypeIds: [],
};

export function CustomerForm({ customer, onCancelEdit }: CustomerFormProps) {
  const [justSaved, setJustSaved] = useState(false);
  const isEditing = Boolean(customer);

  const { data: transportTypes, isLoading: isLoadingTransportTypes } = useTransportTypes();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer(customer?.id ?? "");
  const mutation = isEditing ? updateCustomer : createCustomer;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          document: customer.document,
          authorizedTransportTypeIds: customer.authorizedTransportTypeIds,
        }
      : emptyValues,
  });

  useEffect(() => {
    reset(
      customer
        ? {
            name: customer.name,
            document: customer.document,
            authorizedTransportTypeIds: customer.authorizedTransportTypeIds,
          }
        : emptyValues
    );
    setJustSaved(false);
  }, [customer, reset]);

  const onSubmit = handleSubmit((data) => {
    setJustSaved(false);
    mutation.mutate(data, {
      onSuccess: () => {
        setJustSaved(true);
        if (!isEditing) {
          reset(emptyValues);
        }
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5" noValidate>
      <TextField
        id="name"
        label="Nome do cliente"
        {...register("name")}
        error={errors.name?.message}
      />

      <TextField
        id="document"
        label="Documento (CPF/CNPJ)"
        {...register("document")}
        error={errors.document?.message}
      />

      <div>
        <span className="text-on-surface block text-sm font-medium">
          Tipos de transporte autorizados
        </span>

        {isLoadingTransportTypes && (
          <p className="text-on-surface-muted mt-1 text-sm">Carregando tipos de transporte…</p>
        )}

        {transportTypes && transportTypes.length === 0 && (
          <p className="text-on-surface-muted mt-1 text-sm">
            Nenhum tipo de transporte cadastrado ainda. Cadastre um antes de criar um cliente.
          </p>
        )}

        {transportTypes && transportTypes.length > 0 && (
          <Controller
            name="authorizedTransportTypeIds"
            control={control}
            render={({ field }) => (
              <div className="mt-2 space-y-2">
                {transportTypes.map((transportType) => (
                  <Checkbox
                    key={transportType.id}
                    id={`transport-${transportType.id}`}
                    label={transportType.name}
                    checked={field.value.includes(transportType.id)}
                    onChange={(event) => {
                      field.onChange(
                        event.target.checked
                          ? [...field.value, transportType.id]
                          : field.value.filter((id) => id !== transportType.id)
                      );
                    }}
                  />
                ))}
              </div>
            )}
          />
        )}

        {errors.authorizedTransportTypeIds && (
          <p className="text-error mt-1 text-sm">{errors.authorizedTransportTypeIds.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-error text-sm" role="alert">
          Não foi possível salvar este cliente: {mutation.error.message}
        </p>
      )}

      {justSaved && (
        <p className="text-sm text-green-700" role="status">
          {isEditing ? "Cliente atualizado." : "Cliente cadastrado."}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando…" : isEditing ? "Salvar alterações" : "Salvar cliente"}
        </Button>
        {isEditing && (
          <Button type="button" variant="text" onClick={onCancelEdit}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
