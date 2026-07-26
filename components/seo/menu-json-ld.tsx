import type { MenuResponse } from "@/lib/menu/types";

const siteUrl = "https://biryanihousedordrecht.com";

export function MenuJsonLd({ menu }: { menu: MenuResponse }) {
  const itemsByCategory = new Map(
    menu.categories.map((category) => [
      category.slug,
      menu.items.filter((item) => item.categorySlug === category.slug)
    ])
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${siteUrl}/menu#menu`,
    name: "Biryani House Dordrecht Menu",
    url: `${siteUrl}/menu`,
    hasMenuSection: menu.categories.map((category) => ({
      "@type": "MenuSection",
      name: category.name,
      description: category.description,
      hasMenuItem: (itemsByCategory.get(category.slug) ?? []).map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(item.imageUrl ? { image: new URL(item.imageUrl, siteUrl).toString() } : {}),
        suitableForDiet: item.dietaryLabels.includes("vegetarian")
          ? "https://schema.org/VegetarianDiet"
          : undefined,
        offers: {
          "@type": "Offer",
          price: (item.basePriceCents / 100).toFixed(2),
          priceCurrency: "EUR",
          availability:
            item.status === "AVAILABLE"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock"
        }
      }))
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
    />
  );
}
