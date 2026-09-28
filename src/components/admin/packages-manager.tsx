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

  React.useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.plans && data.plans.length > 0) setPackages(data.plans);
      })
      .catch(() => {});
  }, []);

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice.trim()) return;

    const parsedPrice = parseFloat(newPrice) || 0;
    const parsedCapacity = parseInt(newCapacity, 10) || 1;

    const newPkg: PackageConfig = {
      id: `pkg-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || "Discounted prepaid laundry pass.",
      unit_type: newUnit,
      capacity: parsedCapacity,
      original_price: Math.round(parsedPrice * 1.25 * 100) / 100,
      discounted_price: parsedPrice,
      is_active: true,
    };

    setPackages((prev) => [...prev, newPkg]);
    setNewName("");
    setNewDesc("");
    setNewPrice("");
    setNewCapacity("");

    try {
      await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPkg),
      });
    } catch {}
  };

  const startEdit = (pkg: PackageConfig) => {
    setEditingId(pkg.id);
    setEditName(pkg.name);
    setEditPrice(String(pkg.discounted_price));
    setEditDesc(pkg.description);
  };

  const saveEdit = async (id: string) => {
    const existing = packages.find((p) => p.id === id);
    if (!existing) return;
    const updated = {
      ...existing,
      name: editName.trim(),
      discounted_price: parseFloat(editPrice) || existing.discounted_price,
      description: editDesc.trim(),
    };

    setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);

    try {
      await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/plans?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {}
  };

  const toggleActive = async (id: string) => {
    const existing = packages.find((p) => p.id === id);
    if (!existing) return;
    const updated = { ...existing, is_active: !existing.is_active };

    setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)));

    try {
      await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Saver Packages &amp; Bundles Manager</h4>
            <p className="text-xs text-slate-500">Create and toggle customer bundles with prepaid bags or pounds.</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {packages.length} Packages Configured
        </span>
      </div>

      {/* Creation Form */}
      <form onSubmit={handleAddPackage} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-black text-slate-800 uppercase tracking-wider block">Create New Saver Package</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Package Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Student Monthly Pass"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Discounted Price ($)</label>
            <input
              type="number"
              step="0.5"
              required
              min={1}
              placeholder="e.g. 59.99"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Included Units</label>
            <input
              type="number"
              required
              min={1}
              placeholder="e.g. 4"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Unit Model</label>
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value as "bag" | "lb")}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="bag">Prepaid Bags (13 gal)</option>
              <option value="lb">Prepaid Pounds (lbs)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description &amp; Key Highlights</label>
          <textarea
            rows={2}
            placeholder="e.g. Includes 4 large 13-gallon laundry bags with 30-day validity, free priority pickup, and door delivery."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Create Package</span>
          </Button>
        </div>
      </form>

      {/* Package List */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:bg-slate-50/50">
            {editingId === pkg.id ? (
              <div className="flex-1 space-y-2 w-full text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Package Title</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Price ($)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-40 px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Description</label>
                  <textarea
                    rows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={() => saveEdit(pkg.id)} className="cursor-pointer text-xs h-7">
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
                  <span className="font-bold text-slate-900 text-sm">{pkg.name}</span>
                  <Badge variant={pkg.is_active ? "success" : "secondary"}>
                    {pkg.is_active ? "Active" : "Archived"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">{pkg.description}</p>
                <div className="text-xs font-bold text-primary mt-1">
                  {formatCurrency(pkg.discounted_price)} • {pkg.capacity} {pkg.unit_type === "bag" ? "Bags" : "lbs"}
                </div>
              </div>
            )}

            {editingId !== pkg.id && (
              <div className="flex items-center gap-3 self-end sm:self-center">
                {/* Interactive Toggle Switch */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">{pkg.is_active ? "Active" : "Inactive"}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={pkg.is_active}
                    onClick={() => toggleActive(pkg.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      pkg.is_active ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        pkg.is_active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <Button variant="outline" size="sm" onClick={() => startEdit(pkg)} className="cursor-pointer text-xs h-8 px-2.5">
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(pkg.id)} className="cursor-pointer text-xs h-8 px-2.5 text-rose-600 hover:bg-rose-50">
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

export default PackagesManager;
