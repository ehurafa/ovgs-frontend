import { z } from "zod";

export const schedulingSchema = z.object({
  deliveryDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date"),
  window: z.enum(["MANHA", "TARDE", "NOITE"]),
});

export type SchedulingInput = z.infer<typeof schedulingSchema>;
