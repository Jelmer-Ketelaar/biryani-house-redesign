"use client";

import {
  Check,
  ChevronDown,
  Flame,
  Leaf,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Timer,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatEuro, spiceLabel } from "@/lib/menu/format";
import type { DietaryLabel, MenuItem, MenuResponse } from "@/lib/menu/types";
import { restaurant } from "@/lib/restaurant/content";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

const dietaryCopy: Record<DietaryLabel, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten-free": "Gluten-free",
  "dairy-free": "Dairy-free",
  "contains-nuts": "Nuts",
  halal: "Halal"
};

export function MenuBrowser({ initialMenu }: { initialMenu: MenuResponse }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [dietary, setDietary] = useState<DietaryLabel[]>([]);
  const [maxSpice, setMaxSpice] = useState(3);
  const [popularOnly, setPopularOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const customizerDialogRef = useRef<HTMLDialogElement>(null);
  const cartItems = useCartStore((state) => state.items);
  const addCartItem = useCartStore((state) => state.addItem);

  const filteredItems = useMemo(
    () =>
      initialMenu.items.filter((item) => {
        const text = `${item.name} ${item.description}`.toLowerCase();

        if (category !== "all" && item.categorySlug !== category) return false;
        if (popularOnly && !item.isPopular) return false;
        if (item.spiceLevel > maxSpice) return false;
        if (dietary.length > 0 && !dietary.every((label) => item.dietaryLabels.includes(label))) {
          return false;
        }
        if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;
        return true;
      }),
    [category, dietary, initialMenu.items, maxSpice, popularOnly, query]
  );

  const groupedItems = initialMenu.categories
    .map((menuCategory) => ({
      category: menuCategory,
      items: filteredItems.filter((item) => item.categorySlug === menuCategory.slug)
    }))
    .filter((group) => group.items.length > 0);

  const cartItemCount = cartItems.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartItems.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  const selectedAddonsTotal = selectedItem
    ? selectedAddons.reduce((sum, slug) => {
        const addon = selectedItem.addons.find((candidate) => candidate.slug === slug);
        return sum + (addon?.priceCents ?? 0);
      }, 0)
    : 0;

  useEffect(() => {
    const dialog = customizerDialogRef.current;
    if (selectedItem && dialog && !dialog.open) dialog.showModal();
  }, [selectedItem]);

  function openItem(item: MenuItem) {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedAddons([]);
  }

  function closeItem() {
    customizerDialogRef.current?.close();
  }

  function toggleDietary(label: DietaryLabel) {
    setDietary((current) =>
      current.includes(label) ? current.filter((value) => value !== label) : [...current, label]
    );
  }

  function clearFilters() {
    setCategory("all");
    setQuery("");
    setDietary([]);
    setMaxSpice(3);
    setPopularOnly(false);
  }

  return (
    <main className="min-h-screen bg-[#0b0807] pb-28 text-[#fff7e8]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/images/biryani-hero.png"
            alt="A cinematic Biryani House order table with biryani, naan and chutneys"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,rgba(217,154,43,0.26),transparent_24rem),linear-gradient(90deg,rgba(8,6,5,0.98),rgba(8,6,5,0.82)_48%,rgba(8,6,5,0.42))]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0b0807] to-transparent" />
        </div>
        <div className="container relative py-10 sm:py-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d99a2b]/30 bg-[#d99a2b]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#f2c46e] backdrop-blur">
                <ShoppingBag className="h-3.5 w-3.5" />
                {restaurant.hours}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-[#fff7e8] sm:text-6xl">
                Order halal biryani, curries and tandoori favorites.
              </h1>
              <p className="text-[#f8e6c8]/78 mt-4 max-w-2xl text-lg leading-8">
                Browse the live menu, customize add-ons and review your basket before checkout with{" "}
                {restaurant.name}.
              </p>
            </div>
            <div className="bg-[#120c09]/78 rounded-[1.75rem] border border-white/10 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  [String(initialMenu.items.length), "Menu items"],
                  [restaurant.hoursShort, "Daily hours"],
                  [restaurant.buffetPrice, "Buffet"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-white/[0.07] p-3">
                    <p className="text-2xl font-black text-[#f2c46e]">{value}</p>
                    <p className="text-[#f8e6c8]/64 text-xs font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b0807]/92 sticky top-16 z-30 border-b border-white/10 backdrop-blur-xl">
        <div className="container space-y-3 py-3">
          <div className="flex gap-2">
            <label className="relative block flex-1">
              <span className="sr-only">Search menu</span>
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                autoComplete="off"
                className="border-white/12 placeholder:text-[#f8e6c8]/42 min-h-12 w-full rounded-full border bg-white/[0.07] pl-11 pr-4 text-sm text-[#fff7e8] shadow-sm outline-none transition focus:border-[#d99a2b]/60 focus:ring-2 focus:ring-[#d99a2b]/30"
                placeholder="Search biryani, curry, naan..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white lg:hidden"
              aria-expanded={filtersOpen}
              aria-controls="menu-filters"
              onClick={() => setFiltersOpen((value) => !value)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <CategoryButton active={category === "all"} onClick={() => setCategory("all")}>
              All
            </CategoryButton>
            {initialMenu.categories.map((menuCategory) => (
              <CategoryButton
                key={menuCategory.slug}
                active={category === menuCategory.slug}
                onClick={() => setCategory(menuCategory.slug)}
              >
                {menuCategory.name}
              </CategoryButton>
            ))}
          </div>
        </div>
      </section>

      <div className="container grid gap-6 py-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside
          id="menu-filters"
          className={cn(
            "space-y-4 lg:sticky lg:top-36 lg:block lg:self-start",
            filtersOpen ? "block" : "hidden"
          )}
        >
          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-black">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
              </h2>
              <button
                type="button"
                className="text-xs font-bold text-primary hover:text-primary/80"
                onClick={clearFilters}
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              aria-pressed={popularOnly}
              className={cn(
                "mt-4 flex w-full items-center justify-between rounded-2xl border p-3 text-left text-sm font-bold transition",
                popularOnly
                  ? "bg-[#d99a2b]/16 border-[#d99a2b] text-[#f2c46e]"
                  : "text-[#f8e6c8]/72 border-white/10 bg-[#0f0907]"
              )}
              onClick={() => setPopularOnly((value) => !value)}
            >
              Popular only
              {popularOnly ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Star className="h-4 w-4" />
              )}
            </button>

            <label className="mt-5 block text-sm font-black">
              Maximum spice
              <span className="text-[#f8e6c8]/64 mt-1 block text-sm font-semibold">
                {spiceLabel(maxSpice)}
              </span>
              <input
                className="mt-3 w-full accent-[#d99a2b]"
                aria-label="Maximum spice level"
                max={3}
                min={0}
                type="range"
                value={maxSpice}
                onChange={(event) => setMaxSpice(Number(event.target.value))}
              />
            </label>

            <div className="mt-5">
              <p className="text-sm font-black">Dietary</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {initialMenu.filters.dietaryLabels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={dietary.includes(label)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs font-bold transition",
                      dietary.includes(label)
                        ? "border-[#d99a2b] bg-[#d99a2b] text-[#1a100b]"
                        : "text-[#f8e6c8]/68 border-white/10 bg-[#0f0907] hover:text-white"
                    )}
                    onClick={() => toggleDietary(label)}
                  >
                    {dietaryCopy[label]}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="border-[#d99a2b]/24 rounded-3xl border bg-[#7f1d16] p-5 text-white shadow-[0_20px_55px_rgba(127,29,22,0.25)]">
            <h2 className="font-black">Meal ideas</h2>
            <div className="mt-3 space-y-3">
              {initialMenu.combos.map((combo) => (
                <div key={combo.slug} className="bg-white/12 rounded-2xl p-4">
                  <p className="font-black">{combo.name}</p>
                  <p className="text-white/78 mt-1 text-sm leading-6">{combo.description}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-white/60">
                    Add dishes individually
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="min-w-0 space-y-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p
                aria-live="polite"
                aria-atomic="true"
                className="text-sm font-bold text-[#f8e6c8]/60"
              >
                {filteredItems.length} dishes match your choices
              </p>
              <h2 className="text-2xl font-black text-[#fff7e8] sm:text-3xl">Today&apos;s menu</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              onClick={clearFilters}
            >
              Clear
            </Button>
          </div>

          {groupedItems.length > 0 ? (
            groupedItems.map((group) => (
              <section key={group.category.slug} className="scroll-mt-40 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#fff7e8] sm:text-2xl">
                    {group.category.name}
                  </h3>
                  <p className="text-[#f8e6c8]/64 mt-1 max-w-2xl text-sm leading-6">
                    {group.category.description}
                  </p>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {group.items.map((item) => (
                    <MenuItemCard key={item.slug} item={item} onOpen={() => openItem(item)} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="border-white/14 rounded-3xl border border-dashed bg-white/[0.06] p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-[#d99a2b]" />
              <h3 className="mt-4 text-xl font-black text-[#fff7e8]">No dishes found</h3>
              <p className="text-[#f8e6c8]/64 mx-auto mt-2 max-w-md">
                Try a broader search, a lower spice level, or remove a dietary filter.
              </p>
              <Button className="mt-5" onClick={clearFilters}>
                Reset filters
              </Button>
            </div>
          )}
        </section>
      </div>

      <CartBar itemCount={cartItemCount} total={cartTotal} />

      {selectedItem ? (
        <dialog
          ref={customizerDialogRef}
          aria-labelledby="customizer-title"
          className="fixed inset-x-0 bottom-0 top-auto z-50 m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#100a07] p-5 text-[#fff7e8] shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm md:inset-0 md:m-auto md:w-[min(620px,calc(100vw-2rem))] md:rounded-[2rem]"
          onClose={() => setSelectedItem(null)}
        >
          <div className="relative">
            <button
              type="button"
              className="text-[#f8e6c8]/64 absolute right-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.07] transition hover:text-white"
              aria-label="Close"
              onClick={closeItem}
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
              Customize
            </p>
            <h2 id="customizer-title" className="pr-12 text-2xl font-black">
              {selectedItem.name}
            </h2>
            <p className="text-[#f8e6c8]/68 mt-2 pr-8 leading-7">{selectedItem.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge icon={Timer}>{selectedItem.prepTimeMinutes} min</Badge>
              <Badge icon={Flame}>{spiceLabel(selectedItem.spiceLevel)}</Badge>
              {selectedItem.dietaryLabels.map((label) => (
                <Badge key={label} icon={Leaf}>
                  {dietaryCopy[label]}
                </Badge>
              ))}
            </div>

            {selectedItem.allergenTags.length > 0 ? (
              <p className="border-[#d99a2b]/24 mt-4 rounded-2xl border bg-[#d99a2b]/10 p-3 text-sm leading-6 text-[#f8e6c8]/80">
                <strong>Allergens:</strong> {selectedItem.allergenTags.join(", ")}
              </p>
            ) : null}

            {selectedItem.addons.length > 0 ? (
              <section className="mt-6">
                <h3 className="font-black">Add-ons</h3>
                <div className="mt-3 grid gap-2">
                  {selectedItem.addons.map((addon) => {
                    const active = selectedAddons.includes(addon.slug);

                    return (
                      <button
                        key={addon.slug}
                        type="button"
                        aria-pressed={active}
                        className={cn(
                          "flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                          active
                            ? "bg-[#d99a2b]/16 border-[#d99a2b]"
                            : "border-white/10 bg-white/[0.06] hover:border-[#d99a2b]/35"
                        )}
                        onClick={() =>
                          setSelectedAddons((current) =>
                            active
                              ? current.filter((slug) => slug !== addon.slug)
                              : [...current, addon.slug]
                          )
                        }
                      >
                        <span>
                          <span className="block font-black">{addon.name}</span>
                          <span className="text-[#f8e6c8]/62 mt-1 block text-sm">
                            {addon.description}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-black">
                          {formatEuro(addon.priceCents)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <div className="sticky bottom-0 -mx-5 mt-6 border-t border-white/10 bg-[#100a07]/95 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-white/10 bg-white/[0.07] p-1">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-9 text-center font-black">{quantity}</span>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={() => {
                    const selectedAddonDetails = selectedItem.addons.filter((addon) =>
                      selectedAddons.includes(addon.slug)
                    );
                    addCartItem({
                      itemSlug: selectedItem.slug,
                      name: selectedItem.name,
                      quantity,
                      addonSlugs: selectedAddons,
                      addonNames: selectedAddonDetails.map((addon) => addon.name),
                      unitPriceCents: selectedItem.basePriceCents + selectedAddonsTotal
                    });
                    closeItem();
                  }}
                >
                  Add {formatEuro((selectedItem.basePriceCents + selectedAddonsTotal) * quantity)}
                </Button>
              </div>
            </div>
          </div>
        </dialog>
      ) : null}
    </main>
  );
}

function MenuItemCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:border-[#d99a2b]/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-[#fff7e8]">{item.name}</h3>
            {item.isPopular ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#d99a2b] px-2 py-1 text-xs font-black text-[#1a100b]">
                <Star className="h-3 w-3 fill-[#1a100b] text-[#1a100b]" />
                Popular
              </span>
            ) : null}
          </div>
          <p className="text-[#f8e6c8]/64 mt-2 line-clamp-2 text-sm leading-6">
            {item.description}
          </p>
        </div>
        <span className="shrink-0 text-lg font-black text-[#f2c46e]">
          {formatEuro(item.basePriceCents)}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge icon={Timer}>{item.prepTimeMinutes} min</Badge>
        <Badge icon={Flame}>{spiceLabel(item.spiceLevel)}</Badge>
        {item.dietaryLabels.slice(0, 3).map((label) => (
          <Badge key={label} icon={Leaf}>
            {dietaryCopy[label]}
          </Badge>
        ))}
      </div>
      <Button
        className="mt-5 w-full bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]"
        disabled={item.status !== "AVAILABLE"}
        onClick={onOpen}
      >
        <Plus className="h-4 w-4" />
        {item.status === "AVAILABLE" ? "Customize" : "Sold out"}
      </Button>
    </article>
  );
}

function Badge({
  children,
  icon: Icon
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span className="text-[#f8e6c8]/68 inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-2.5 py-1 text-xs font-bold">
      <Icon className="h-3.5 w-3.5 text-[#d99a2b]" />
      {children}
    </span>
  );
}

function CategoryButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2.5 text-sm font-black transition",
        active
          ? "border-[#d99a2b] bg-[#d99a2b] text-[#1a100b] shadow-[0_12px_25px_rgba(217,154,43,0.18)]"
          : "text-[#f8e6c8]/68 border-white/10 bg-white/[0.06] hover:text-white"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CartBar({ itemCount, total }: { itemCount: number; total: number }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0807]/95 p-3 shadow-[0_-18px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl">
      <div className="container flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3" aria-live="polite" aria-atomic="true">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d99a2b] text-[#1a100b]">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-[#fff7e8]">{itemCount} items</p>
            <p className="text-[#f8e6c8]/58 text-xs font-bold">
              {itemCount > 0 ? "Subtotal before fees" : "Add dishes to start"}
            </p>
          </div>
        </div>
        <Button
          asChild={itemCount > 0}
          disabled={itemCount === 0}
          size="lg"
          className="min-w-36 bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]"
        >
          {itemCount > 0 ? (
            <Link href="/checkout">
              <span className="hidden sm:inline">Checkout · </span>
              {formatEuro(total)}
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            </Link>
          ) : (
            <>
              Checkout
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
