"use client";

import * as React from "react";
import { Tag, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CouponItem {
  id: string;
  code: string;
  title?: string;
  discount: string;
  discount_amount: number;
  discount_type: "percentage" | "fixed_amount" | "free_delivery";
  active: boolean;
}

const INITIAL_COUPONS: CouponItem[] = [
  { id: "cpn-1", code: "HEROFRESH", discount: "15% OFF Subtotal", discount_amount: 15, discount_type: "percentage", active: true },
  { id: "cpn-2", code: "FREESHIP", discount: "Free 1-Bag Delivery ($10 OFF)", discount_amount: 10, discount_type: "free_delivery", active: true },
  { id: "cpn-3", code: "WELCOME5", discount: "$5.00 Flat Discount", discount_amount: 5, discount_type: "fixed_amount", active: false },
];

export function CouponsManager() {
  const [coupons, setCoupons] = React.useState<CouponItem[]>(INITIAL_COUPONS);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editCode, setEditCode] = React.useState("");
  const [editDiscount, setEditDiscount] = React.useState("");

  const [newCode, setNewCode] = React.useState("");
  const [newDiscount, setNewDiscount] = React.useState("");
  const [newType, setNewType] = React.useState<"percentage" | "fixed_amount" | "free_delivery">("percentage");

  React.useEffect(() => {
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (data.coupons && data.coupons.length > 0) {
          setCoupons(data.coupons.map((c: any) => ({
            id: c.id,
            code: c.code,
            title: c.title,
            discount: `${c.discount_value}${c.discount_type === "percentage" ? "%" : "$"} OFF`,
            discount_amount: c.discount_value,
            discount_type: c.discount_type,
            active: c.is_active,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const val = parseFloat(newDiscount) || 10;
    const newItem: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discount: newDiscount.trim() || `${val}% OFF`,
      discount_amount: val,
      discount_type: newType,
      active: true,
    };

    setCoupons((prev) => [newItem, ...prev]);
    setNewCode("");
    setNewDiscount("");

    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newItem.code,
          title: newItem.discount,
          discount_type: newItem.discount_type,
          discount_value: newItem.discount_amount,
          is_active: true,
        }),
      });
    } catch {}
  };

  const handleDeleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/coupons?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {}
  };

  const handleToggleActive = async (id: string) => {
    const existing = coupons.find((c) => c.id === id);
    if (!existing) return;
    const updated = { ...existing, active: !existing.active };

    setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));

    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          code: updated.code,
          title: updated.discount,
          discount_type: updated.discount_type,
          discount_value: updated.discount_amount,
          is_active: updated.active,
        }),
      });
    } catch {}
  };

  const startEdit = (coupon: CouponItem) => {
    setEditingId(coupon.id);
    setEditCode(coupon.code);
    setEditDiscount(coupon.discount);
  };

  const saveEdit = async (id: string) => {
    const existing = coupons.find((c) => c.id === id);
    if (!existing) return;
    const updated = { ...existing, code: editCode.trim().toUpperCase(), discount: editDiscount.trim() };

    setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setEditingId(null);

    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          code: updated.code,
          title: updated.discount,
          discount_type: updated.discount_type,
          discount_value: updated.discount_amount,
          is_active: updated.active,
        }),
      });
    } catch {}
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-pink-600" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Coupon &amp; Offer Manager</h4>
            <p className="text-xs text-slate-500">Create, edit, toggle active status, or delete promo codes in live database.</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">{coupons.length} Active Offers</span>
      </div>

      <form onSubmit={handleAddCoupon} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-800 block uppercase">Create New Promo Code</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="CODE (e.g. FLASH20)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold uppercase"
          />
          <input
            type="text"
            required
            placeholder="Discount Value (e.g. 15)"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed_amount">Fixed Amount ($)</option>
            <option value="free_delivery">Free Delivery</option>
          </select>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Save to Database</span>
          </Button>
        </div>
      </form>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:bg-slate-50/50">
            {editingId === coupon.id ? (
              <div className="flex-1 space-y-2 w-full text-xs">
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold uppercase"
                />
                <input
                  type="text"
                  value={editDiscount}
                  onChange={(e) => setEditDiscount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveEdit(coupon.id)} className="cursor-pointer text-xs h-7">
                    <Check className="h-3 w-3 mr-1" /> Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="cursor-pointer text-xs h-7">
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{coupon.code}</span>
                  <Badge variant={coupon.active ? "success" : "secondary"}>
                    {coupon.active ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{coupon.discount}</p>
              </div>
            )}

            {editingId !== coupon.id && (
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(coupon.id)} className="cursor-pointer text-xs h-8">
                  {coupon.active ? "Disable" : "Enable"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => startEdit(coupon)} className="cursor-pointer text-xs h-8">
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteCoupon(coupon.id)} className="cursor-pointer text-xs h-8 text-rose-600 hover:bg-rose-50">
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
