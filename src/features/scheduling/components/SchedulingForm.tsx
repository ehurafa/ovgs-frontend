"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schedulingSchema, type SchedulingInput } from "@/features/scheduling/schemas";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { confirmSchedulingRequested } from "@/features/scheduling/store/schedulingSlice";
import { Select } from "@/shared/components/ui/Select";
import { TextField } from "@/shared/components/ui/TextField";
import { Button } from "@/shared/components/ui/Button";
import type { SalesOrder } from "@/features/sales-orders/types";

const WINDOW_LABELS: Record<string, string> = {
  MANHA: "Manhã (08h - 12h)",
  TARDE: "Tarde (12h - 18h)",
  NOITE: "Noite (18h - 22h)",
};

interface SchedulingFormProps {
  order: SalesOrder;
  onDone: () => void;
}

export function SchedulingForm({ order, onDone }: SchedulingFormProps) {
  const dispatch = useAppDispatch();
  const schedulingState = useAppSelector((state) => state.scheduling);
  const isReschedule = order.status === "AGENDADA";

  const isForThisOrder = schedulingState.orderId === order.id;
  const status = isForThisOrder ? schedulingState.status : "idle";
  const error = isForThisOrder ? schedulingState.error : null;
  const isConfirming = status === "confirming";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchedulingInput>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: {
      deliveryDate: order.scheduling?.deliveryDate ?? "",
      window: order.scheduling?.window ?? "MANHA",
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(confirmSchedulingRequested({ orderId: order.id, input: data }));
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5" noValidate>
      <TextField
        id="deliveryDate"
        label="Data de entrega"
        type="date"
        error={errors.deliveryDate?.message}
        {...register("deliveryDate")}
      />

      <Select
        id="window"
        label="Janela de atendimento"
        options={Object.entries(WINDOW_LABELS).map(([value, label]) => ({ value, label }))}
        error={errors.window?.message}
        {...register("window")}
      />

      {status === "error" && error && (
        <p className="text-error text-sm" role="alert">
          {error}
        </p>
      )}

      {status === "confirmed" && (
        <p className="text-sm text-green-700" role="status">
          {isReschedule ? "Agendamento atualizado." : "Agendamento confirmado."}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isConfirming}>
          {isConfirming ? "Confirmando…" : isReschedule ? "Reagendar" : "Confirmar agendamento"}
        </Button>
        <Button type="button" variant="text" onClick={onDone}>
          Fechar
        </Button>
      </div>
    </form>
  );
}
