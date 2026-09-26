"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Eye, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CustomerAccount } from "./customer-detail-modal";

interface CustomerCardProps {
  customer: CustomerAccount;
  onSelectCustomer: (customer: CustomerAccount) => void;
}

/**
 * CustomerCard Component
 *
 * Dedicated mobile and tablet card view for customer directory.
 * Prevents horizontal scrolling on small/medium screens.
 */
export function CustomerCard({ customer, onSelectCustomer }: CustomerCardProps) {
  const custTotalSpent = customer.orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div
      onClick={() => onSelectCustomer(customer)}
      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-primary/50 transition-all cursor-pointer space-y-3"
    >
      {/* Customer Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-800 font-black flex items-center justify-center text-xs shrink-0">
            {customer.full_name.charAt(0)}
          </div>
          <div className="truncate">
            <span className="font-bold text-slate-900 text-sm block truncate">
              {customer.full_name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              Joined {customer.joined_date}
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-[10px] shrink-0">
          {customer.orders.length} order{customer.orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Contact & Location Details */}
      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 truncate">
          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <a
            href={`mailto:${customer.email}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-primary truncate"
          >
            {customer.email}
          </a>
        </div>

        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <a
            href={`tel:${customer.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-primary font-medium"
          >
            {customer.phone}
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
          <span className="truncate">{customer.address}</span>
        </div>
      </div>

      {/* Footer Metrics & Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Spent</span>
          <span className="font-black text-slate-900 text-sm">
            {formatCurrency(custTotalSpent)}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs text-slate-700 hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCustomer(customer);
          }}
        >
          <Eye className="h-3.5 w-3.5 mr-1 shrink-0" />
          View Profile
        </Button>
      </div>
    </div>
  );
}

export default CustomerCard;
