import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/linka", "/wms-tsd", "/archives"];

  return routes.map((route) => ({
    url: `https://jully-design.ru${route}`,
    lastModified: new Date("2026-08-10T00:00:00.000Z"),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
