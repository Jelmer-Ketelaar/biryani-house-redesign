import { MenuBrowser } from "@/components/menu/menu-browser";
import { getMenu } from "@/lib/menu/service";

export default async function MenuPage() {
  const menu = await getMenu({ includeUnavailable: true });

  return <MenuBrowser initialMenu={menu} />;
}
