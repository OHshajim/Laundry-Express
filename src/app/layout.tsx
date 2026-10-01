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
    "Laundry Express offers doorstep laundry pickup, washing, folding, and delivery. Explore current services and schedule a pickup. Serving Lake in the Hills & 30-mile radius.",
  keywords: [
    "laundry express",
    "doorstep laundry service",
    "wash and fold pickup",
    "free laundry delivery",
    "In 24h laundry delivery",
    "commercial laundry by pound",
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
      { url: "/brand/mascot-bubble-hero.jpg", type: "image/jpeg" },
      { url: "/brand/mascot-bubble-hero.jpg", sizes: "any" },
    ],
    shortcut: "/brand/mascot-bubble-hero.jpg",
    apple: "/brand/mascot-bubble-hero.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Laundry Express",
    title: "Laundry Express — Pick Up • Wash • Fold • Deliver",
    description: "Doorstep laundry pickup, wash, fold, and delivery with photo-confirmed service.",
    images: [
      {
        url: "/brand/mascot-bubble-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Laundry Express Superhero Laundry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laundry Express — Pick Up • Wash • Fold • Deliver",
    description: "Explore laundry pickup, wash, fold, and delivery services from Laundry Express.",
    images: ["/brand/mascot-bubble-hero.jpg"],
  },
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white"
      >
        {/* Main Application Shell with Global Auth Provider */}
        <div className="flex-1 flex flex-col w-full overflow-x-clip">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
