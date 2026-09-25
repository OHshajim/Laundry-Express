import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Laundry Express — Superhero Doorstep Wash & Fold Laundry Service",
    template: "%s | Laundry Express",
  },
  description:
    "Superhero fast doorstep laundry pickup & delivery. 1 Bag = $10.00 fee; 2+ Bags = FREE delivery! Operating daily 8am-12pm & 1pm-6pm with photo proof guarantee.",
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/brand/logo-badge.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Laundry Express",
    title: "Laundry Express — Doorstep Wash & Fold Laundry Service",
    description: "1 Bag = $10.00 fee; 2+ Bags = FREE delivery! 100% photo proof guarantee.",
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
    title: "Laundry Express — Doorstep Wash & Fold",
    description: "2+ Bags = FREE delivery. Photo proof guarantee.",
    images: ["/brand/logo-badge.jpg"],
  },
};

/**
 * RootLayout
 *
 * Top-level application layout wrapping all page routes.
 * Enforces responsive overflow safety, typography CSS variables, and safe margins.
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
        {/* Main Application Shell */}
        <div className="flex-1 flex flex-col w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
