import { z } from "zod";

const salesOrderItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().int().positive("Quantity must be greater than zero"),
});

export const createSalesOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  transportTypeId: z.string().min(1, "Transport type is required"),
  items: z.array(salesOrderItemSchema).min(1, "Add at least one item"),
});

export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;

export const updateSalesOrderStatusSchema = z.object({
  status: z.enum(["CRIADA", "PLANEJADA", "AGENDADA", "EM_TRANSPORTE", "ENTREGUE"]),
});

export type UpdateSalesOrderStatusInput = z.infer<typeof updateSalesOrderStatusSchema>;
