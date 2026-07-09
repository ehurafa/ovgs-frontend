import { httpClient } from "@/lib/api/httpClient";
import type { Customer } from "@/features/customers/types";
import type { CreateCustomerInput } from "@/features/customers/schemas";

export const customersService = {
  list: () => httpClient.get<Customer[]>("/customers"),
  create: (input: CreateCustomerInput) => httpClient.post<Customer>("/customers", input),
  update: (id: string, input: CreateCustomerInput) =>
    httpClient.patch<Customer>(`/customers/${id}`, input),
};
