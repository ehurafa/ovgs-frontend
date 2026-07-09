import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { server } from "@/lib/api/mocks/server";
import { renderWithQueryClient } from "@/shared/test-utils/renderWithQueryClient";
import { CustomerForm } from "./CustomerForm";
import type { CreateCustomerInput } from "@/features/customers/schemas";

const BASE = "/api";

describe("CustomerForm", () => {
  it("mostra o estado de carregamento enquanto a requisição está pendente", async () => {
    server.use(
      http.get(`${BASE}/transport-types`, () =>
        HttpResponse.json([{ id: "tt-1", name: "Caminhão" }])
      ),
      http.post(`${BASE}/customers`, async ({ request }) => {
        // Controlled delay: gives us a window to observe the "pending"
        // state before the response resolves — without this, the mock
        // resolves too fast to verify the intermediate state.
        await delay(100);
        const body = (await request.json()) as CreateCustomerInput;
        return HttpResponse.json({ id: "cust-1", ...body }, { status: 201 });
      })
    );

    const user = userEvent.setup();
    renderWithQueryClient(<CustomerForm />);

    await screen.findByLabelText("Caminhão");
    await user.type(screen.getByLabelText("Nome do cliente"), "Cliente Teste");
    await user.type(screen.getByLabelText("Documento (CPF/CNPJ)"), "12345678900");
    await user.click(screen.getByLabelText("Caminhão"));
    await user.click(screen.getByRole("button", { name: "Salvar cliente" }));

    // While the mutation is pending, the button changes text and disables
    expect(screen.getByRole("button", { name: "Salvando…" })).toBeDisabled();

    // Once resolved, it goes back to normal with the confirmation message
    await waitFor(() => {
      expect(screen.getByText("Cliente cadastrado.")).toBeInTheDocument();
    });
  });

  it("cria um cliente com sucesso e exibe a mensagem de confirmação", async () => {
    server.use(
      http.get(`${BASE}/transport-types`, () =>
        HttpResponse.json([{ id: "tt-1", name: "Caminhão" }])
      ),
      http.post(`${BASE}/customers`, async ({ request }) => {
        const body = (await request.json()) as CreateCustomerInput;
        return HttpResponse.json({ id: "cust-99", ...body }, { status: 201 });
      })
    );

    const user = userEvent.setup();
    renderWithQueryClient(<CustomerForm />);

    // Wait for the transport type list to load before interacting
    await screen.findByLabelText("Caminhão");

    await user.type(screen.getByLabelText("Nome do cliente"), "Distribuidora Teste");
    await user.type(screen.getByLabelText("Documento (CPF/CNPJ)"), "12345678900");
    await user.click(screen.getByLabelText("Caminhão"));
    await user.click(screen.getByRole("button", { name: "Salvar cliente" }));

    await waitFor(() => {
      expect(screen.getByText("Cliente cadastrado.")).toBeInTheDocument();
    });
  });

  it("exibe os erros de validação ao submeter o formulário vazio", async () => {
    server.use(
      http.get(`${BASE}/transport-types`, () =>
        HttpResponse.json([{ id: "tt-1", name: "Caminhão" }])
      )
    );

    const user = userEvent.setup();
    renderWithQueryClient(<CustomerForm />);

    await screen.findByLabelText("Caminhão");
    await user.click(screen.getByRole("button", { name: "Salvar cliente" }));

    expect(await screen.findByText("Nome deve ter pelo menos 2 caracteres")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione ao menos um tipo de transporte autorizado")
    ).toBeInTheDocument();
  });

  it("edita um cliente existente, pré-preenchendo os dados atuais", async () => {
    server.use(
      http.get(`${BASE}/transport-types`, () =>
        HttpResponse.json([
          { id: "tt-1", name: "Caminhão" },
          { id: "tt-2", name: "Carreta" },
        ])
      ),
      http.patch(`${BASE}/customers/cust-1`, async ({ request }) => {
        const body = (await request.json()) as CreateCustomerInput;
        return HttpResponse.json({ id: "cust-1", ...body });
      })
    );

    const existingCustomer = {
      id: "cust-1",
      name: "Distribuidora Central",
      document: "12345678900",
      authorizedTransportTypeIds: ["tt-1"],
    };

    const user = userEvent.setup();
    renderWithQueryClient(<CustomerForm customer={existingCustomer} />);

    await screen.findByLabelText("Caminhão");
    expect(screen.getByLabelText("Nome do cliente")).toHaveValue("Distribuidora Central");
    expect(screen.getByLabelText("Caminhão")).toBeChecked();
    expect(screen.getByLabelText("Carreta")).not.toBeChecked();

    await user.click(screen.getByLabelText("Carreta"));
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() => {
      expect(screen.getByText("Cliente atualizado.")).toBeInTheDocument();
    });
  });
});
