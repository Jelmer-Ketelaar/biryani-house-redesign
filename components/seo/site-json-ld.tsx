import { restaurant } from "@/lib/restaurant/content";

export function SiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    servesCuisine: ["Indian", "Pakistani", "South Asian"],
    url: "https://biryanihousedordrecht.com/",
    telephone: restaurant.phone,
    email: restaurant.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.streetAddress,
      postalCode: restaurant.postalCode,
      addressLocality: restaurant.locality,
      addressCountry: restaurant.country
    },
    openingHours: "Mo-Su 14:00-22:00",
    acceptsReservations: true,
    hasMenu: "https://biryanihousedordrecht.com/menu"
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static structured data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
