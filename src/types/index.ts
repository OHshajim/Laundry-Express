export type UserRole = "customer" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type User = UserProfile;

export type PricingMode = "per_bag" | "per_kg" | "package";

export interface PricingConfig {
  id: string;
  pricing_type: "per_bag" | "per_kg";
  unit_price: number;
  min_order_quantity: number;
  free_delivery_threshold: number;
  standard_delivery_fee: number;
  max_orders_per_slot: number;
  is_active: boolean;
  updated_at: string;
}

export interface LaundryPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  package_type: "bag_bundle" | "weight_tier" | "subscription";
  included_bags?: number;
  included_kg?: number;
  price: number;
  validity_days: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UserPackage {
  id: string;
  user_id: string;
  package_id: string;
  remaining_bags: number;
  remaining_kg: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  package?: LaundryPackage;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  discount_type: "percentage" | "fixed_amount" | "free_delivery";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit_total?: number;
  usage_limit_per_user: number;
  used_count: number;
  start_date: string;
  end_date: string;
  banner_image_url?: string;
  is_banner_active: boolean;
  is_active: boolean;
}

export interface Detergent {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  price_adjustment: number;
  created_at?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "picked_up"
  | "in_wash"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  pricing_mode: PricingMode;
  package_id?: string | null;
  detergent_id: string;
  bag_count: number;
  estimated_weight_kg?: number | null;
  final_weight_kg?: number | null;
  pickup_date: string;
  pickup_slot: "8am-12pm" | "1pm-6pm";
  delivery_date?: string | null;
  delivery_slot?: string | null;
  subtotal: number;
  discount_amount: number;
  promotion_id?: string | null;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  is_out_of_home: boolean;
  bag_outside_door_confirmed: boolean;
  customer_notes?: string;
  admin_notes?: string;
  order_status: OrderStatus;
  stripe_customer_id?: string;
  stripe_payment_method_id?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: UserProfile;
  detergent?: Detergent;
  proofs?: OrderProof[];
  payment?: PaymentRecord;
  review?: OrderReview;
}

export interface OrderProof {
  id: string;
  order_id: string;
  proof_type: "pickup" | "dropoff";
  image_url: string;
  notes?: string;
  uploaded_by: string;
  created_at: string;
}

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface PaymentRecord {
  id: string;
  payment_number: string;
  order_id: string;
  user_id: string;
  provider: "stripe" | "cash_on_delivery" | "package_credit";
  provider_payment_id?: string;
  amount: number;
  currency: string;
  payment_method_type: string;
  status: PaymentStatus;
  receipt_url?: string;
  failure_reason?: string;
  refunded_amount: number;
  metadata?: Record<string, unknown>;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewPhoto {
  id: string;
  review_id: string;
  photo_url: string;
  display_order: 1 | 2 | 3;
  created_at: string;
}

export interface OrderReview {
  id: string;
  order_id: string;
  user_id: string;
  rating: number; // 1-5
  comment: string;
  status: "pending" | "approved" | "rejected";
  moderated_by?: string;
  moderation_note?: string;
  moderated_at?: string;
  created_at: string;
  updated_at?: string;
  photos?: ReviewPhoto[];
  user?: { full_name: string };
  order?: { order_number: string };
}

export interface ActivityLog {
  id: string;
  user_id?: string | null;
  user_role: "customer" | "admin" | "system";
  action: string;
  entity_type: "order" | "payment" | "review" | "user" | "pricing" | "package" | "promotion";
  entity_id?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
