"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema, type CreateCustomerInput } from "@/features/customers/schemas";
import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";
import { TextField } from "@/shared/components/ui/TextField";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { Button } from "@/shared/components/ui/Button";

export function CustomerForm() {
  const [justCreated, setJustCreated] = useState(false);
  const { data: transportTypes, isLoading: isLoadingTransportTypes } = useTransportTypes();
  const createCustomer = useCreateCustomer();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: { name: "", document: "", authorizedTransportTypeIds: [] },
  });

  const onSubmit = handleSubmit((data) => {
    setJustCreated(false);
    createCustomer.mutate(data, {
      onSuccess: () => {
        reset();
        setJustCreated(true);
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

      {createCustomer.isError && (
        <p className="text-error text-sm" role="alert">
          Não foi possível salvar este cliente: {createCustomer.error.message}
        </p>
      )}

      {justCreated && (
        <p className="text-sm text-green-700" role="status">
          Cliente cadastrado.
        </p>
      )}

      <Button type="submit" disabled={createCustomer.isPending}>
        {createCustomer.isPending ? "Salvando…" : "Salvar cliente"}
      </Button>
    </form>
  );
}
