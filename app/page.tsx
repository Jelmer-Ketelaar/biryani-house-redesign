import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Clock3,
  Flame,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Star,
  UtensilsCrossed
} from "lucide-react";

import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { restaurant } from "@/lib/restaurant/content";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const signatureDishes = [
  {
    name: "Chicken Biryani",
    description: "Layered basmati rice, saffron, marinated halal chicken, mint and raita.",
    badge: "Most ordered",
    spice: 2,
    href: "/menu",
    imagePosition: "center"
  },
  {
    name: "Butter Chicken",
    description: "Tandoori chicken folded through tomato, cashew, cream and fenugreek.",
    badge: "House classic",
    spice: 1,
    href: "/menu",
    imagePosition: "45% center"
  },
  {
    name: "Tandoori Grill",
    description: "Smoky tikka, kebab, charred vegetables and cooling mint chutney.",
    badge: "Charcoal favorite",
    spice: 3,
    href: "/menu",
    imagePosition: "58% center"
  },
  {
    name: "Lamb Karahi",
    description: "Rich wok-finished curry with ginger, tomato, coriander and warm spices.",
    badge: "Chef pick",
    spice: 3,
    href: "/menu",
    imagePosition: "68% center"
  },
  {
    name: "Fresh Naan",
    description: "Tandoor-baked bread brushed with garlic butter and coriander.",
    badge: "Add-on",
    spice: 0,
    href: "/menu",
    imagePosition: "35% center"
  },
  {
    name: "Buffet Experience",
    description: "A generous evening table of biryani, curries, grill, naan and desserts.",
    badge: "Reserve",
    spice: 2,
    href: "/reserve",
    imagePosition: "center"
  }
];

const menuFilters = ["Biryani", "Curries", "Tandoori", "Vegetarian", "Naan & sides"];

const reviews = [
  {
    quote: "Authentic flavors, generous portions and a warm family atmosphere in the heart of Dordrecht.",
    author: "Google guest",
    source: "Google Reviews"
  },
  {
    quote: "The buffet feels abundant and fresh, with halal dishes that work for the whole family.",
    author: "Dinner guest",
    source: "TheFork"
  },
  {
    quote: "Fast takeaway, fragrant biryani and butter chicken that tastes like it was made with care.",
    author: "Local customer",
    source: "Direct order"
  }
];

const buffetSteps = [
  "Choose your evening slot",
  "Arrive to a warm family table",
  "Explore unlimited halal dishes",
  "Finish with chai, dessert and hospitality"
];

export default function HomePage() {
  return (
    <>
      <SiteJsonLd />
      <main className="overflow-hidden bg-[#0b0807] text-[#fff7e8]">
        <HeroSection />
        <SignatureDishes />
        <BuffetExperience />
        <StorySection />
        <MenuExperience />
        <ReviewsSection />
        <ReservationSection />
        <LocationSeoSection />
        <FloatingActions />
      </main>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <Image
          src="/images/biryani-hero.png"
          alt="Halal biryani, naan, chutney and raita served in cinematic warm light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(217,154,43,0.24),transparent_24rem),linear-gradient(90deg,rgba(8,6,5,0.98),rgba(8,6,5,0.78)_44%,rgba(8,6,5,0.36))]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0b0807] to-transparent" />
      </div>

      <div className="spice-field" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>

      <div className="container relative grid min-h-[calc(100dvh-4rem)] items-end gap-10 pb-28 pt-12 md:grid-cols-[minmax(0,1fr)_380px] md:items-center md:pb-12">
        <Reveal className="max-w-4xl">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#d99a2b]/30 bg-[#d99a2b]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#f2c46e] backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Halal Indian & Pakistani cuisine
          </div>
          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.9] tracking-normal text-[#fff7e8] sm:text-6xl lg:text-7xl">
            Authentic Indian & Pakistani Flavors in Dordrecht
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f8e6c8]/82 sm:text-xl">
            Fragrant biryani, rich curries, tandoori grill, fresh naan and a generous halal buffet
            served with South Asian hospitality on Voorstraat.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
              <Link href="/reserve">
                Reserve a Table
                <CalendarDays className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white"
            >
              <Link href="/menu">
                Order Online
                <ShoppingBag className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              ["4.7", "Google rating"],
              ["100%", "Halal kitchen"],
              ["€29.50", "Buffet"],
              ["14-22", "Open daily"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
                <p className="text-2xl font-black text-[#f2c46e]">{value}</p>
                <p className="mt-1 text-xs font-bold text-[#f8e6c8]/70">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="hidden md:block">
          <div className="rounded-[2rem] border border-white/12 bg-[#140d0a]/78 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
              Tonight at Biryani House
            </p>
            <div className="mt-5 space-y-3">
              {[
                { icon: Clock3, label: restaurant.hours },
                { icon: UtensilsCrossed, label: "Buffet, dine-in, takeaway & delivery" },
                { icon: MapPin, label: restaurant.streetAddress }
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex gap-3 rounded-2xl bg-white/[0.06] p-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#d99a2b]" />
                  <p className="text-sm font-bold leading-6 text-[#fff7e8]">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button asChild className="bg-[#7f1d16] hover:bg-[#9f2a20]">
                <Link href="/menu">Takeaway</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                <a href={`tel:${restaurant.phone.replaceAll(" ", "")}`}>Call</a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SignatureDishes() {
  return (
    <section className="relative border-b border-white/10 bg-[#0b0807] py-16 sm:py-24">
      <div className="container">
        <SectionIntro
          eyebrow="Signature dishes"
          title="Food designed to be seen, craved and ordered."
          copy="A premium menu presentation that helps guests decide quickly while making the kitchen feel generous, authentic and refined."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {signatureDishes.map((dish, index) => (
            <Reveal key={dish.name} delay={index * 0.04}>
              <Link
                href={dish.href}
                className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15100d] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#d99a2b]/45"
              >
                <div className="relative h-64">
                  <Image
                    src="/images/biryani-hero.png"
                    alt={dish.name}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: dish.imagePosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100a07] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#d99a2b] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1a100b]">
                    {dish.badge}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-[#fff7e8]">{dish.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#f8e6c8]/70">{dish.description}</p>
                    </div>
                    <SpiceLevel value={dish.spice} />
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#f2c46e]">
                    Explore dish <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuffetExperience() {
  return (
    <section id="buffet" className="relative overflow-hidden border-b border-white/10 bg-[#130b08] py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(127,29,22,0.45),transparent_26rem),radial-gradient(circle_at_85%_0%,rgba(217,154,43,0.24),transparent_28rem)]" />
      <div className="container relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
            Buffet experience
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#fff7e8] sm:text-5xl">
            A generous halal buffet made for families, groups and celebrations.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#f8e6c8]/76">
            Two evening slots, unlimited Indian and Pakistani dishes, freshly prepared favorites,
            and a warm dining room on Voorstraat.
          </p>
          <div className="mt-7 rounded-[1.75rem] border border-[#d99a2b]/24 bg-[#d99a2b]/10 p-5">
            <p className="text-sm font-bold text-[#f8e6c8]/70">Buffet price</p>
            <p className="mt-1 text-5xl font-black text-[#f2c46e]">{restaurant.buffetPrice}</p>
            <p className="mt-2 text-sm text-[#f8e6c8]/70">Excluding drinks · {restaurant.buffetSlots.join(" / ")}</p>
          </div>
          <Button asChild size="lg" className="mt-7 bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
            <Link href="/reserve">Reserve buffet</Link>
          </Button>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {buffetSteps.map((step, index) => (
            <Reveal key={step} delay={index * 0.05}>
              <div className="min-h-40 rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#7f1d16] text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-black text-[#fff7e8]">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-[#f8e6c8]/68">
                  Smooth, clear and mobile-first so guests can book confidently in seconds.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="border-b border-white/10 bg-[#0d0907] py-16 sm:py-24">
      <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <Reveal>
          <figure className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
            <Image
              src="/images/biryani-hero.png"
              alt="Warm South Asian halal dining table with biryani and spices"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0907] via-transparent to-transparent" />
            <figcaption className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/10 bg-[#120c09]/80 p-5 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d99a2b]">
                Traditional spices · modern hospitality
              </p>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
            Our story
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#fff7e8] sm:text-5xl">
            South Asian hospitality, built around flavor and trust.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#f8e6c8]/76">
            Biryani House brings together Indian and Pakistani recipes, halal cooking, family
            warmth and careful preparation. The brand experience should make guests feel the aroma
            before they step into the restaurant or place an order.
          </p>
          <div className="mt-7 grid gap-3">
            {["Authentic recipes", "Halal ingredients", "Family atmosphere", "Fresh naan and tandoori preparation"].map(
              (item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4">
                  <CheckCircle2 className="h-5 w-5 text-[#d99a2b]" />
                  <span className="font-bold text-[#fff7e8]">{item}</span>
                </div>
              )
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MenuExperience() {
  return (
    <section className="border-b border-white/10 bg-[#100a07] py-16 sm:py-24">
      <div className="container">
        <SectionIntro
          eyebrow="Menu experience"
          title="An ordering flow shaped like a premium food app."
          copy="Guests can scan categories, filter dietary needs, read spice levels and keep a sticky path to checkout on mobile."
        />
        <div className="mt-9 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {menuFilters.map((filter, index) => (
            <Link
              key={filter}
              href="/menu"
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
                index === 0
                  ? "border-[#d99a2b] bg-[#d99a2b] text-[#1a100b]"
                  : "border-white/12 bg-white/[0.06] text-[#f8e6c8]/76 hover:border-[#d99a2b]/50"
              )}
            >
              {filter}
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 md:grid-cols-2">
            {signatureDishes.slice(0, 4).map((dish) => (
              <Link
                key={dish.name}
                href="/menu"
                className="group rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 transition hover:border-[#d99a2b]/45"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-[#7f1d16] px-2.5 py-1 text-xs font-black text-white">
                      {dish.badge}
                    </span>
                    <h3 className="mt-4 text-xl font-black text-[#fff7e8]">{dish.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#f8e6c8]/68">
                      {dish.description}
                    </p>
                  </div>
                  <SpiceLevel value={dish.spice} />
                </div>
              </Link>
            ))}
          </div>
          <aside className="rounded-[1.75rem] border border-[#d99a2b]/24 bg-[#d99a2b]/10 p-6">
            <ChefHat className="h-8 w-8 text-[#d99a2b]" />
            <h3 className="mt-5 text-2xl font-black text-[#fff7e8]">Ready to order?</h3>
            <p className="mt-3 text-sm leading-6 text-[#f8e6c8]/72">
              The live menu includes filters, popular dishes, add-ons and a persistent basket built
              for takeaway and delivery conversion.
            </p>
            <Button asChild className="mt-6 w-full bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
              <Link href="/menu">Open full menu</Link>
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="border-b border-white/10 bg-[#0b0807] py-16 sm:py-24">
      <div className="container">
        <SectionIntro
          eyebrow="Social proof"
          title="Trusted by Dordrecht guests for halal comfort food."
          copy="Reviews, ratings and customer moments are surfaced before reservation and order CTAs to reduce hesitation."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.author} delay={index * 0.05}>
              <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6">
                <div className="flex gap-1 text-[#d99a2b]">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-lg font-semibold leading-8 text-[#fff7e8]">
                  “{review.quote}”
                </p>
                <p className="mt-5 text-sm font-black text-[#f2c46e]">{review.author}</p>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f8e6c8]/50">
                  {review.source}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReservationSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#170d09] py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(217,154,43,0.18),transparent_28rem)]" />
      <div className="container relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
            Reservations
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#fff7e8] sm:text-5xl">
            Book a table without friction.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#f8e6c8]/76">
            A premium reservation area gives guests clear choices for dinner, buffet, group dining
            and WhatsApp booking on mobile.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
              <Link href="/reserve">Reserve online</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white">
              <a href={`https://wa.me/${restaurant.phone.replace(/\D/g, "")}`}>
                WhatsApp booking
                <MessageCircle className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[2rem] border border-white/10 bg-[#0f0907]/82 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-3">
              {["Date", "Time", "Party"].map((label, index) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d99a2b]">
                    {label}
                  </p>
                  <p className="mt-3 text-lg font-black text-[#fff7e8]">
                    {["Today", "19:30", "2 guests"][index]}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[1.5rem] bg-[#d99a2b] p-5 text-[#1a100b]">
              <p className="font-black">Suggested buffet slot</p>
              <p className="mt-1 text-sm font-semibold opacity-80">
                {restaurant.buffetSlots[1]} · family-friendly · halal buffet
              </p>
            </div>
            <Button asChild className="mt-4 w-full bg-[#7f1d16] hover:bg-[#9f2a20]">
              <Link href="/reserve">Continue booking</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LocationSeoSection() {
  return (
    <section className="bg-[#0b0807] py-16 sm:py-20">
      <div className="container grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
            Indian restaurant Dordrecht
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#fff7e8]">
            Visit Biryani House on Voorstraat.
          </h2>
          <div className="mt-6 grid gap-3 text-[#f8e6c8]/78">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#d99a2b]" />
              {restaurant.address}
            </p>
            <p className="flex gap-3">
              <Clock3 className="mt-1 h-5 w-5 shrink-0 text-[#d99a2b]" />
              {restaurant.hours}
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-[#d99a2b]" />
              {restaurant.phoneDisplay}
            </p>
            <p className="flex gap-3">
              <Instagram className="mt-1 h-5 w-5 shrink-0 text-[#d99a2b]" />
              Instagram-ready food, buffet moments and customer photos.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
            <div className="grid min-h-72 place-items-center rounded-[1.5rem] border border-dashed border-[#d99a2b]/35 bg-[#130c09] text-center">
              <div className="p-8">
                <MapPin className="mx-auto h-10 w-10 text-[#d99a2b]" />
                <p className="mt-4 text-2xl font-black text-[#fff7e8]">Voorstraat 394</p>
                <p className="mt-2 text-sm text-[#f8e6c8]/64">
                  Google Maps embed slot with local SEO copy and restaurant schema.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FloatingActions() {
  return (
    <>
      <a
        href={`https://wa.me/${restaurant.phone.replace(/\D/g, "")}`}
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_16px_45px_rgba(37,211,102,0.35)] transition hover:scale-105 sm:bottom-6"
        aria-label="Book or contact Biryani House on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0807]/94 p-3 backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
            <Link href="/reserve">Reserve</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white">
            <Link href="/menu">Order</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

function SectionIntro({
  eyebrow,
  title,
  copy
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black leading-tight text-[#fff7e8] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-[#f8e6c8]/72">{copy}</p>
    </Reveal>
  );
}

function SpiceLevel({ value }: { value: number }) {
  return (
    <div className="flex shrink-0 gap-0.5" aria-label={`${value} out of 3 spice level`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Flame
          key={index}
          className={cn("h-4 w-4", index < value ? "fill-[#d99a2b] text-[#d99a2b]" : "text-white/20")}
        />
      ))}
    </div>
  );
}
