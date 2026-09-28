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
  min_order_lbs: number;
  free_delivery_bags: number;
  free_delivery_lbs: number;
  standard_delivery_fee: number;
}

const isUuid = (val?: string): boolean =>
  Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

let cachedFaqs: FaqItem[] = [];
let cachedTerms: TermItem[] = [];
let cachedSettings: BusinessSettings = {
  operating_hours: "8:00 AM – 6:00 PM Daily",
  delivery_zones: ["Lake in the Hills", "Algonquin", "Crystal Lake", "Huntley", "Cary", "Elgin", "Schaumburg"],
  min_order_bag: 1,
  min_order_lbs: 10,
  free_delivery_bags: 2,
  free_delivery_lbs: 30,
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
    const question = (faq.question || "New Question?").trim();
    const answer = (faq.answer || "Answer details.").trim();
    const display_order = faq.display_order ?? (cachedFaqs.length + 1);
    let finalId = isUuid(faq.id) ? faq.id! : "";

    const dbPayload: Record<string, unknown> = {
      category: "faq",
      title: question,
      description: answer,
      sort_order: display_order,
      is_active: true,
    };
    if (finalId) dbPayload.id = finalId;

    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("faqs_and_terms").upsert(dbPayload).select().single();
      if (!error && data?.id) {
        finalId = data.id;
      }
    } catch {}

    const full: FaqItem = {
      id: finalId || faq.id || `faq-${Date.now()}`,
      question,
      answer,
      display_order,
    };

    const idx = cachedFaqs.findIndex((f) => (finalId && f.id === finalId) || f.question === question);
    if (idx >= 0) cachedFaqs[idx] = full;
    else cachedFaqs.push(full);

    return full;
  }

  static async deleteFaq(id: string): Promise<boolean> {
    cachedFaqs = cachedFaqs.filter((f) => f.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      if (isUuid(id)) await supabase.from("faqs_and_terms").delete().eq("id", id);
      else await supabase.from("faqs_and_terms").delete().eq("title", id);
    } catch {}
    return true;
  }

  static async deleteTerm(id: string): Promise<boolean> {
    cachedTerms = cachedTerms.filter((t) => t.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      if (isUuid(id)) await supabase.from("faqs_and_terms").delete().eq("id", id);
      else await supabase.from("faqs_and_terms").delete().eq("title", id);
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
    const title = (term.title || "Policy Title").trim();
    const subtitle = (term.subtitle || "Service Guarantee").trim();
    const description = (term.description || "").trim();
    let finalId = isUuid(term.id) ? term.id! : "";

    const dbPayload: Record<string, unknown> = {
      category: "term",
      title,
      subtitle,
      description,
      is_active: true,
    };
    if (finalId) dbPayload.id = finalId;

    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("faqs_and_terms").upsert(dbPayload).select().single();
      if (!error && data?.id) {
        finalId = data.id;
      }
    } catch {}

    const full: TermItem = {
      id: finalId || term.id || `term-${Date.now()}`,
      title,
      subtitle,
      description,
    };

    const idx = cachedTerms.findIndex((t) => (finalId && t.id === finalId) || t.title === title);
    if (idx >= 0) cachedTerms[idx] = full;
    else cachedTerms.push(full);

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
