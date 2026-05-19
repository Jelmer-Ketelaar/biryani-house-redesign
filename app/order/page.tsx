import { MenuBrowser } from "@/components/menu/menu-browser";
import { getMenu } from "@/lib/menu/service";

export const metadata = {
  title: "Order Online | Biryani House Dordrecht",
  description:
    "Order halal biryani, curries, tandoori grill, naan and drinks from Biryani House Dordrecht for takeaway or delivery."
};

export default async function OrderPage() {
  const menu = await getMenu({ includeUnavailable: true });

  return <MenuBrowser initialMenu={menu} />;
}
