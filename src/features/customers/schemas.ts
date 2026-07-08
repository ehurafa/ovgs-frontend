import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  document: z.string().min(11, "Document must be a valid CPF or CNPJ").max(18),
  authorizedTransportTypeIds: z
    .array(z.string())
    .min(1, "Select at least one authorized transport type"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const editCustomerSchema = createCustomerSchema;
export type EditCustomerInput = z.infer<typeof editCustomerSchema>;
