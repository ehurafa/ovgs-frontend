import { z } from "zod";

const salesOrderItemSchema = z.object({
  itemId: z.string().min(1, "Item é obrigatório"),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
});

export const createSalesOrderSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório"),
  transportTypeId: z.string().min(1, "Tipo de transporte é obrigatório"),
  items: z.array(salesOrderItemSchema).min(1, "Adicione ao menos um item"),
});

export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;

export const updateSalesOrderStatusSchema = z.object({
  status: z.enum(["CRIADA", "PLANEJADA", "AGENDADA", "EM_TRANSPORTE", "ENTREGUE"]),
});

export type UpdateSalesOrderStatusInput = z.infer<typeof updateSalesOrderStatusSchema>;
