"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransportTypeSchema,
  type CreateTransportTypeInput,
} from "@/features/transport-types/schemas";
import { useCreateTransportType } from "@/features/transport-types/hooks/useCreateTransportType";
import { useUpdateTransportType } from "@/features/transport-types/hooks/useUpdateTransportType";
import type { TransportType } from "@/features/transport-types/types";
import { TextField } from "@/shared/components/ui/TextField";
import { Button } from "@/shared/components/ui/Button";

interface TransportTypeFormProps {
  transportType?: TransportType | null;
  onCancelEdit?: () => void;
}

export function TransportTypeForm({ transportType, onCancelEdit }: TransportTypeFormProps) {
  const [justSaved, setJustSaved] = useState(false);
  const isEditing = Boolean(transportType);

  const createTransportType = useCreateTransportType();
  const updateTransportType = useUpdateTransportType(transportType?.id ?? "");
  const mutation = isEditing ? updateTransportType : createTransportType;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransportTypeInput>({
    resolver: zodResolver(createTransportTypeSchema),
    defaultValues: { name: transportType?.name ?? "" },
  });

  const [previousTransportType, setPreviousTransportType] = useState(transportType);
  if (transportType !== previousTransportType) {
    setPreviousTransportType(transportType);
    reset({ name: transportType?.name ?? "" });
    setJustSaved(false);
  }

  const onSubmit = handleSubmit((data) => {
    setJustSaved(false);
    mutation.mutate(data, {
      onSuccess: () => {
        setJustSaved(true);
        if (!isEditing) {
          reset({ name: "" });
        }
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5" noValidate>
      <TextField
        id="transport-type-name"
        label="Nome do tipo de transporte"
        placeholder="Caminhão, Carreta, Bi-truck..."
        {...register("name")}
        error={errors.name?.message}
      />

      {mutation.isError && (
        <p className="text-error text-sm" role="alert">
          Não foi possível salvar: {mutation.error.message}
        </p>
      )}

      {justSaved && (
        <p className="text-sm text-green-700" role="status">
          {isEditing ? "Tipo de transporte atualizado." : "Tipo de transporte cadastrado."}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Salvando…"
            : isEditing
              ? "Salvar alterações"
              : "Salvar tipo de transporte"}
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
