"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";

/**
 * Navbar Component
 *
 * Sticky navigation with transparent-to-pink scroll transition:
 * - Transparent at page top, solid Bubble Pink (var(--primary)) when scrolled
 * - Uses /hero.jpg emblem in brand logo
 * - Borderless navlinks with pure text glow
 * - Complies strictly with the 100-250 lines architectural rule
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Plans & Bags" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-primary shadow-lg shadow-pink-900/15 border-b border-primary-dark/30 text-white backdrop-blur-md"
        : "bg-transparent text-slate-900 border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Mascot Emblem using /hero.jpg */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-20 w-20 transition-transform hover:scale-90 duration-200">
              <Image
                src="/hero.jpg"
                alt="Laundry Express Bubble Hero"
                width={120}
                height={120}
                className=""
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-black text-xl tracking-tight transition-colors ${scrolled ? "text-white" : "text-slate-900"
                    }`}
                >
                  Laundry
                  <span className={`transition-colors ${scrolled ? "text-black" : "text-primary"}`}>
                    {" "}Express
                  </span>
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation: No border, text-only glow */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-200 ${scrolled
                    ? isActive
                      ? "text-white font-black [text-shadow:0_0_14px_rgba(255,255,255,0.95)]"
                      : "text-pink-100 hover:text-white hover:[text-shadow:0_0_12px_rgba(255,255,255,0.85)]"
                    : isActive
                      ? "text-primary font-black [text-shadow:0_0_12px_var(--primary-ghost)]"
                      : "text-slate-800 hover:text-primary hover:[text-shadow:0_0_12px_var(--primary-ghost)]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-semibold ${scrolled
                  ? "text-white hover:bg-white/15 hover:text-white"
                  : "text-slate-700 hover:text-primary"
                  }`}
              >
                Dashboard
              </Button>
            </Link>

            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-semibold ${scrolled
                  ? "text-white hover:bg-white/15 hover:text-white"
                  : "text-slate-700 hover:text-primary"
                  }`}
              >
                Admin
              </Button>
            </Link>

            <Link href="/order">
              <Button
                variant="hero"
                size="sm"
                className={`transition-all ${scrolled
                  ? "bg-white text-primary hover:bg-primary-pale shadow-md font-bold"
                  : "shadow-lg shadow-primary/30"
                  }`}
              >
                Book Pickup
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/order">
              <Button
                variant="hero"
                size="sm"
                className={scrolled ? "bg-white text-primary" : ""}
              >
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${scrolled
                ? "text-white hover:bg-white/10"
                : "text-slate-800 hover:bg-slate-100"
                }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown: No border on links, text-only glow */}
      {mobileMenuOpen && (
        <div
          className={`sm:hidden px-5 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 ${scrolled
            ? "bg-primary border-t border-primary-light text-white"
            : "bg-white border-t border-slate-100 text-slate-800 shadow-xl"
            }`}
        >
          <div className="flex flex-col gap-3 font-semibold text-sm">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 transition-all ${scrolled
                    ? isActive
                      ? "text-white font-black [text-shadow:0_0_14px_rgba(255,255,255,0.95)]"
                      : "text-pink-100 hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.8)]"
                    : isActive
                      ? "text-primary font-black [text-shadow:0_0_12px_var(--primary-ghost)]"
                      : "text-slate-700 hover:text-primary hover:[text-shadow:0_0_10px_var(--primary-ghost)]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 transition-all ${scrolled
                ? "text-pink-100 hover:text-white"
                : "text-slate-700 hover:text-primary"
                }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 transition-all ${scrolled
                ? "text-pink-100 hover:text-white"
                : "text-slate-700 hover:text-primary"
                }`}
            >
              Admin
            </Link>
          </div>
          <div
            className={`pt-2 border-t text-xs ${scrolled
              ? "border-primary-light/50 text-pink-100"
              : "border-slate-100 text-slate-500"
              }`}
          >
            <span>Open Daily: 8am-12pm &amp; 1pm-6pm</span>
          </div>
        </div>
      )}
    </header>
  );
}

// Backward compatibility alias for any existing references
export const SiteHeader = Navbar;
export default Navbar;
