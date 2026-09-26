import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_CONFIG } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: APP_CONFIG.brandColors.primary,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    default: "Laundry Express | Pick Up • Wash • Fold • Deliver",
    template: "%s | Laundry Express",
  },
  description:
    "Laundry Piling Up? Pick Up • Wash • Fold • Deliver — More Time For What Matters. $32.50 per 13-gallon bag (about 2 loads). $10 pickup & delivery, FREE on 2+ bags! Serving Lake in the Hills & 30-mile radius.",
  keywords: [
    "laundry express",
    "doorstep laundry service",
    "wash and fold pickup",
    "free laundry delivery",
    "same day laundry",
    "commercial laundry by kg",
  ],
  applicationName: "Laundry Express",
  authors: [{ name: "Laundry Express Team" }],
  creator: "STRIX DEVS",
  publisher: "Laundry Express Inc.",
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Laundry Express",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/brand/logo-badge.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Laundry Express",
    title: "Laundry Express — Pick Up • Wash • Fold • Deliver",
    description: "$32.50 per 13-gallon bag (about 2 loads). 1 Bag = $10.00 fee; 2+ Bags = FREE delivery! 100% photo proof guarantee.",
    images: [
      {
        url: "/brand/logo-badge.jpg",
        width: 1200,
        height: 630,
        alt: "Laundry Express Superhero Laundry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laundry Express — Pick Up • Wash • Fold • Deliver",
    description: "More Time For What Matters. $32.50 per 13-gallon bag. FREE delivery on 2+ bags. Photo proof guarantee.",
    images: ["/brand/logo-badge.jpg"],
  },
};

import { AuthProvider } from "@/context/auth-context";

/**
 * RootLayout
 *
 * Top-level application layout wrapping all page routes.
 * Enforces responsive overflow safety, typography CSS variables, and global auth state.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
        {/* Main Application Shell with Global Auth Provider */}
        <div className="flex-1 flex flex-col w-full overflow-x-clip">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
