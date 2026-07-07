import { z } from "zod";

export const createItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(2, "Name must have at least 2 characters"),
  unit: z.string().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;