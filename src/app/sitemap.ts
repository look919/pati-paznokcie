import { db } from "@/lib/db";
import { MetadataRoute } from "next";

// TODO: Replace with your actual domain name
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get treatments from the database for dynamic sitemap
  const treatments = await db.treatment.findMany({
    select: { id: true },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain-name.com";

  // Current date for lastmod
  const currentDate = new Date().toISOString().split("T")[0];

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/zgloszenie`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Add treatment-specific routes
  const treatmentRoutes = treatments.map((treatment) => ({
    url: `${baseUrl}/zgloszenie?treatment=${treatment.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...treatmentRoutes];
}
