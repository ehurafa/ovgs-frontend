import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/lib/api/mocks/server";
import { renderWithQueryClient } from "@/shared/test-utils/renderWithQueryClient";
import { SalesOrderDetail } from "./SalesOrderDetail";

const BASE = "/api";

const order = {
  id: "so-1",
  customerId: "cust-1",
  transportTypeId: "tt-1",
  items: [{ itemId: "item-1", quantity: 2 }],
  status: "PLANEJADA" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function mockLookupData() {
  server.use(
    http.get(`${BASE}/sales-orders/so-1`, () => HttpResponse.json(order)),
    http.get(`${BASE}/customers`, () =>
      HttpResponse.json([
        {
          id: "cust-1",
          name: "Distribuidora Central",
          document: "1",
          authorizedTransportTypeIds: ["tt-1"],
        },
      ])
    ),
    http.get(`${BASE}/transport-types`, () =>
      HttpResponse.json([{ id: "tt-1", name: "Caminhão" }])
    ),
    http.get(`${BASE}/items`, () =>
      HttpResponse.json([{ id: "item-1", sku: "SKU-001", name: "Caixa de parafusos" }])
    )
  );
}

describe("SalesOrderDetail", () => {
  it("mostra apenas a transição válida para o status atual e avança com sucesso", async () => {
    mockLookupData();
    server.use(
      http.patch(`${BASE}/sales-orders/so-1/status`, async ({ request }) => {
        const { status } = (await request.json()) as { status: string };
        return HttpResponse.json({ ...order, status });
      })
    );

    const user = userEvent.setup();
    renderWithQueryClient(<SalesOrderDetail id="so-1" />);

    await screen.findByText("Distribuidora Central");

    expect(screen.getByRole("button", { name: "Marcar como Agendada" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Marcar como Em transporte/ })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Marcar como Agendada" }));

    await waitFor(() => {
      expect(screen.getByText("Agendada")).toBeInTheDocument();
    });
  });

  it("exibe o erro quando a API rejeita uma transição inválida", async () => {
    mockLookupData();
    server.use(
      http.patch(`${BASE}/sales-orders/so-1/status`, () =>
        HttpResponse.json(
          { message: "Invalid transition from PLANEJADA to ENTREGUE" },
          { status: 400 }
        )
      )
    );

    const user = userEvent.setup();
    renderWithQueryClient(<SalesOrderDetail id="so-1" />);

    await screen.findByText("Distribuidora Central");
    await user.click(screen.getByRole("button", { name: "Marcar como Agendada" }));

    expect(
      await screen.findByText("Invalid transition from PLANEJADA to ENTREGUE")
    ).toBeInTheDocument();
  });
});
