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
  { id: "pkg-saver-5", name: "5-Bag Saver Bundle", description: "5 standard wash & fold pickups with free delivery.", unit_type: "bag", capacity: 5, original_price: 75.0, discounted_price: 65.0, is_active: true },
  { id: "pkg-family-10", name: "10-Bag Family Pass", description: "10 standard wash & fold pickups with priority turnaround.", unit_type: "bag", capacity: 10, original_price: 150.0, discounted_price: 125.0, is_active: true },
  { id: "pkg-bulk-25kg", name: "25-KG Bulk Pass", description: "Bulky bedsheets, comforters, and salon linen wash.", unit_type: "kg", capacity: 25, original_price: 68.75, discounted_price: 60.0, is_active: true },
];

/**
 * PackagesManager Component
 * Administrative interface to manage pre-paid discount packages.
 */
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

  const handleAddPackage = (e: React.FormEvent) => {
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
  };

  const startEdit = (pkg: PackageConfig) => {
    setEditingId(pkg.id);
    setEditName(pkg.name);
    setEditPrice(pkg.discounted_price);
    setEditDesc(pkg.description);
  };

  const saveEdit = (id: string) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: editName.trim(), discounted_price: editPrice, description: editDesc.trim() } : p
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleActive = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-sky-600" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Packages &amp; Bundles Manager</h4>
            <p className="text-xs text-slate-500">Configure pre-paid customer bundles and discount rates.</p>
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
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
          />
          <input
            type="text"
            placeholder="Short description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          <input
            type="number"
            step="0.5"
            placeholder="Price ($)"
            value={newPrice}
            onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
          />
          <select
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="bag">Bag Pass</option>
            <option value="kg">Weight (KG) Pass</option>
          </select>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Package
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => {
          const isEditing = editingId === pkg.id;
          return (
            <div key={pkg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={pkg.is_active ? "success" : "secondary"}>
                    {pkg.is_active ? "Active" : "Hidden"}
                  </Badge>
                  <span className="font-bold text-sky-700 uppercase text-[10px]">
                    {pkg.capacity} {pkg.unit_type.toUpperCase()}S
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-sky-400 rounded font-bold"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-sky-400 rounded font-bold"
                    />
                    <textarea
                      rows={2}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full px-2 py-1 border border-sky-400 rounded text-[11px]"
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="font-bold text-slate-900 text-sm">{pkg.name}</h5>
                    <p className="text-slate-500 text-[11px] mt-1">{pkg.description}</p>
                    <div className="mt-2">
                      <span className="text-lg font-black text-slate-900">{formatCurrency(pkg.discounted_price)}</span>
                      <span className="text-[11px] text-slate-400 line-through ml-2">{formatCurrency(pkg.original_price)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleActive(pkg.id)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-sky-600 cursor-pointer"
                >
                  {pkg.is_active ? "Deactivate" : "Activate"}
                </button>

                <div className="space-x-1">
                  {isEditing ? (
                    <>
                      <Button variant="primary" size="sm" onClick={() => saveEdit(pkg.id)}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => startEdit(pkg)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(pkg.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
