import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
}

export interface TermItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
}

export interface BusinessSettings {
  operating_hours: string;
  delivery_zones: string[];
  min_order_bag: number;
  min_order_kg: number;
  free_delivery_bags: number;
  standard_delivery_fee: number;
}

let cachedFaqs: FaqItem[] = [];
let cachedTerms: TermItem[] = [];
let cachedSettings: BusinessSettings = {
  operating_hours: "8:00 AM – 6:00 PM Daily",
  delivery_zones: ["Lake in the Hills", "Algonquin", "Crystal Lake", "Huntley", "Cary", "Elgin", "Schaumburg"],
  min_order_bag: 1,
  min_order_kg: 5,
  free_delivery_bags: 2,
  standard_delivery_fee: 10,
};

export class ContentService {
  static async getFaqs(): Promise<FaqItem[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("faqs_and_terms").select("*").eq("category", "faq").order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        cachedFaqs = data.map((d) => ({
          id: d.id,
          question: d.title,
          answer: d.description,
          display_order: d.sort_order ?? 1,
        }));
      } else if (!error && data && data.length === 0) {
        cachedFaqs = [];
      }
    } catch {}
    return cachedFaqs;
  }

  static async saveFaq(faq: Partial<FaqItem>): Promise<FaqItem> {
    const id = faq.id || `faq-${Date.now()}`;
    const full: FaqItem = {
      id,
      question: faq.question || "New Question?",
      answer: faq.answer || "Answer details.",
      display_order: faq.display_order ?? (cachedFaqs.length + 1),
    };
    const idx = cachedFaqs.findIndex((f) => f.id === id);
    if (idx >= 0) cachedFaqs[idx] = full;
    else cachedFaqs.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("faqs_and_terms").upsert({
        id,
        category: "faq",
        title: full.question,
        description: full.answer,
        sort_order: full.display_order,
        is_active: true,
      });
    } catch {}
    return full;
  }

  static async deleteFaq(id: string): Promise<boolean> {
    cachedFaqs = cachedFaqs.filter((f) => f.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("faqs_and_terms").delete().eq("id", id);
    } catch {}
    return true;
  }

  static async getTerms(): Promise<TermItem[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("faqs_and_terms").select("*").in("category", ["term", "guarantee"]).order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        cachedTerms = data.map((d) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle || "",
          description: d.description,
        }));
      } else if (!error && data && data.length === 0) {
        cachedTerms = [];
      }
    } catch {}
    return cachedTerms;
  }

  static async saveTerm(term: Partial<TermItem>): Promise<TermItem> {
    const id = term.id || `term-${Date.now()}`;
    const full: TermItem = {
      id,
      title: term.title || "Policy Title",
      subtitle: term.subtitle || "Service Guarantee",
      description: term.description || "",
    };
    const idx = cachedTerms.findIndex((t) => t.id === id);
    if (idx >= 0) cachedTerms[idx] = full;
    else cachedTerms.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("faqs_and_terms").upsert({
        id,
        category: "term",
        title: full.title,
        subtitle: full.subtitle,
        description: full.description,
        is_active: true,
      });
    } catch {}
    return full;
  }

  static async getSettings(): Promise<BusinessSettings> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data } = await supabase.from("system_settings").select("*").eq("key", "business_operations").maybeSingle();
      if (data && data.value) {
        cachedSettings = { ...cachedSettings, ...data.value };
      }
    } catch {}
    return cachedSettings;
  }

  static async updateSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    cachedSettings = { ...cachedSettings, ...updates };
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("system_settings").upsert({
        key: "business_operations",
        value: cachedSettings,
        description: "Operating hours, delivery zones, and thresholds",
        updated_at: new Date().toISOString(),
      });
    } catch {}
    return cachedSettings;
  }
}
