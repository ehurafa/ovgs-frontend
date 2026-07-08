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
        // delay controlado: garante uma janela para observarmos o estado
        // "pending" antes da resposta resolver - sem isso, o mock resolve
        // rápido demais para o estado intermediário ser verificado.
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

    // enquanto a mutation está pendente, o botão troca de texto e desabilita
    expect(screen.getByRole("button", { name: "Salvando…" })).toBeDisabled();

    // e, ao resolver, volta ao estado normal com a confirmação
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

    // espera a lista de transportes carregar antes de interagir
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
});
