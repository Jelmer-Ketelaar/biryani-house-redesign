import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";

import { restaurant } from "@/lib/restaurant/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080605] text-[#f8e6c8]/70">
      <div className="container grid gap-8 pb-28 pt-10 text-sm sm:py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="max-w-sm">
          <p className="text-lg font-black text-[#fff7e8]">{restaurant.name}</p>
          <p className="mt-2 leading-6">
            {restaurant.tagline}. Direct ordering for fragrant biryani, clay-oven grill dishes,
            fresh naan, buffet reservations, takeaway, delivery, and catering.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Halal kitchen", "Direct ordering", "Fresh daily"].map((label) => (
              <span
                key={label}
                className="border-[#d99a2b]/24 inline-flex items-center gap-1 rounded-full border bg-[#d99a2b]/10 px-3 py-1 text-xs font-bold text-[#f2c46e]"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-black text-[#fff7e8]">Service</p>
          <div className="mt-3 space-y-2">
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#d99a2b]" /> {restaurant.hours}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
              className="flex items-center gap-2 hover:text-[#fff7e8]"
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#d99a2b]" /> {restaurant.address}
            </a>
            <p className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#d99a2b]" /> Buffet, takeaway, delivery, and
              catering ready
            </p>
            <a
              href={`tel:${restaurant.phone.replaceAll(" ", "")}`}
              className="flex items-center gap-2 hover:text-[#fff7e8]"
            >
              <Phone className="h-4 w-4 shrink-0 text-[#d99a2b]" /> {restaurant.phoneDisplay}
            </a>
            <a
              href={`mailto:${restaurant.email}`}
              className="flex items-center gap-2 hover:text-[#fff7e8]"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#d99a2b]" />
              <span className="break-all">{restaurant.email}</span>
            </a>
          </div>
        </div>
        <div>
          <p className="font-black text-[#fff7e8]">Explore</p>
          <div className="mt-3 grid gap-2">
            <Link href="/menu" className="hover:text-[#fff7e8]">
              Menu
            </Link>
            <Link href="/reserve" className="hover:text-[#fff7e8]">
              Reserve
            </Link>
            <a
              href={`tel:${restaurant.phone.replaceAll(" ", "")}`}
              className="hover:text-[#fff7e8]"
            >
              Call
            </a>
            <a href={`mailto:${restaurant.email}`} className="hover:text-[#fff7e8]">
              Email
            </a>
            <Link href="/account" className="hover:text-[#fff7e8]">
              Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
