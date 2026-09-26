/**
 * Admin Payment Transactions Mock Feed
 *
 * Provides transactional mock telemetry for:
 * - Admin payments ledger
 * - Order detail reconciliation
 * - Revenue, refund, and pending payment calculations
 * - Strict adherence to the 100-250 lines architectural rule
 */

export interface AdminPaymentTransaction {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  date: string;
  amount: number;
  method: string;
  card_last4: string;
  status: "succeeded" | "pending" | "refunded";
  stripe_payment_intent: string;
}

export const INITIAL_ADMIN_TRANSACTIONS: AdminPaymentTransaction[] = [
  {
    id: "txn-adm-1",
    order_id: "ord-1",
    order_number: "LX-2026-0042",
    customer_name: "Sarah Jenkins",
    customer_email: "sarah.jenkins@example.com",
    date: "2026-09-26T08:12:00Z",
    amount: 65.0,
    method: "Apple Pay",
    card_last4: "4242",
    status: "succeeded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Aa12345",
  },
  {
    id: "txn-adm-2",
    order_id: "ord-2",
    order_number: "LX-2026-0043",
    customer_name: "Marcus Rodriguez",
    customer_email: "marcus.rodriguez@example.com",
    date: "2026-09-26T10:45:00Z",
    amount: 42.5,
    method: "Visa Card",
    card_last4: "1821",
    status: "succeeded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Bb67890",
  },
  {
    id: "txn-adm-3",
    order_id: "ord-3",
    order_number: "LX-2026-0044",
    customer_name: "Elena Rostova",
    customer_email: "elena.rostova@example.com",
    date: "2026-09-26T11:20:00Z",
    amount: 43.0,
    method: "Google Pay",
    card_last4: "9012",
    status: "pending",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Cc54321",
  },
  {
    id: "txn-adm-4",
    order_id: "ord-prev-1",
    order_number: "LX-2026-0038",
    customer_name: "Sarah Jenkins",
    customer_email: "sarah.jenkins@example.com",
    date: "2026-09-18T14:30:00Z",
    amount: 42.5,
    method: "Visa Card",
    card_last4: "4242",
    status: "succeeded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Dd99887",
  },
  {
    id: "txn-adm-5",
    order_id: "ord-ref-1",
    order_number: "LX-2026-0019",
    customer_name: "David Miller",
    customer_email: "david.miller@example.com",
    date: "2026-09-12T09:15:00Z",
    amount: 32.5,
    method: "Mastercard",
    card_last4: "7712",
    status: "refunded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Ee11223",
  },
  {
    id: "txn-adm-6",
    order_id: "ord-prev-2",
    order_number: "LX-2026-0014",
    customer_name: "Marcus Rodriguez",
    customer_email: "marcus.rodriguez@example.com",
    date: "2026-09-08T16:10:00Z",
    amount: 65.0,
    method: "Visa Card",
    card_last4: "1821",
    status: "succeeded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Ff33445",
  },
];

export function getTransactionSummaryStats(transactions: AdminPaymentTransaction[]) {
  const totalRevenue = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRefunds = transactions
    .filter((t) => t.status === "refunded")
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return { totalRevenue, totalRefunds, pendingCount };
}
