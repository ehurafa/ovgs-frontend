import { z } from "zod";

export const createItemSchema = z.object({
  sku: z.string().min(1, "SKU é obrigatório"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  unit: z.string().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
