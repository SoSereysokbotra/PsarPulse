export type PaymentState = "pending" | "completed" | "failed";

export interface PaymentRecord {
  transactionId: string;
  status: PaymentState;
  planId: "pro" | "premium";
  billingCycle: "monthly" | "annual";
  method: "aba" | "acleda" | "bakong";
  amount: number;
  currency: "USD" | "KHR";
  createdAt: number;
  updatedAt: number;
}

const globalForPayments = globalThis as typeof globalThis & {
  __psarPulsePayments?: Map<string, PaymentRecord>;
};

const paymentStore =
  globalForPayments.__psarPulsePayments ??
  (globalForPayments.__psarPulsePayments = new Map<string, PaymentRecord>());

export function savePayment(record: PaymentRecord) {
  paymentStore.set(record.transactionId, record);
}

export function getPayment(transactionId: string) {
  return paymentStore.get(transactionId);
}

export function listPayments(options?: {
  status?: PaymentState;
  limit?: number;
}) {
  const statusFilter = options?.status;
  const limit = Math.max(1, Math.min(options?.limit ?? 20, 100));

  const records = Array.from(paymentStore.values())
    .filter((record) => (statusFilter ? record.status === statusFilter : true))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);

  return records;
}

export function updatePaymentStatus(
  transactionId: string,
  status: PaymentState,
): PaymentRecord | null {
  const existing = paymentStore.get(transactionId);
  if (!existing) {
    return null;
  }

  const updated = {
    ...existing,
    status,
    updatedAt: Date.now(),
  };

  paymentStore.set(transactionId, updated);
  return updated;
}
