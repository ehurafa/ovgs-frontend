import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  document: z.string().min(11, "Documento deve ser um CPF ou CNPJ válido").max(18),
  authorizedTransportTypeIds: z
    .array(z.string())
    .min(1, "Selecione ao menos um tipo de transporte autorizado"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const editCustomerSchema = createCustomerSchema;
export type EditCustomerInput = z.infer<typeof editCustomerSchema>;
