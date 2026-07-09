import { screen, act } from "@testing-library/react";
import { renderWithProviders } from "@/shared/test-utils/renderWithProviders";
import { auditEventLogged } from "@/shared/store/auditSlice";
import { AuditTrail } from "./AuditTrail";

describe("AuditTrail", () => {
  it("exibe uma mensagem quando não há eventos registrados", () => {
    renderWithProviders(<AuditTrail />);

    expect(screen.getByText("Nenhum evento de auditoria registrado ainda.")).toBeInTheDocument();
  });

  it("exibe os eventos registrados", () => {
    const { store } = renderWithProviders(<AuditTrail />);

    act(() => {
      store.dispatch(
        auditEventLogged({
          id: "audit-1",
          entity: "SalesOrder",
          entityId: "so-1",
          action: "CREATED",
          occurredAt: new Date().toISOString(),
          newState: { status: "CRIADA" },
        })
      );
    });

    expect(screen.getByText("Ordem de Venda", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Criação")).toBeInTheDocument();
    expect(screen.getByText("(so-1)")).toBeInTheDocument();
  });
});
