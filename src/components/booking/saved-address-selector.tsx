"use client";

import { Check, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserAddress } from "@/lib/services/address-service";

interface SavedAddressSelectorProps {
  savedAddresses: UserAddress[];
  selectedSavedId: string | null;
  onSelectSavedAddress: (addr: UserAddress) => void;
  isAddingNew: boolean;
  onStartAddNew: () => void;
  onEditAddress?: (addr: UserAddress) => void;
}

export function SavedAddressSelector({
  savedAddresses,
  selectedSavedId,
  onSelectSavedAddress,
  isAddingNew,
  onStartAddNew,
  onEditAddress,
}: SavedAddressSelectorProps) {
  if (savedAddresses.length === 0 || isAddingNew) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Choose from your saved addresses:</span>
        <button
          type="button"
          onClick={onStartAddNew}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {savedAddresses.map((addr) => {
          const isSelected = selectedSavedId === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => onSelectSavedAddress(addr)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                isSelected
                  ? "border-primary bg-pink-50/40 ring-2 ring-primary/20 shadow-2xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{addr.label || "Home"}</span>
                    {addr.is_default && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 truncate mt-1">
                    {addr.street_address}{addr.apt_unit ? `, Apt ${addr.apt_unit}` : ""}
                  </p>
                  <p className="text-[11px] text-slate-500">{addr.city}, {addr.state} {addr.zip_code}</p>
                </div>

                {isSelected ? (
                  <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-300 shrink-0 mt-0.5" />
                )}
              </div>

              {onEditAddress && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(addr);
                    }}
                    className="text-[11px] font-bold text-slate-600 hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
