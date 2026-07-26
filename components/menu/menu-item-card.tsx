import { Flame, ImageIcon, Leaf, Plus, Star, Timer } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { formatEuro, spiceLabel } from "@/lib/menu/format";
import type { DietaryLabel, MenuItem } from "@/lib/menu/types";

const dietaryCopy: Record<DietaryLabel, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten-free": "Gluten-free",
  "dairy-free": "Dairy-free",
  "contains-nuts": "Nuts",
  halal: "Halal"
};

export function MenuItemCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:border-[#d99a2b]/40">
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4">
        <DishVisual item={item} />
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-black leading-tight text-[#fff7e8]">{item.name}</h3>
            <span className="bg-[#d99a2b]/12 shrink-0 rounded-full px-2.5 py-1 text-base font-black text-[#f2c46e]">
              {formatEuro(item.basePriceCents)}
            </span>
          </div>
          {item.isPopular ? (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#d99a2b] px-2 py-1 text-[0.7rem] font-black uppercase tracking-[0.08em] text-[#1a100b]">
              <Star className="h-3 w-3 fill-[#1a100b] text-[#1a100b]" />
              Popular
            </span>
          ) : null}
          {item.description ? (
            <p className="text-[#f8e6c8]/64 mt-2 text-sm leading-6">{item.description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.prepTimeMinutes !== null ? (
          <Badge icon={Timer}>{item.prepTimeMinutes} min</Badge>
        ) : null}
        {item.spiceLevel !== null ? (
          <Badge icon={Flame}>{spiceLabel(item.spiceLevel)}</Badge>
        ) : null}
        {item.dietaryLabels.slice(0, 3).map((label) => (
          <Badge key={label} icon={Leaf}>
            {dietaryCopy[label]}
          </Badge>
        ))}
      </div>

      <Button
        type="button"
        className="mt-4 w-full bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]"
        disabled={item.status !== "AVAILABLE"}
        onClick={onOpen}
      >
        <Plus className="h-4 w-4" />
        {item.status === "AVAILABLE" ? "Add to order" : "Sold out"}
      </Button>
    </article>
  );
}

function DishVisual({ item }: { item: MenuItem }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#140d09]">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="88px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(217,154,43,0.18),transparent_70%)]"
          aria-hidden="true"
        >
          <ImageIcon className="h-7 w-7 text-[#d99a2b]/70" />
        </div>
      )}
    </div>
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
