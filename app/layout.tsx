import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CartHydration } from "@/components/providers/cart-hydration";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://biryanihousedordrecht.com"),
  title: {
    default: "Biryani House Dordrecht | Halal Indian & Pakistani Food",
    template: "%s | Biryani House Dordrecht"
  },
  description:
    "Order authentic biryani, curries, grill dishes and fresh naan from Biryani House Dordrecht. Delivery, pickup, buffet reservations and catering.",
  applicationName: "Biryani House Dordrecht",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "Biryani House Dordrecht",
    description:
      "Premium Indian ordering for delivery, pickup, buffet reservations and catering in Dordrecht.",
    images: [
      {
        url: "/images/biryani-hero.png",
        width: 1200,
        height: 675,
        alt: "A copper bowl of biryani with naan, raita and chutney"
      }
    ],
    locale: "en_GB",
    type: "website",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Biryani House Dordrecht",
    description: "Halal Indian and Pakistani dining, takeaway, delivery and buffet in Dordrecht.",
    images: ["/images/biryani-hero.png"]
  }
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: "#0b0807"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen font-sans antialiased">
        <CartHydration />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-bold text-black shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div id="main-content" className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
