"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * PlanPackagesGrid Component
 *
 * Displays pre-paid saver packages with bundled discounts:
 * 1. 5-Bag Saver Bundle ($65, save $10)
 * 2. 10-Bag Family Pass ($125, save $25)
 * 3. 25-KG Bulk Pass ($60, save $8.75)
 */
export function PlanPackagesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Card 1: 5-Bag Saver */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between">
        <div>
          <Badge variant="secondary" className="mb-3">Save $10.00</Badge>
          <h3 className="text-xl font-black text-slate-900">5-Bag Saver Bundle</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">5 standard wash &amp; fold pickups</p>
          <div className="mb-4">
            <span className="text-3xl font-black text-slate-900">$65.00</span>
            <span className="text-xs text-slate-400 line-through ml-2">$75.00</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Free delivery on all 5 bags</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Never expires</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Shareable with housemates</span>
            </li>
          </ul>
        </div>
        <Link href="/order?package=pkg-saver-5" className="mt-6 block">
          <Button variant="outline" className="w-full">Select 5-Bag Bundle</Button>
        </Link>
      </div>

      {/* Card 2: 10-Bag Family Pass */}
      <div className="bg-white rounded-3xl p-6 border-2 border-sky-500 shadow-xl flex flex-col justify-between relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
          Best Family Value
        </div>
        <div>
          <Badge variant="success" className="mb-3">Save $25.00</Badge>
          <h3 className="text-xl font-black text-slate-900">10-Bag Family Pass</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">10 standard wash &amp; fold pickups</p>
          <div className="mb-4">
            <span className="text-3xl font-black text-slate-900">$125.00</span>
            <span className="text-xs text-slate-400 line-through ml-2">$150.00</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Priority 24h turnaround</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Free delivery on all 10 bags</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Choice of hypoallergenic wash</span>
            </li>
          </ul>
        </div>
        <Link href="/order?package=pkg-family-10" className="mt-6 block">
          <Button variant="hero" className="w-full">Select Family Pass</Button>
        </Link>
      </div>

      {/* Card 3: 25-KG Bulk Pass */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between">
        <div>
          <Badge variant="secondary" className="mb-3">Commercial Rate</Badge>
          <h3 className="text-xl font-black text-slate-900">25-KG Bulk Pass</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Bulky bedsheets &amp; comforters</p>
          <div className="mb-4">
            <span className="text-3xl font-black text-slate-900">$60.00</span>
            <span className="text-xs text-slate-400 line-through ml-2">$68.75</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Digital scale photo proof</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Free commercial delivery</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Pre-treatment for stains</span>
            </li>
          </ul>
        </div>
        <Link href="/order?package=pkg-bulk-25kg" className="mt-6 block">
          <Button variant="outline" className="w-full">Select Bulk Pass</Button>
        </Link>
      </div>
    </div>
  );
}
