import type { Metadata } from "next";

import { MenuBrowser } from "@/components/menu/menu-browser";
import { MenuJsonLd } from "@/components/seo/menu-json-ld";
import { getMenu } from "@/lib/menu/service";

export const metadata: Metadata = {
  title: "Menu & Online Ordering",
  description:
    "Browse halal biryani, curries, tandoori dishes, naan and drinks for takeaway or delivery in Dordrecht.",
  alternates: { canonical: "/menu" }
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const menu = await getMenu({ includeUnavailable: true });

  return (
    <>
      <MenuJsonLd menu={menu} />
      <MenuBrowser initialMenu={menu} />
    </>
  );
}
