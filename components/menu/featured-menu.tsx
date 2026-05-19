import { MenuCard } from "@/components/menu/menu-card";
import { getFeaturedMenuItems } from "@/lib/menu/menu-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function FeaturedMenu() {
  const items = (await getFeaturedMenuItems()).slice(0, 3);

  return (
    <section className="container py-14 sm:py-16">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Popular dishes</p>
          <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
            Guest favorites from the kitchen
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Biryani, curries, naan, and grill dishes presented for quick, confident ordering.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/menu">View full menu</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
