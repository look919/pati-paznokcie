import { APP_INFO } from "@/consts";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Current date for lastmod
  const currentDate = new Date().toISOString().split("T")[0];

  // Static routes
  const routes = [
    {
      url: APP_INFO.BASE_URL,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${APP_INFO.BASE_URL}/zgloszenie`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  return routes;
}
