import { createTransportTypeSchema } from "./schemas";

describe("createTransportTypeSchema", () => {
  it("aceita um nome válido", () => {
    const result = createTransportTypeSchema.safeParse({ name: "Caminhão" });
    expect(result.success).toBe(true);
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = createTransportTypeSchema.safeParse({ name: "C" });
    expect(result.success).toBe(false);
  });
});
