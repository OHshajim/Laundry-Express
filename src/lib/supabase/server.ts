import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User, Order } from "@/types";

/**
 * Creates a server-side Supabase client for Server Components, Server Actions, and API routes.
 * Utilizes Next.js cookies() API for secure cookie-based session management.
 * Strictly adheres to 100-250 lines rule.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  return createServerClient(supabaseUrl, apiKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Handled when called from a Server Component where cookies cannot be set directly
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // Handled when called from a Server Component
        }
      },
    },
  });
}

/**
 * Retrieves the currently authenticated user from the server session.
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    const authUser = session.user;

    // Fetch corresponding profile record from public.users table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) {
      // Fallback to auth metadata if profile query fails
      return {
        id: authUser.id,
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name || "Customer",
        phone: authUser.user_metadata?.phone,
        role: (authUser.user_metadata?.role as "customer" | "admin") || "customer",
        is_active: true,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at,
      };
    }

    return profile as User;
  } catch (err) {
    console.error("Failed to retrieve server user:", err);
    return null;
  }
}

/**
 * Checks if the active server session belongs to an operations administrator.
 */
export async function isServerAdmin(): Promise<boolean> {
  const user = await getServerUser();
  return user?.role === "admin";
}

/**
 * Fetches recent orders for the active authenticated customer.
 */
export async function getServerCustomerOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, proofs:order_proofs(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Order[];
  } catch (err) {
    console.error(`Failed to fetch orders for user ${userId}:`, err);
    return [];
  }
}
