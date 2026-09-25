"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, Sparkles, Shield, Clock } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm border border-sky-100 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/brand/logo-badge.jpg"
                alt="Laundry Express Logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                  Laundry<span className="text-sky-600">Express</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                  Fast
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Doorstep Wash &amp; Fold Heroes
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#pricing" className="hover:text-sky-600 transition-colors">
              Pricing &amp; Bags
            </Link>
            <Link href="#packages" className="hover:text-sky-600 transition-colors">
              Saver Packages
            </Link>
            <Link href="#reviews" className="hover:text-sky-600 transition-colors">
              Customer Reviews
            </Link>
            <Link href="#faq" className="hover:text-sky-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${APP_CONFIG.supportPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-600 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-sky-600" />
              <span>{APP_CONFIG.supportPhone}</span>
            </a>

            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                <Shield className="h-3.5 w-3.5 text-slate-500 mr-1" />
                Admin
              </Button>
            </Link>

            <Link href="/#book-now">
              <Button variant="hero" size="sm" className="shadow-sky-500/20">
                <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-300" />
                Book Pickup
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/#book-now">
              <Button variant="hero" size="sm">
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-sky-100 bg-white/95 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 font-medium text-sm text-slate-700">
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-sky-50"
            >
              Pricing &amp; Bags ($10 or Free)
            </Link>
            <Link
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-sky-50"
            >
              Saver Packages &amp; Bundles
            </Link>
            <Link
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-sky-50"
            >
              Verified Customer Reviews
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-sky-50 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-sky-600" />
              Admin Portal
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Clock className="h-4 w-4 text-sky-600" />
            <span>Open Daily: 8am-12pm &amp; 1pm-6pm</span>
          </div>
        </div>
      )}
    </header>
  );
}
