import { createCustomerSchema } from "./schemas";

describe("createCustomerSchema", () => {
  it("aceita um payload válido", () => {
    const result = createCustomerSchema.safeParse({
      name: "Distribuidora Central",
      document: "12345678900",
      authorizedTransportTypeIds: ["tt-1"],
    });

    expect(result.success).toBe(true);
  });

  it("rejeita quando nenhum tipo de transporte é selecionado", () => {
    const result = createCustomerSchema.safeParse({
      name: "Distribuidora Central",
      document: "12345678900",
      authorizedTransportTypeIds: [],
    });

    expect(result.success).toBe(false);
  });
});
