"use client";

import * as React from "react";
import { Package, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export interface PackageConfig {
  id: string;
  name: string;
  description: string;
  unit_type: "bag" | "lb";
  capacity: number;
  original_price: number;
  discounted_price: number;
  is_active: boolean;
}

export function PackagesManager() {
  const [packages, setPackages] = React.useState<PackageConfig[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editPrice, setEditPrice] = React.useState<string>("");
  const [editDesc, setEditDesc] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newPrice, setNewPrice] = React.useState<string>("");
  const [newCapacity, setNewCapacity] = React.useState<string>("");
  const [newUnit, setNewUnit] = React.useState<"bag" | "lb">("bag");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("/api/plans", { cache: "no-store" }).then(async (r) => {
      const data = await r.json();
      if (!r.ok || !data.success) throw new Error(data.error || "Unable to load packages.");
      setPackages(Array.isArray(data.plans) ? data.plans : []);
    }).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unable to load packages."));
  }, []);

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsedPrice = Number(newPrice);
    const parsedCapacity = Number(newCapacity);
    if (!newName.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0 ||
      !Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
      setError("Enter a package name, positive capacity, and valid price.");
      return;
    }
    try {
      const response = await fetch("/api/plans", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(), description: newDesc.trim(), unit_type: newUnit, capacity: parsedCapacity,
          original_price: parsedPrice, discounted_price: parsedPrice, is_active: true,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to save package.");
      setPackages((prev) => [...prev, data.plan]);
      setNewName(""); setNewDesc(""); setNewPrice(""); setNewCapacity("");
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to save package.");
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setError("");
    try {
      const response = await fetch("/api/plans", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to update package.");
      setPackages((prev) => prev.map((p) => (p.id === id ? data.plan : p)));
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to update package.");
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    try {
      const response = await fetch(`/api/plans?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to delete package.");
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to delete package.");
    }
  };

  const startEdit = (pkg: PackageConfig) => {
    setEditingId(pkg.id); setEditName(pkg.name); setEditPrice(String(pkg.discounted_price)); setEditDesc(pkg.description);
  };

  const saveEdit = async (id: string) => {
    setError("");
    const parsedPrice = Number(editPrice);
    if (!editName.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a package name and valid price.");
      return;
    }
    try {
      const response = await fetch("/api/plans", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName.trim(), discounted_price: parsedPrice, description: editDesc }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to update package.");
      setPackages((prev) => prev.map((p) => (p.id === id ? data.plan : p)));
      setEditingId(null);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to update package.");
    }
  };

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <form onSubmit={handleAddPackage} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Create New Prepaid Package</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Package Title *</label>
            <input type="text" required placeholder="e.g. 5-Bag Starter Saver" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Discounted Price ($) *</label>
            <input type="number" step="0.5" required placeholder="e.g. 139.00" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Included Units *</label>
            <input type="number" required placeholder="e.g. 5" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Unit Model</label>
            <select value={newUnit} onChange={(e) => setNewUnit(e.target.value as "bag" | "lb")} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
              <option value="bag">Standard Bags (13 gal)</option>
              <option value="lb">Pounds (lbs)</option>
            </select>
          </div>
          <div className="sm:col-span-2 md:col-span-4">
            <label className="font-bold text-slate-700 block mb-1">Description &amp; Key Highlights</label>
            <textarea rows={2} placeholder="e.g. Save $23.50 upfront. Free pickup & delivery included. Valid for 6 months." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="sm" className="cursor-pointer text-xs"><Plus className="h-3.5 w-3.5 mr-1" /><span>Create Package</span></Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between gap-4 shadow-2xs">
            {editingId === pkg.id ? (
              <div className="space-y-2 text-xs">
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border font-bold" />
                <input type="number" step="0.5" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border font-bold" />
                <textarea rows={2} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border resize-none" />
                <div className="flex gap-2 justify-end pt-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 text-xs"><X className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="hero" onClick={() => saveEdit(pkg.id)} className="h-7 text-xs"><Check className="h-3.5 w-3.5 mr-1" />Save</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{pkg.name}</span>
                  <Badge variant={pkg.is_active ? "success" : "secondary"} className="text-[10px]">{pkg.is_active ? "Active" : "Disabled"}</Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900">{formatCurrency(pkg.discounted_price)}</span>
                  <span className="text-xs text-slate-400 line-through">{formatCurrency(pkg.original_price)}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{pkg.capacity} {pkg.unit_type === "bag" ? "Bags" : "lbs"} total capacity</p>
                <p className="text-xs text-slate-600 line-clamp-2">{pkg.description}</p>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={pkg.is_active} onChange={() => handleToggleActive(pkg.id, pkg.is_active)} className="rounded text-primary h-4 w-4" />
                <span className="font-bold text-slate-700 text-[11px]">{pkg.is_active ? "Active in Store" : "Inactive"}</span>
              </label>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => startEdit(pkg)} className="h-7 w-7 p-0 cursor-pointer text-slate-500 hover:text-slate-800"><Edit2 className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(pkg.id)} className="h-7 w-7 p-0 cursor-pointer text-rose-600 hover:text-rose-700"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
