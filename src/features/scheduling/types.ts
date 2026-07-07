/**
 * Fixed service windows, simplifying real-world availability rules
 * as permitted by the challenge scope.
 */
export type DeliveryWindow = "MANHA" | "TARDE" | "NOITE";

export interface DeliveryScheduling {
  deliveryDate: string;
  window: DeliveryWindow;
  confirmed: boolean;
}
