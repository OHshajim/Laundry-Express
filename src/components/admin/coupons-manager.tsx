"use client";

import * as React from "react";
import { Tag, Plus, Trash2, Edit2, Check, X, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CouponItem } from "@/lib/services/coupon-service";

export function CouponsManager() {
  const [coupons, setCoupons] = React.useState<CouponItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form states for creation
  const [title, setTitle] = React.useState("");
  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"percentage" | "fixed_amount" | "free_delivery">("percentage");
  const [discountValue, setDiscountValue] = React.useState<number>(15);
  const [minOrder, setMinOrder] = React.useState<number>(0);
  const [expiresAt, setExpiresAt] = React.useState("");
  const [maxUses, setMaxUses] = React.useState<string>("");

  // Edit states
  const [editItem, setEditItem] = React.useState<Partial<CouponItem>>({});

  const loadCoupons = React.useCallback(() => {
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const payload: Partial<CouponItem> = {
      title: title.trim() || `${code.trim().toUpperCase()} Promo`,
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrder || 0),
      expires_at: expiresAt || undefined,
      max_uses: maxUses ? Number(maxUses) : undefined,
      is_active: true,
    };

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setCoupons((prev) => [data.coupon, ...prev.filter((c) => c.code !== data.coupon.code)]);
      }
    } catch { }

    setTitle("");
    setCode("");
    setDiscountValue(15);
    setMinOrder(0);
    setExpiresAt("");
    setMaxUses("");
  };

  const handleToggle = async (c: CouponItem) => {
    const updated = { ...c, is_active: !c.is_active };
    setCoupons((prev) => prev.map((item) => (item.id === c.id ? updated : item)));
    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch { }
  };

  const handleDelete = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/coupons?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch { }
  };

  const startEdit = (c: CouponItem) => {
    setEditingId(c.id);
    setEditItem({ ...c });
  };

  const saveEdit = async () => {
    if (!editingId || !editItem.code) return;
    setCoupons((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...editItem } as CouponItem : c)));
    setEditingId(null);
    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      });
    } catch { }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-pink-100 text-primary flex items-center justify-center">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm tracking-tight">Promo Codes &amp; Token Offers</h4>
            <p className="text-xs text-slate-500">Configure promotional vouchers, discounts, and minimum requirements.</p>
          </div>
        </div>
        <Badge variant="outline" className="text-primary font-bold text-xs">{coupons.length} Active Codes</Badge>
      </div>

      <form onSubmit={handleCreateCoupon} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 text-xs">
        <span className="font-extrabold text-slate-900 block uppercase tracking-wider text-[11px]">Generate Promo Token</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Campaign Title / Name (e.g. Spring Sale)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          />
          <input
            type="text"
            required
            placeholder="PROMO CODE (e.g. SPRING20)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold uppercase"
          />
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
          >
            <option value="percentage">Percentage Off (%)</option>
            <option value="fixed_amount">Fixed Amount ($)</option>
            <option value="free_delivery">100% Free Delivery</option>
          </select>
          <input
            type="number"
            step="0.5"
            placeholder="Discount (e.g. 15)"
            value={discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
          />
          <input
            type="number"
            step="1"
            placeholder="Min Order Value ($)"
            value={minOrder}
            onChange={(e) => setMinOrder(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          />
          <input
            type="date"
            placeholder="Expiration Date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-600"
          />
          <input
            type="number"
            placeholder="Max Uses Limit (optional)"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          />
          <Button type="submit" variant="hero" size="sm" className="h-9 font-bold text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Create Promo Token</span>
          </Button>
        </div>
      </form>

      <div className="divide-y border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
        {coupons.map((c) => (
          <div key={c.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
            {editingId === c.id ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-xs">
                <input
                  type="text"
                  value={editItem.title || ""}
                  onChange={(e) => setEditItem((p) => ({ ...p, title: e.target.value }))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium"
                  placeholder="Offer Name"
                />
                <input
                  type="text"
                  value={editItem.code || ""}
                  onChange={(e) => setEditItem((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold uppercase"
                />
                <input
                  type="number"
                  value={editItem.discount_value ?? 0}
                  onChange={(e) => setEditItem((p) => ({ ...p, discount_value: Number(e.target.value) }))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold"
                />
                <input
                  type="number"
                  value={editItem.min_order_amount ?? 0}
                  onChange={(e) => setEditItem((p) => ({ ...p, min_order_amount: Number(e.target.value) }))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300"
                  placeholder="Min Spend ($)"
                />
                <div className="flex gap-2 col-span-full">
                  <Button size="sm" onClick={saveEdit} className="h-7 text-xs font-bold">
                    <Check className="h-3 w-3 mr-1" /> Save Updates
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="h-7 text-xs font-medium">
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-slate-900 text-sm px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                    {c.code}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{c.title}</span>
                  <Badge variant={c.is_active ? "success" : "secondary"}>
                    {c.is_active ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="font-bold text-primary">
                    {c.discount_type === "free_delivery" ? "Free Delivery ($10 value)" : c.discount_type === "percentage" ? `${c.discount_value}% OFF` : `$${c.discount_value} OFF`}
                  </span>
                  {c.min_order_amount > 0 && <span>• Min Order: ${c.min_order_amount}</span>}
                  {c.expires_at && <span className="flex items-center gap-1">• Exp: {c.expires_at.split("T")[0]}</span>}
                </div>
              </div>
            )}

            {editingId !== c.id && (
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <Button variant="outline" size="sm" onClick={() => handleToggle(c)} className="h-8 text-xs font-bold">
                  {c.is_active ? "Disable" : "Enable"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => startEdit(c)} className="h-8 text-xs">
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)} className="h-8 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CouponsManager;
