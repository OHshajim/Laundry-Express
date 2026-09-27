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

  React.useEffect(() => {
    fetch("/api/user/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses && data.addresses.length > 0) {
          setAddresses(data.addresses.map((a: any) => ({
            id: a.id,
            label: a.label,
            street: a.street_address,
            apt: a.apt_unit,
            city: a.city,
            state: a.state,
            zip: a.zip_code,
            isDefault: a.is_default,
          })));
        }
      })
      .catch(() => {});
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !zip.trim()) return;

    const newAddr: SavedAddress = {
      id: editingId || `addr-${Date.now()}`,
      label,
      street: street.trim(),
      apt: apt.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      isDefault,
    };

    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? newAddr : a)));
    } else {
      setAddresses((prev) => [newAddr, ...prev]);
    }

    try {
      await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newAddr.id,
          label: newAddr.label,
          street_address: newAddr.street,
          apt_unit: newAddr.apt,
          city: newAddr.city,
          state: newAddr.state,
          zip_code: newAddr.zip,
          is_default: newAddr.isDefault,
        }),
      });
    } catch {}

    resetForm();
  };

  const handleStartEdit = (addr: SavedAddress) => {
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

  const handleDelete = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/user/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {}
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Saved Addresses</h3>
          <p className="text-xs text-slate-500">Manage pickup and delivery locations dynamically in database.</p>
        </div>
        {!isAdding && (
          <Button size="sm" variant="hero" onClick={() => setIsAdding(true)} className="cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Address</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Label (e.g. Home, Office)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
            <input
              type="text"
              required
              placeholder="Street Address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
            <input
              type="text"
              placeholder="Apt, Suite, Unit (optional)"
              value={apt}
              onChange={(e) => setApt(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
              <input
                type="text"
                required
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-1/4 px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
              <input
                type="text"
                required
                placeholder="ZIP"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-1/4 px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded text-primary" />
              <span className="font-semibold text-slate-700">Set as default pickup location</span>
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={resetForm} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
                Save Address
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {addresses.map((a) => (
          <div key={a.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">{a.label}</span>
                {a.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{a.street}{a.apt ? `, ${a.apt}` : ""}, {a.city}, {a.state} {a.zip}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => handleStartEdit(a)} className="h-7 w-7 p-0 cursor-pointer">
                <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)} className="h-7 w-7 p-0 cursor-pointer text-rose-600">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
