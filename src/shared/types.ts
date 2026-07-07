/**
 * Audit event, mirrors backend traceability requirements
 * so the frontend can render a consistent history view.
 * Lives in `shared` (not a single feature) since auditing is a
 * cross-cutting concern spanning multiple domains.
 */
export interface AuditEvent {
  id: string;
  entity: "SalesOrder" | "Scheduling" | "TransportType" | "Customer";
  entityId: string;
  action: "CREATED" | "STATUS_CHANGED" | "SCHEDULING_CHANGED" | "TRANSPORT_CHANGED";
  occurredAt: string;
  previousState?: unknown;
  newState?: unknown;
}
