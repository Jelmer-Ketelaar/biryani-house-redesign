import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UsersRound,
  UtensilsCrossed
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { restaurant } from "@/lib/restaurant/content";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Reserve a Table | Biryani House Dordrecht",
  description:
    "Reserve a table or buffet experience at Biryani House Dordrecht. Halal Indian and Pakistani dining, family dinners, groups and buffet slots."
};

const reservationFeatures = [
  {
    icon: ShieldCheck,
    title: "Halal dining",
    copy: "Authentic Indian and Pakistani dishes prepared for family-friendly halal dining."
  },
  {
    icon: UtensilsCrossed,
    title: "Buffet experience",
    copy: `${restaurant.buffetPrice} excluding drinks, with two evening slots.`
  },
  {
    icon: UsersRound,
    title: "Groups welcome",
    copy: "Dinner, celebrations, family tables and catering conversations."
  }
];

const bookingSlots = [
  { label: "Early buffet", value: restaurant.buffetSlots[0] },
  { label: "Dinner buffet", value: restaurant.buffetSlots[1] },
  { label: "A la carte", value: "Flexible timing" }
];

export default function ReservePage() {
  return (
    <main className="min-h-screen bg-[#0b0807] text-[#fff7e8]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/images/biryani-hero.png"
            alt="Biryani House Dordrecht table set for a halal buffet reservation"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(217,154,43,0.22),transparent_24rem),linear-gradient(90deg,rgba(8,6,5,0.98),rgba(8,6,5,0.8)_50%,rgba(8,6,5,0.44))]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0807] to-transparent" />
        </div>

        <div className="container relative grid gap-10 py-12 md:grid-cols-[1fr_380px] md:items-end md:py-16">
          <section>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d99a2b]/30 bg-[#d99a2b]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#f2c46e] backdrop-blur">
              <CalendarDays className="h-4 w-4" />
              Reservations
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-normal text-[#fff7e8] sm:text-6xl">
              Book a refined halal dining experience.
            </h1>
            <p className="text-[#f8e6c8]/78 mt-5 max-w-2xl text-lg leading-8">
              Reserve a table for a la carte dinner, the all-you-can-eat buffet, family dining,
              groups, or a catering conversation at Biryani House Dordrecht.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
                <a href="#reservation-form">Request reservation</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                <a href={`https://wa.me/${restaurant.phone.replace(/\D/g, "")}`}>
                  WhatsApp booking
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </section>

          <aside className="bg-[#120c09]/78 rounded-[1.75rem] border border-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">Tonight</p>
            <div className="mt-4 grid gap-3">
              {[
                { icon: Clock3, label: restaurant.hours },
                { icon: MapPin, label: restaurant.streetAddress },
                { icon: Phone, label: restaurant.phoneDisplay }
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex gap-3 rounded-2xl bg-white/[0.06] p-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#d99a2b]" />
                  <p className="text-sm font-bold leading-6 text-[#fff7e8]">{label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/10 py-10">
        <div className="container grid gap-4 md:grid-cols-3">
          {reservationFeatures.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5"
            >
              <Icon className="h-6 w-6 text-[#d99a2b]" />
              <h2 className="mt-5 text-xl font-black text-[#fff7e8]">{title}</h2>
              <p className="text-[#f8e6c8]/68 mt-2 text-sm leading-6">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <aside className="lg:sticky lg:top-28">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
            Buffet slots
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#fff7e8]">
            Choose the service style that fits your evening.
          </h2>
          <div className="mt-6 grid gap-3">
            {bookingSlots.map((slot, index) => (
              <div
                key={slot.label}
                className={cn(
                  "rounded-[1.5rem] border p-5",
                  index === 1
                    ? "border-[#d99a2b]/40 bg-[#d99a2b]/10"
                    : "border-white/10 bg-white/[0.055]"
                )}
              >
                <p className="font-black text-[#fff7e8]">{slot.label}</p>
                <p className="text-[#f8e6c8]/68 mt-1 text-sm">{slot.value}</p>
              </div>
            ))}
          </div>
          <div className="border-[#d99a2b]/24 mt-6 rounded-[1.75rem] border bg-[#d99a2b]/10 p-5">
            <p className="text-sm font-bold text-[#f8e6c8]/70">Buffet price</p>
            <p className="mt-1 text-5xl font-black text-[#f2c46e]">{restaurant.buffetPrice}</p>
            <p className="text-[#f8e6c8]/68 mt-2 text-sm leading-6">
              Excluding drinks. Ideal for families, groups and guests who want to explore the full
              kitchen.
            </p>
          </div>
        </aside>

        <section
          id="reservation-form"
          className="rounded-[2rem] border border-white/10 bg-[#100a07] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.26)] sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
                Booking request
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#fff7e8]">Reserve your table</h2>
              <p className="text-[#f8e6c8]/64 mt-2 text-sm leading-6">
                Staff will confirm availability. For urgent same-day bookings, use WhatsApp or call
                directly.
              </p>
            </div>
            <Sparkles className="hidden h-8 w-8 text-[#d99a2b] sm:block" />
          </div>

          <form className="mt-6 grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Name" placeholder="Your name" autoComplete="name" />
              <Field id="phone" label="Phone" placeholder="+31" autoComplete="tel" />
            </div>
            <Field
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="date" label="Date" type="date" />
              <Field id="time" label="Time" type="time" />
              <Field id="guests" label="Guests" type="number" min={1} placeholder="2" />
            </div>
            <label className="block text-sm font-black text-[#fff7e8]" htmlFor="occasion">
              Occasion
              <select
                id="occasion"
                name="occasion"
                className="border-white/12 mt-2 min-h-12 w-full rounded-2xl border bg-white/[0.07] px-4 text-sm text-[#fff7e8] outline-none focus:border-[#d99a2b]/60 focus:ring-2 focus:ring-[#d99a2b]/30"
              >
                <option>A la carte dinner</option>
                <option>Buffet reservation</option>
              </select>
            </label>
            <label className="block text-sm font-black text-[#fff7e8]" htmlFor="notes">
              Notes
              <textarea
                id="notes"
                name="notes"
                rows={5}
                placeholder="Dietary needs, children, celebration details, preferred seating..."
                className="border-white/12 placeholder:text-[#f8e6c8]/38 mt-2 w-full rounded-2xl border bg-white/[0.07] px-4 py-3 text-sm text-[#fff7e8] outline-none focus:border-[#d99a2b]/60 focus:ring-2 focus:ring-[#d99a2b]/30"
              />
            </label>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
              {["Halal cuisine", "Buffet and a la carte", "Groups and families welcome"].map(
                (item) => (
                  <p
                    key={item}
                    className="text-[#f8e6c8]/74 flex items-center gap-2 py-1 text-sm font-bold"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#d99a2b]" />
                    {item}
                  </p>
                )
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                className="bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]"
              >
                Request reservation
              </Button>
              <Button
                asChild
                type="button"
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                <a href={`tel:${restaurant.phone.replaceAll(" ", "")}`}>Call restaurant</a>
              </Button>
            </div>
          </form>
        </section>
      </section>

      <div className="bg-[#0b0807]/94 fixed inset-x-0 bottom-0 z-40 border-t border-white/10 p-3 backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
            <a href="#reservation-form">Reserve</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
          >
            <Link href="/menu">Order</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
}) {
  return (
    <label className={cn("block text-sm font-black text-[#fff7e8]", className)} htmlFor={id}>
      {label}
      <input
        id={id}
        name={id}
        className="border-white/12 placeholder:text-[#f8e6c8]/38 mt-2 min-h-12 w-full rounded-2xl border bg-white/[0.07] px-4 text-sm text-[#fff7e8] outline-none focus:border-[#d99a2b]/60 focus:ring-2 focus:ring-[#d99a2b]/30"
        {...props}
      />
    </label>
  );
}
