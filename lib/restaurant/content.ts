import {
  CalendarDays,
  Clock3,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UsersRound
} from "lucide-react";

export const restaurant = {
  name: "Biryani House Dordrecht",
  shortName: "Biryani House",
  tagline: "Het Beste Indiase Restaurant in Dordrecht",
  address: "Voorstraat 394, 3311 VP Dordrecht, Netherlands",
  streetAddress: "Voorstraat 394",
  locality: "Dordrecht",
  postalCode: "3311 VP",
  country: "NL",
  phone: "+31 6 41685055",
  phoneDisplay: "+31 6 41685055",
  email: "hello@biryanihousedordrecht.com",
  businessEmail: "info@biryanihousedordrecht.com",
  hours: "Elke dag geopend van 14:00 tot 22:00",
  hoursShort: "14:00-22:00",
  buffetPrice: "€29.50",
  buffetSlots: ["17:30-19:30", "19:30-22:00"],
  reviewUrl: "https://biryanihousedordrecht.com/en/biryani-house-dordrecht-reviews/"
};

export const hospitalityHighlights = [
  {
    icon: ShieldCheck,
    title: "100% halal",
    copy: "Trusted halal Indian and Pakistani dishes prepared with authentic spices."
  },
  {
    icon: Sparkles,
    title: "Fresh ingredients",
    copy: "Biryani, curries, naan, and grilled specialties cooked with care."
  },
  {
    icon: UsersRound,
    title: "Family-friendly",
    copy: "A warm Voorstraat restaurant for dinner, celebrations, buffet, and groups."
  },
  {
    icon: Truck,
    title: "Dine-in, takeaway & delivery",
    copy: "Enjoy the food in the restaurant, at home, or ready for pickup."
  }
];

export const visitActions = [
  {
    icon: ShoppingBag,
    title: "Order online",
    copy: "Delivery and takeaway from the direct menu.",
    href: "/order"
  },
  {
    icon: CalendarDays,
    title: "Reserve a table",
    copy: "A la carte dining, buffet slots, family dinners, and groups.",
    href: "/reserve"
  },
  {
    icon: HeartHandshake,
    title: "Request catering",
    copy: "Flavorful event catering for intimate gatherings and events up to 200 guests.",
    href: "/reserve"
  },
  {
    icon: MapPin,
    title: "Visit Voorstraat",
    copy: restaurant.address,
    href: `tel:${restaurant.phone.replaceAll(" ", "")}`
  }
];

export const buffetDetails = [
  "All-you-can-eat Indian buffet excluding drinks",
  "Two convenient evening time slots",
  "Desi and Middle Eastern dishes in a cozy, family-friendly setting",
  "Butter Chicken, Biryani, Garlic Naan, spicy curries, and grilled specialties"
];

export const galleryItems = [
  {
    title: "Layered biryani",
    copy: "Long-grain basmati, saffron, herbs, and slow-cooked spice."
  },
  {
    title: "Tandoori grill",
    copy: "Smoky skewers, tikka, kebab, mint chutney, and charred vegetables."
  },
  {
    title: "Curry & naan",
    copy: "Rich sauces, fresh bread, raita, chutneys, and vegetarian classics."
  }
];

export const serviceFacts = [
  { icon: Clock3, label: restaurant.hours },
  { icon: MapPin, label: restaurant.address },
  {
    icon: ShoppingBag,
    label: "Online menu, delivery, takeaway, reservations, buffet, and catering"
  }
];
