import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/lib/api/mocks/server";
import { renderWithQueryClient } from "@/shared/test-utils/renderWithQueryClient";
import { ItemList } from "./ItemList";

const BASE = "/api";

describe("ItemList", () => {
  it("exibe os itens cadastrados", async () => {
    server.use(
      http.get(`${BASE}/items`, () =>
        HttpResponse.json([
          { id: "item-1", sku: "SKU-001", name: "Caixa de parafusos", unit: "cx" },
        ])
      )
    );

    renderWithQueryClient(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText("Caixa de parafusos")).toBeInTheDocument();
    });
    expect(screen.getByText(/SKU: SKU-001/)).toBeInTheDocument();
  });

  it("exibe uma mensagem quando não há itens cadastrados", async () => {
    server.use(http.get(`${BASE}/items`, () => HttpResponse.json([])));

    renderWithQueryClient(<ItemList />);

    expect(await screen.findByText("Nenhum item cadastrado ainda.")).toBeInTheDocument();
  });
});
