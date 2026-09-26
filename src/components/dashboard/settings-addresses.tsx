"use client";

import * as React from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: SavedAddress[] = [
  { id: "addr-1", label: "Home", street: "742 Evergreen Terrace", apt: "Unit 2B", city: "Lake in the Hills", state: "IL", zip: "60156", isDefault: true },
  { id: "addr-2", label: "Office", street: "1200 Commercial Pkwy", apt: "Suite 400", city: "Algonquin", state: "IL", zip: "60102", isDefault: false },
];

/**
 * SettingsAddresses Component
 * Implements AGENTS.md 5.e.2:
 * Manage customer pickup & delivery addresses (add, edit, delete).
 */
export function SettingsAddresses() {
  const [addresses, setAddresses] = React.useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [label, setLabel] = React.useState("Home");
  const [street, setStreet] = React.useState("");
  const [apt, setApt] = React.useState("");
  const [city, setCity] = React.useState("Lake in the Hills");
  const [state, setState] = React.useState("IL");
  const [zip, setZip] = React.useState("60156");
  const [isDefault, setIsDefault] = React.useState(false);

  const resetForm = () => {
    setLabel("Home");
    setStreet("");
    setApt("");
    setCity("Lake in the Hills");
    setState("IL");
    setZip("60156");
    setIsDefault(false);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !zip.trim()) return;

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, label, street: street.trim(), apt: apt.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), isDefault }
            : isDefault ? { ...a, isDefault: false } : a
        )
      );
    } else {
      const newAddr: SavedAddress = {
        id: `addr-${Date.now()}`,
        label,
        street: street.trim(),
        apt: apt.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        isDefault: addresses.length === 0 || isDefault,
      };
      setAddresses((prev) => (isDefault ? prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr) : [...prev, newAddr]));
    }
    resetForm();
  };

  const handleEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setStreet(addr.street);
    setApt(addr.apt || "");
    setCity(addr.city);
    setState(addr.state);
    setZip(addr.zip);
    setIsDefault(addr.isDefault);
    setIsAdding(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-black text-slate-900">Saved Delivery Addresses</h3>
          <p className="text-xs text-slate-500">Add, edit, or delete frequent pickup addresses for 1-click checkout.</p>
        </div>
        {!isAdding && (
          <Button variant="hero" size="sm" onClick={() => setIsAdding(true)} className="cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Address
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <span className="font-bold text-slate-800 block uppercase">
            {editingId ? "Edit Address" : "Add Address"}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Label</label>
              <select value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold">
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Apartment">Apartment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1 font-semibold">Street *</label>
              <input type="text" required placeholder="742 Evergreen Terrace" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white" />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Apt / Unit</label>
              <input type="text" placeholder="Apt 2B" value={apt} onChange={(e) => setApt(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white" />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">City *</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white" />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">State / Zip *</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input type="text" required maxLength={2} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} className="px-2 py-2 rounded-xl border border-slate-200 bg-white text-center font-bold" />
                <input type="text" required value={zip} onChange={(e) => setZip(e.target.value)} className="px-2 py-2 rounded-xl border border-slate-200 bg-white text-center font-bold" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded border-slate-300 text-primary" />
              <span>Set as primary default address</span>
            </label>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={resetForm} className="cursor-pointer">Cancel</Button>
              <Button type="submit" variant="hero" size="sm" className="cursor-pointer">Save Address</Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900">{addr.label}</span>
                {addr.isDefault && <Badge variant="success" className="text-[10px] font-bold">Default</Badge>}
              </div>
              <p className="text-slate-800 font-medium">{addr.street} {addr.apt}</p>
              <p className="text-slate-500">{addr.city}, {addr.state} {addr.zip}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
              <Button variant="outline" size="sm" onClick={() => handleEdit(addr)} className="h-7 px-2 cursor-pointer">
                <Edit2 className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => setAddresses((p) => p.filter((a) => a.id !== addr.id))} className="h-7 px-2 cursor-pointer">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
