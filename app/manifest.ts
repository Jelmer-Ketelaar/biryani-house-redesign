import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Biryani House Dordrecht",
    short_name: "Biryani House",
    description: "Halal Indian and Pakistani food in Dordrecht.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0807",
    theme_color: "#0b0807",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }]
  };
}
