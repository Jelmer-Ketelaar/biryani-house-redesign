import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { MenuCategory, MenuItem } from "@/lib/menu/types";

export function MenuCategorySection({
  category,
  items,
  onOpenItem
}: {
  category: MenuCategory;
  items: MenuItem[];
  onOpenItem: (item: MenuItem) => void;
}) {
  const headingId = `menu-category-${category.slug}`;

  return (
    <section aria-labelledby={headingId} className="scroll-mt-40 space-y-4">
      <div>
        <h2 id={headingId} className="text-2xl font-black text-[#fff7e8] sm:text-3xl">
          {category.name}
        </h2>
        <p className="text-[#f8e6c8]/64 mt-1 max-w-2xl text-sm leading-6">{category.description}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <MenuItemCard key={item.slug} item={item} onOpen={() => onOpenItem(item)} />
        ))}
      </div>
    </section>
  );
}
