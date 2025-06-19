import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Generate dynamic sitemap.xml with all important routes
 */
export async function GET() {
  try {
    // Get treatments from the database (if needed for dynamic sitemap)
    const treatments = await db.treatment.findMany({
      select: { id: true },
    });

    // Base URL - replace with your actual URL when in production
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain-name.com";

    // Current date for lastmod
    const date = new Date().toISOString().split("T")[0];

    // XML sitemap content
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/zgloszenie</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${treatments
    .map(
      (treatment) => `
  <url>
    <loc>${baseUrl}/zgloszenie?treatment=${treatment.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `
    )
    .join("")}
</urlset>`;

    // Return XML response
    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 }
    );
  }
}
