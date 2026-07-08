import { createSalesOrderSchema } from "./schemas";

describe("createSalesOrderSchema", () => {
  it("aceita um payload válido com ao menos um item", () => {
    const result = createSalesOrderSchema.safeParse({
      customerId: "cust-1",
      transportTypeId: "tt-1",
      items: [{ itemId: "item-1", quantity: 2 }],
    });

    expect(result.success).toBe(true);
  });

  it("rejeita quando não há nenhum item", () => {
    const result = createSalesOrderSchema.safeParse({
      customerId: "cust-1",
      transportTypeId: "tt-1",
      items: [],
    });

    expect(result.success).toBe(false);
  });
});
