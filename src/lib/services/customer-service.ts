import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { CustomerAccount } from "@/components/admin/customer-detail-modal";
import type { Order, OrderReview } from "@/types";

export class CustomerService {
  static async getCustomers(): Promise<CustomerAccount[]> {
    const supabase = createAdminSupabaseClient();
    const [{ data: users, error: usersError }, { data: orders, error: ordersError }, { data: reviews, error: reviewsError }] =
      await Promise.all([
        supabase.from("users")
          .select("id,full_name,email,phone,address,role,created_at")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      ]);
    if (usersError || ordersError || reviewsError) {
      throw new Error(`Unable to load customers: ${usersError?.message || ordersError?.message || reviewsError?.message}`);
    }

    const customers = new Map<string, CustomerAccount>();
    const adminEmails = new Set((users || [])
      .filter((user) => user.role === "admin")
      .map((user) => user.email.toLowerCase()));
    for (const user of users || []) {
      if (user.role !== "customer") continue;
      customers.set(user.email.toLowerCase(), {
        id: user.id,
        full_name: user.full_name || "Customer",
        email: user.email,
        phone: user.phone || "—",
        address: user.address || "—",
        joined_date: user.created_at
          ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : "Recently",
        orders: [],
        reviews: [],
        payments: [],
      });
    }

    for (const order of orders || []) {
      const email = String(order.customer_email || "").trim().toLowerCase();
      if (!email || customers.has(email) || adminEmails.has(email)) continue;
      customers.set(email, {
        id: order.user_id || `cust-${order.id}`,
        full_name: order.customer_name || "Customer",
        email,
        phone: order.customer_phone || "—",
        address: order.street_address || "—",
        joined_date: order.created_at
          ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : "Recently",
        orders: [],
        reviews: [],
        payments: [],
      });
    }

    for (const customer of customers.values()) {
      const email = customer.email.toLowerCase();
      const customerOrders = (orders || []).filter((order) =>
        (order.customer_email && order.customer_email.toLowerCase() === email) ||
        (order.user_id && order.user_id === customer.id));
      customer.orders = customerOrders as Order[];
      customer.reviews = (reviews || []).filter((review) =>
        review.user_id === customer.id) as OrderReview[];
      customer.payments = customerOrders.map((order) => ({
        id: `pay-${order.id}`,
        amount: Number(order.total_amount || 0),
        date: order.created_at
          ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Recent",
        method: order.payment_method === "card" ? "Credit Card"
          : order.payment_method === "apple_pay" ? "Apple Pay"
            : order.payment_method === "google_pay" ? "Google Pay" : "Doorstep Payment",
        status: order.payment_status === "paid" ? "succeeded"
          : order.payment_status === "refunded" ? "refunded"
            : order.payment_status === "failed" ? "failed" : "pending",
        order_number: order.order_number,
      }));
    }
    return Array.from(customers.values());
  }
}
