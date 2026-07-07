import { z } from "zod";

export const createTransportTypeSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
});

export type CreateTransportTypeInput = z.infer<typeof createTransportTypeSchema>;
