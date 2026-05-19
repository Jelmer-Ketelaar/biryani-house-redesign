import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biryanihousedordrecht.com"),
  title: "Biryani House Dordrecht | Premium Indian Delivery, Pickup & Buffet",
  description:
    "Order authentic biryani, curries, grill dishes and fresh naan from Biryani House Dordrecht. Delivery, pickup, buffet reservations and catering.",
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
    locale: "nl_NL",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" data-scroll-behavior="smooth">
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
