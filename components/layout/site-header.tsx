import Link from "next/link";
import { CalendarDays, Clock3, Menu, ShoppingBag, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { restaurant } from "@/lib/restaurant/content";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/#buffet", label: "Buffet" },
  { href: "/reserve", label: "Reserve" },
  { href: "/account", label: "Account" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0807]/86 text-[#fff7e8] backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-3" aria-label="Biryani House home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#d99a2b] text-sm font-black text-[#1a100b] shadow-[0_12px_28px_rgba(217,154,43,0.22)]">
            BH
          </span>
          <span>
            <span className="block text-sm font-black leading-tight sm:text-base">
              {restaurant.shortName}
            </span>
            <span className="hidden items-center gap-1 text-xs font-semibold text-[#f8e6c8]/64 sm:flex">
              <Star className="h-3 w-3 fill-[#d99a2b] text-[#d99a2b]" />
              Voorstraat 394
            </span>
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1 shadow-sm md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#f8e6c8]/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99a2b]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full bg-white/[0.07] px-3 py-2 text-xs font-bold text-[#f8e6c8]/78 lg:flex">
            <Clock3 className="h-3.5 w-3.5" />
            {restaurant.hoursShort}
          </div>
          <Button asChild size="sm" className="hidden bg-[#7f1d16] text-white hover:bg-[#9f2a20] sm:inline-flex">
            <Link href="/reserve">
              <CalendarDays className="h-4 w-4" />
              Reserve
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c] sm:inline-flex">
            <Link href="/menu">
              <ShoppingBag className="h-4 w-4" />
              Order
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white md:hidden" aria-label="Open menu">
            <Link href="/menu">
              <Menu className="h-4 w-4" />
              Menu
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
