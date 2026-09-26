"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LogIn, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

/**
 * Navbar Component
 *
 * Sticky responsive header with organized navigation architecture:
 * - Dynamic scroll transition (transparent to solid primary brand color)
 * - User avatar display extracted from Google OAuth or custom image upload
 * - Role-aware destination links (Customer Dashboard vs Admin Dispatch)
 * - Strictly complies with the 100-250 lines architectural rule
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/pricing", label: "Plans & Pricing" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ];

  const userDisplayName = user?.full_name?.split(" ")[0] || "Account";
  const userAvatarUrl = user?.avatar_url;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-primary shadow-lg shadow-pink-900/15 border-b border-pink-700/30 text-white backdrop-blur-md"
        : "bg-transparent text-slate-900 border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="relative h-16 w-16 transition-transform group-hover:scale-95 duration-200 shrink-0">
              <Image src="/brand/hero.jpg" alt="Laundry Express Mascot" width={100} height={100} priority />
            </div>
            <div>
              <span className={`font-black text-xl tracking-tight ${scrolled ? "text-white" : "text-slate-900"}`}>
                Laundry<span className={scrolled ? "text-black" : "text-primary"}> Express</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-200 ${scrolled
                    ? isActive
                      ? "text-white font-black drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                      : "text-pink-100 hover:text-white"
                    : isActive
                      ? "text-primary font-black drop-shadow-[0_0_10px_var(--primary-ghost)]"
                      : "text-slate-700 hover:text-primary"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {!isAuthenticated ? (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs font-bold flex items-center gap-1.5 ${scrolled ? "text-white hover:bg-white/15" : "text-slate-700 hover:text-primary"
                    }`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* User Profile Avatar Pill */}
                <Link href="/dashboard">
                  <div
                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-bold transition-colors ${scrolled
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200/80"
                      }`}
                  >
                    {userAvatarUrl ? (
                      <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/40 shrink-0">
                        <Image src={userAvatarUrl} alt={userDisplayName} fill sizes="24px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">
                        {userDisplayName[0]}
                      </div>
                    )}
                    <span className="truncate max-w-[100px]">{userDisplayName}</span>
                  </div>
                </Link>
              </div>
            )}

            {/* Primary Order Action Button */}
            <Link href="/order">
              <Button
                variant="hero"
                size="sm"
                className={
                  scrolled
                    ? "bg-white text-primary hover:bg-pink-50 shadow-md font-bold text-xs"
                    : "shadow-md shadow-pink-500/25 text-xs font-bold"
                }
              >
                Book Pickup
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/order">
              <Button variant="hero" size="sm" className={scrolled ? "bg-white text-primary text-xs" : "text-xs"}>
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${scrolled ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-100"}`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`sm:hidden px-5 pt-3 pb-6 space-y-3 ${scrolled ? "bg-primary text-white" : "bg-white text-slate-800 shadow-xl"}`}>
          <div className="flex flex-col gap-2.5 font-semibold text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 ${scrolled ? "text-pink-100" : "text-slate-700"}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 flex items-center gap-2 font-bold"
              >
                {isAdmin ? <Shield className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                <span>{isAdmin ? "Admin Operations Portal" : "My Orders Dashboard"}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 flex items-center gap-1.5 font-bold ${scrolled ? "text-white" : "text-primary"}`}
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export const SiteHeader = Navbar;
export default Navbar;
