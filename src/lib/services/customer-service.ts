import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { CustomUserStore } from "@/lib/services/custom-user-store";
import type { CustomerAccount } from "@/components/admin/customer-detail-modal";
import type { Order, OrderReview } from "@/types";

/**
 * CustomerService
 * Queries and manages customer accounts directly from public.users (where role = 'customer').
 * Enriches customer records with order histories, payment logs, and reviews.
 * Strictly complies with the < 250 lines architectural rule.
 */
export class CustomerService {
  /**
   * Retrieves all customer accounts where role = 'customer'
   */
  static async getCustomers(): Promise<CustomerAccount[]> {
    const customerMap = new Map<string, CustomerAccount>();

    try {
      const supabase = createAdminSupabaseClient();

      // 1. Query users table strictly where role = 'customer'
      const { data: dbUsers, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (!userError && Array.isArray(dbUsers)) {
        for (const u of dbUsers) {
          customerMap.set(u.email.toLowerCase(), {
            id: u.id,
            full_name: u.full_name || "Customer",
            email: u.email,
            phone: u.phone || "—",
            address: u.address || "—",
            joined_date: u.created_at
              ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Recently",
            orders: [],
            reviews: [],
            payments: [],
          });
        }
      }

      // 2. Query in-memory user registry for local customer accounts
      const memoryUsers = CustomUserStore.getAllUsers();
      for (const mu of memoryUsers) {
        if (mu.role === "customer" && !customerMap.has(mu.email.toLowerCase())) {
          customerMap.set(mu.email.toLowerCase(), {
            id: mu.id,
            full_name: mu.full_name || "Customer",
            email: mu.email,
            phone: mu.phone || "—",
            address: mu.address || "—",
            joined_date: mu.created_at
              ? new Date(mu.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Recently",
            orders: [],
            reviews: [],
            payments: [],
          });
        }
      }

      // 3. Query all orders to link to respective customers
      const { data: dbOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      const orders = (dbOrders || []) as Order[];

      // 4. Query all reviews to link to respective customers
      const { data: dbReviews } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      const reviews = (dbReviews || []) as OrderReview[];

      // 5. If orders exist for customer emails not yet in users table (e.g. guest bookings), include them as customers
      for (const ord of orders) {
        const email = (ord.customer_email || "").trim().toLowerCase();
        if (email && !customerMap.has(email)) {
          // Check if this email is an admin before adding
          const isKnownAdmin = email === "admin@laundryexpress.com" || email === "ajshajimmax@gmail.com";
          if (!isKnownAdmin) {
            customerMap.set(email, {
              id: ord.user_id || `cust-${ord.id}`,
              full_name: ord.customer_name || ord.user?.full_name || "Customer",
              email: ord.customer_email || email,
              phone: ord.customer_phone || ord.user?.phone || "—",
              address: ord.pickup_address || ord.street_address || "—",
              joined_date: ord.created_at
                ? new Date(ord.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                : "Recently",
              orders: [],
              reviews: [],
              payments: [],
            });
          }
        }
      }

      // 6. Enrich each customer with their orders, reviews, and payment history
      for (const customer of customerMap.values()) {
        const custEmail = customer.email.toLowerCase();
        const custId = customer.id;

        const custOrders = orders.filter(
          (o) => (o.customer_email && o.customer_email.toLowerCase() === custEmail) || (o.user_id && o.user_id === custId)
        );
        customer.orders = custOrders;

        customer.reviews = reviews.filter(
          (r) => r.user_id === custId || (r.customer_name && r.customer_name.toLowerCase() === customer.full_name.toLowerCase())
        );

        customer.payments = custOrders.map((o) => ({
          id: `pay-${o.id}`,
          amount: Number(o.total_amount || 0),
          date: o.created_at
            ? new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Recent",
          method:
            o.payment_method === "card"
              ? "Credit Card"
              : o.payment_method === "apple_pay"
              ? "Apple Pay"
              : o.payment_method === "google_pay"
              ? "Google Pay"
              : "Doorstep Payment",
          status:
            o.order_status === "cancelled"
              ? "refunded"
              : o.payment_status === "paid" || o.order_status === "completed"
              ? "succeeded"
              : "pending",
          order_number: o.order_number,
        }));
      }
    } catch (err: unknown) {
      console.error("CustomerService.getCustomers error:", err instanceof Error ? err.message : err);
    }

    return Array.from(customerMap.values());
  }
}
