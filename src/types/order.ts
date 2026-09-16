export type OrderStatus =
  "DRAFT" | "PENDING" | "CONFIRMED" | "READY" | "COMPLETED" | "CANCELLED";
export interface PaymentProvider {
  createPayment(
    orderId: string,
    authoritativeAmount: number,
    currency: string,
  ): Promise<{ status: "not_connected" | "pending"; reference?: string }>;
}
