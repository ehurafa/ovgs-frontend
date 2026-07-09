import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/lib/api/mocks/server";
import { renderWithProviders } from "@/shared/test-utils/renderWithProviders";
import { SchedulingForm } from "./SchedulingForm";
import type { SalesOrder } from "@/features/sales-orders/types";

const BASE = "/api";

const order: SalesOrder = {
  id: "so-1",
  customerId: "cust-1",
  transportTypeId: "tt-1",
  items: [{ itemId: "item-1", quantity: 1 }],
  status: "PLANEJADA",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("SchedulingForm", () => {
  it("confirma o agendamento via saga e mostra sucesso", async () => {
    server.use(
      http.patch(`${BASE}/sales-orders/so-1/scheduling`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({
          ...order,
          status: "AGENDADA",
          scheduling: { ...(body as object), confirmed: true },
        });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<SchedulingForm order={order} onDone={() => {}} />);

    fireEvent.change(screen.getByLabelText("Data de entrega"), {
      target: { value: "2026-08-01" },
    });
    await user.selectOptions(screen.getByLabelText("Janela de atendimento"), "TARDE");
    await user.click(screen.getByRole("button", { name: "Confirmar agendamento" }));

    await waitFor(() => {
      expect(screen.getByText("Agendamento confirmado.")).toBeInTheDocument();
    });
  });

  it("exibe o erro quando a API rejeita o agendamento", async () => {
    server.use(
      http.patch(`${BASE}/sales-orders/so-1/scheduling`, () =>
        HttpResponse.json(
          { message: "Scheduling cannot be set while order is CRIADA" },
          { status: 400 }
        )
      )
    );

    const user = userEvent.setup();
    renderWithProviders(<SchedulingForm order={order} onDone={() => {}} />);

    fireEvent.change(screen.getByLabelText("Data de entrega"), {
      target: { value: "2026-08-01" },
    });
    await user.click(screen.getByRole("button", { name: "Confirmar agendamento" }));

    expect(
      await screen.findByText("Scheduling cannot be set while order is CRIADA")
    ).toBeInTheDocument();
  });
});
