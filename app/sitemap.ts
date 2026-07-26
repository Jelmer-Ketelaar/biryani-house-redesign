import type { MetadataRoute } from "next";

const routes = ["", "/menu", "/reserve"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://biryanihousedordrecht.com${route}`,
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.8
  }));
}
