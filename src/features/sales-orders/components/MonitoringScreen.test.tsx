import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/lib/api/mocks/server";
import { renderWithProviders } from "@/shared/test-utils/renderWithProviders";
import { MonitoringScreen } from "./MonitoringScreen";

const BASE = "/api";

const customer = {
  id: "cust-1",
  name: "Distribuidora Central",
  document: "1",
  authorizedTransportTypeIds: ["tt-1"],
};

const orderCriada = {
  id: "so-1",
  customerId: "cust-1",
  transportTypeId: "tt-1",
  items: [{ itemId: "item-1", quantity: 1 }],
  status: "CRIADA",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const orderPlanejada = {
  ...orderCriada,
  id: "so-2",
  status: "PLANEJADA",
};

function mockLookupData() {
  server.use(
    http.get(`${BASE}/customers`, () => HttpResponse.json([customer])),
    http.get(`${BASE}/transport-types`, () =>
      HttpResponse.json([{ id: "tt-1", name: "Caminhão" }])
    ),
    http.get(`${BASE}/sales-orders`, ({ request }) => {
      const url = new URL(request.url);
      const status = url.searchParams.get("status");
      const all = [orderCriada, orderPlanejada];
      const filtered = status ? all.filter((o) => o.status === status) : all;
      return HttpResponse.json(filtered);
    })
  );
}

describe("MonitoringScreen", () => {
  it("filtra a lista de ordens de venda ao selecionar um status", async () => {
    mockLookupData();
    const user = userEvent.setup();
    renderWithProviders(<MonitoringScreen />);

    // The table element gets unmounted and re-created whenever the query
    // key changes (i.e. whenever the filter changes, since useSalesOrders
    // shows a loading state in between). So we must re-query it fresh
    // inside each waitFor, instead of caching a single reference for the
    // whole test — a cached reference would silently point at a stale,
    // already-detached table after the filter change.
    await waitFor(() => {
      const table = screen.getByRole("table");
      expect(within(table).getAllByText("Distribuidora Central")).toHaveLength(2);
    });

    await user.selectOptions(screen.getByLabelText("Status"), "PLANEJADA");

    await waitFor(() => {
      const table = screen.getByRole("table");
      expect(within(table).getAllByText("Distribuidora Central")).toHaveLength(1);
    });
  });
});
