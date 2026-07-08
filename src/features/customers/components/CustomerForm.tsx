"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema, type CreateCustomerInput } from "@/features/customers/schemas";
import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer";
import { useTransportTypes } from "@/features/transport-types/hooks/useTransportTypes";

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
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome do cliente
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="document" className="block text-sm font-medium text-gray-700">
          Documento (CPF/CNPJ)
        </label>
        <input
          id="document"
          type="text"
          {...register("document")}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        {errors.document && <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>}
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">
          Tipos de transporte autorizados
        </span>

        {isLoadingTransportTypes && (
          <p className="mt-1 text-sm text-gray-500">Carregando tipos de transporte…</p>
        )}

        {transportTypes && transportTypes.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            Nenhum tipo de transporte cadastrado ainda. Cadastre um antes de criar um cliente.
          </p>
        )}

        {transportTypes && transportTypes.length > 0 && (
          <Controller
            name="authorizedTransportTypeIds"
            control={control}
            render={({ field }) => (
              <div className="mt-2 space-y-2">
                {transportTypes.map((transportType) => {
                  const checked = field.value.includes(transportType.id);
                  return (
                    <label key={transportType.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          field.onChange(
                            event.target.checked
                              ? [...field.value, transportType.id]
                              : field.value.filter((id) => id !== transportType.id)
                          );
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      {transportType.name}
                    </label>
                  );
                })}
              </div>
            )}
          />
        )}

        {errors.authorizedTransportTypeIds && (
          <p className="mt-1 text-sm text-red-600">{errors.authorizedTransportTypeIds.message}</p>
        )}
      </div>

      {createCustomer.isError && (
        <p className="text-sm text-red-600" role="alert">
          Não foi possível salvar este cliente: {createCustomer.error.message}
        </p>
      )}

      {justCreated && (
        <p className="text-sm text-green-700" role="status">
          Cliente cadastrado.
        </p>
      )}

      <button
        type="submit"
        disabled={createCustomer.isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {createCustomer.isPending ? "Salvando…" : "Salvar cliente"}
      </button>
    </form>
  );
}
