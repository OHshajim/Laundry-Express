import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-compatible Supabase client for client components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-supabase.laundryexpress.com";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

  return createBrowserClient(supabaseUrl, supabaseKey);
}
