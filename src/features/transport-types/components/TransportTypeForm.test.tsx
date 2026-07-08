import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/lib/api/mocks/server";
import { renderWithQueryClient } from "@/shared/test-utils/renderWithQueryClient";
import { TransportTypeForm } from "./TransportTypeForm";
import type { CreateTransportTypeInput } from "@/features/transport-types/schemas";

const BASE = "/api";

describe("TransportTypeForm", () => {
  it("cria um tipo de transporte com sucesso", async () => {
    server.use(
      http.post(`${BASE}/transport-types`, async ({ request }) => {
        const body = (await request.json()) as CreateTransportTypeInput;
        return HttpResponse.json({ id: "tt-99", ...body }, { status: 201 });
      })
    );

    const user = userEvent.setup();
    renderWithQueryClient(<TransportTypeForm />);

    await user.type(screen.getByLabelText("Nome do tipo de transporte"), "Bi-truck");
    await user.click(screen.getByRole("button", { name: "Salvar tipo de transporte" }));

    await waitFor(() => {
      expect(screen.getByText("Tipo de transporte cadastrado.")).toBeInTheDocument();
    });
  });

  it("edita um tipo de transporte existente, pré-preenchendo o nome atual", async () => {
    server.use(
      http.patch(`${BASE}/transport-types/tt-1`, async ({ request }) => {
        const body = (await request.json()) as CreateTransportTypeInput;
        return HttpResponse.json({ id: "tt-1", ...body });
      })
    );

    const user = userEvent.setup();
    renderWithQueryClient(<TransportTypeForm transportType={{ id: "tt-1", name: "Caminhão" }} />);

    const input = screen.getByLabelText("Nome do tipo de transporte");
    expect(input).toHaveValue("Caminhão");

    await user.clear(input);
    await user.type(input, "Caminhão Refrigerado");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() => {
      expect(screen.getByText("Tipo de transporte atualizado.")).toBeInTheDocument();
    });
  });

  it("exibe erro de validação ao submeter nome vazio", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<TransportTypeForm />);

    await user.click(screen.getByRole("button", { name: "Salvar tipo de transporte" }));

    expect(await screen.findByText("Nome deve ter pelo menos 2 caracteres")).toBeInTheDocument();
  });
});
