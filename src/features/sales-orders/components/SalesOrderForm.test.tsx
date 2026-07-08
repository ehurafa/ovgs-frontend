import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/lib/api/mocks/server";
import { renderWithQueryClient } from "@/shared/test-utils/renderWithQueryClient";
import { SalesOrderForm } from "./SalesOrderForm";
import type { CreateSalesOrderInput } from "@/features/sales-orders/schemas";

const BASE = "/api";

const customers = [
  {
    id: "cust-1",
    name: "Distribuidora Central",
    document: "1",
    authorizedTransportTypeIds: ["tt-1"],
  },
];
const transportTypes = [
  { id: "tt-1", name: "Caminhão" },
  { id: "tt-2", name: "Carreta" },
];
const items = [{ id: "item-1", sku: "SKU-001", name: "Caixa de parafusos" }];

function mockLookupData() {
  server.use(
    http.get(`${BASE}/customers`, () => HttpResponse.json(customers)),
    http.get(`${BASE}/transport-types`, () => HttpResponse.json(transportTypes)),
    http.get(`${BASE}/items`, () => HttpResponse.json(items))
  );
}

describe("SalesOrderForm", () => {
  it("só lista tipos de transporte autorizados para o cliente selecionado", async () => {
    mockLookupData();
    const user = userEvent.setup();
    renderWithQueryClient(<SalesOrderForm />);

    await screen.findByRole("option", { name: "Distribuidora Central" });

    await user.selectOptions(screen.getByLabelText("Cliente"), "cust-1");

    const transportSelect = screen.getByLabelText("Tipo de transporte");
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Caminhão" })).toBeInTheDocument();
    });
    expect(screen.queryByRole("option", { name: "Carreta" })).not.toBeInTheDocument();
    expect(transportSelect).toBeEnabled();
  });

  it("cria uma ordem de venda com sucesso", async () => {
    mockLookupData();
    server.use(
      http.post(`${BASE}/sales-orders`, async ({ request }) => {
        const body = (await request.json()) as CreateSalesOrderInput;
        return HttpResponse.json(
          { id: "so-99", status: "CRIADA", createdAt: "", updatedAt: "", ...body },
          { status: 201 }
        );
      })
    );

    const user = userEvent.setup();
    renderWithQueryClient(<SalesOrderForm />);

    await screen.findByRole("option", { name: "Distribuidora Central" });
    await user.selectOptions(screen.getByLabelText("Cliente"), "cust-1");

    await screen.findByRole("option", { name: "Caminhão" });
    await user.selectOptions(screen.getByLabelText("Tipo de transporte"), "tt-1");

    await screen.findByRole("option", { name: "SKU-001 - Caixa de parafusos" });
    await user.selectOptions(screen.getByLabelText("Item"), "item-1");

    await user.clear(screen.getByLabelText("Qtd."));
    await user.type(screen.getByLabelText("Qtd."), "3");
    await user.click(screen.getByRole("button", { name: "Criar ordem de venda" }));

    await waitFor(() => {
      expect(screen.getByText("Ordem de venda criada.")).toBeInTheDocument();
    });
  });
});
