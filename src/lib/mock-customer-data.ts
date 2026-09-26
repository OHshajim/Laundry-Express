import type { Order, OrderReview } from "@/types";

export interface CustomerTransaction {
  id: string;
  order_id: string;
  order_number: string;
  date: string;
  amount: number;
  method: string;
  card_last4: string;
  status: "succeeded" | "pending" | "refunded";
  receipt_url?: string;
}

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  member_since: string;
  total_orders: number;
  total_spent: number;
}

export const CURRENT_CUSTOMER: CustomerProfile = {
  id: "u-1",
  full_name: "Sarah Jenkins",
  email: "sarah.jenkins@example.com",
  phone: "815-575-9536",
  address: "1420 Algonquin Rd, Lake in the Hills, IL 60156",
  member_since: "February 2026",
  total_orders: 8,
  total_spent: 260.0,
};

export const CUSTOMER_ORDERS: Order[] = [
  {
    id: "ord-1",
    order_number: "LX-2026-0042",
    user_id: "u-1",
    pricing_mode: "per_bag",
    detergent_id: "det-tide-pods",
    bag_count: 2,
    pickup_date: "Today",
    pickup_slot: "8am-12pm",
    subtotal: 65.0,
    discount_amount: 0.0,
    delivery_fee: 0.0, // FREE on 2+ bags
    tax_amount: 0.0,
    total_amount: 65.0,
    is_out_of_home: true,
    bag_outside_door_confirmed: true,
    customer_notes: "Leave clean bags on front porch behind white chair.",
    has_preexisting_damage: true,
    damage_notes: "Frayed stitching on grey duvet cover (documented at intake).",
    damage_photo_url: "/brand/logo-badge.jpg",
    customer_notified_damage: true,
    order_status: "in_wash",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: "u-1",
      email: "sarah.jenkins@example.com",
      phone: "815-575-9536",
      address: "1420 Algonquin Rd, Lake in the Hills, IL 60156",
      full_name: "Sarah Jenkins",
      role: "customer",
      is_active: true,
      created_at: "",
      updated_at: "",
    },
    proofs: [
      {
        id: "prf-1",
        order_id: "ord-1",
        proof_type: "pickup",
        image_url: "/brand/logo-badge.jpg",
        uploaded_by: "driver-1",
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "prf-2",
        order_id: "ord-1",
        proof_type: "damage",
        image_url: "/brand/logo-badge.jpg",
        notes: "Frayed stitching documented before sanitizing.",
        uploaded_by: "wash-lead",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: "ord-prev-1",
    order_number: "LX-2026-0038",
    user_id: "u-1",
    pricing_mode: "per_bag",
    detergent_id: "det-eco-plant",
    bag_count: 1,
    pickup_date: "Sept 18, 2026",
    pickup_slot: "1pm-6pm",
    subtotal: 32.50,
    discount_amount: 0.0,
    delivery_fee: 10.0,
    tax_amount: 0.0,
    total_amount: 42.50,
    is_out_of_home: false,
    bag_outside_door_confirmed: false,
    customer_notes: "Ring doorbell upon drop-off.",
    order_status: "completed",
    created_at: "2026-09-18T14:30:00Z",
    updated_at: "2026-09-19T11:00:00Z",
    user: {
      id: "u-1",
      email: "sarah.jenkins@example.com",
      phone: "815-575-9536",
      address: "1420 Algonquin Rd, Lake in the Hills, IL 60156",
      full_name: "Sarah Jenkins",
      role: "customer",
      is_active: true,
      created_at: "",
      updated_at: "",
    },
    proofs: [
      {
        id: "prf-prev-1",
        order_id: "ord-prev-1",
        proof_type: "pickup",
        image_url: "/brand/logo-badge.jpg",
        uploaded_by: "driver-2",
        created_at: "2026-09-18T14:45:00Z",
      },
      {
        id: "prf-prev-2",
        order_id: "ord-prev-1",
        proof_type: "dropoff",
        image_url: "/brand/logo-badge.jpg",
        uploaded_by: "driver-2",
        created_at: "2026-09-19T10:55:00Z",
      },
    ],
  },
];

export const CUSTOMER_TRANSACTIONS: CustomerTransaction[] = [
  {
    id: "txn-1",
    order_id: "ord-1",
    order_number: "LX-2026-0042",
    date: "Today, 8:12 AM",
    amount: 65.0,
    method: "Apple Pay",
    card_last4: "4242",
    status: "succeeded",
    receipt_url: "https://pay.stripe.com/receipts/mock-1",
  },
  {
    id: "txn-2",
    order_id: "ord-prev-1",
    order_number: "LX-2026-0038",
    date: "Sept 18, 2026",
    amount: 42.50,
    method: "Visa Card",
    card_last4: "8821",
    status: "succeeded",
    receipt_url: "https://pay.stripe.com/receipts/mock-2",
  },
  {
    id: "txn-3",
    order_id: "ord-prev-0",
    order_number: "LX-2026-0021",
    date: "Sept 04, 2026",
    amount: 65.0,
    method: "Mastercard",
    card_last4: "1094",
    status: "succeeded",
    receipt_url: "https://pay.stripe.com/receipts/mock-3",
  },
];

export const CUSTOMER_REVIEWS: OrderReview[] = [
  {
    id: "rev-c-1",
    order_id: "ord-prev-1",
    user_id: "u-1",
    rating: 5,
    comment: "Clothes were returned neatly folded and sealed against the rain! Loved the eco detergent option.",
    status: "approved",
    created_at: "2026-09-19T14:00:00Z",
    updated_at: "2026-09-19T14:30:00Z",
    user: { full_name: "Sarah Jenkins" },
    photos: [
      {
        id: "cp-1",
        review_id: "rev-c-1",
        photo_url: "/brand/logo-badge.jpg",
        display_order: 1,
        created_at: "2026-09-19T14:00:00Z",
      },
    ],
  },
];
