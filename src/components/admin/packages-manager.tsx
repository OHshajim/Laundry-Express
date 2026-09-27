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
  unit_type: "bag" | "kg";
  capacity: number;
  original_price: number;
  discounted_price: number;
  is_active: boolean;
}

const INITIAL_PACKAGES: PackageConfig[] = [
  { id: "pkg-saver-5", name: "5-Bag Saver Bundle", description: "5 standard wash & fold pickups with free delivery.", unit_type: "bag", capacity: 5, original_price: 162.5, discounted_price: 145.0, is_active: true },
  { id: "pkg-family-10", name: "10-Bag Family Pass", description: "10 standard wash & fold pickups with priority turnaround.", unit_type: "bag", capacity: 10, original_price: 325.0, discounted_price: 280.0, is_active: true },
  { id: "pkg-bulk-25kg", name: "25-KG Bulk Pass", description: "Bulky bedsheets, comforters, and salon linen wash.", unit_type: "kg", capacity: 25, original_price: 68.75, discounted_price: 60.0, is_active: true },
];

export function PackagesManager() {
  const [packages, setPackages] = React.useState<PackageConfig[]>(INITIAL_PACKAGES);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [editName, setEditName] = React.useState("");
  const [editPrice, setEditPrice] = React.useState<number>(0);
  const [editDesc, setEditDesc] = React.useState("");

  const [newName, setNewName] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newPrice, setNewPrice] = React.useState<number>(50);
  const [newCapacity, setNewCapacity] = React.useState<number>(4);
  const [newUnit, setNewUnit] = React.useState<"bag" | "kg">("bag");

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
    if (!newName.trim()) return;

    const newPkg: PackageConfig = {
      id: `pkg-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || "Discounted prepaid laundry pass.",
      unit_type: newUnit,
      capacity: newCapacity,
      original_price: newPrice * 1.2,
      discounted_price: newPrice,
      is_active: true,
    };

    setPackages((prev) => [...prev, newPkg]);
    setNewName("");
    setNewDesc("");

    try {
      await fetch("/api/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newPkg) });
    } catch {}
  };

  const startEdit = (pkg: PackageConfig) => {
    setEditingId(pkg.id);
    setEditName(pkg.name);
    setEditPrice(pkg.discounted_price);
    setEditDesc(pkg.description);
  };

  const saveEdit = async (id: string) => {
    const existing = packages.find((p) => p.id === id);
    if (!existing) return;
    const updated = { ...existing, name: editName.trim(), discounted_price: editPrice, description: editDesc.trim() };

    setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);

    try {
      await fetch("/api/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
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
      await fetch("/api/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    } catch {}
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-sky-600" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Packages &amp; Bundles Manager</h4>
            <p className="text-xs text-slate-500">Configure pre-paid customer bundles and discount rates in live database.</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">{packages.length} Packages Configured</span>
      </div>

      <form onSubmit={handleAddPackage} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-800 block uppercase">Create New Saver Package</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Package Name (e.g. Student Pass)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          <input
            type="number"
            required
            min={1}
            placeholder="Price ($)"
            value={newPrice}
            onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          <div className="flex gap-2">
            <input
              type="number"
              required
              min={1}
              placeholder="Capacity"
              value={newCapacity}
              onChange={(e) => setNewCapacity(parseInt(e.target.value, 10) || 1)}
              className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value as "bag" | "kg")}
              className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="bag">Bags</option>
              <option value="kg">KGs</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Key Highlight or Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Package to Database</span>
          </Button>
        </div>
      </form>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:bg-slate-50/50">
            {editingId === pkg.id ? (
              <div className="flex-1 space-y-2 w-full text-xs">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold"
                />
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                  className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
                <div className="flex gap-2">
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
                <p className="text-xs text-slate-500 mt-0.5">{pkg.description}</p>
                <div className="text-xs font-bold text-sky-700 mt-1">
                  {formatCurrency(pkg.discounted_price)} • {pkg.capacity} {pkg.unit_type === "bag" ? "Bags" : "KG"}
                </div>
              </div>
            )}

            {editingId !== pkg.id && (
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button variant="outline" size="sm" onClick={() => toggleActive(pkg.id)} className="cursor-pointer text-xs h-8">
                  {pkg.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => startEdit(pkg)} className="cursor-pointer text-xs h-8">
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(pkg.id)} className="cursor-pointer text-xs h-8 text-rose-600 hover:bg-rose-50">
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
