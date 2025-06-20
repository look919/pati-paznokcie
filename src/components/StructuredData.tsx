import { APP_INFO, COMPANY_INFO } from "@/consts";
import Script from "next/script";

// TODO: fill the data

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: APP_INFO.SITE_NAME,
    description: APP_INFO.SITE_DESCRIPTION,
    url: APP_INFO.BASE_URL,
    telephone: COMPANY_INFO.PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.ADDRESS_STREET,
      addressLocality: COMPANY_INFO.ADDRESS_CITY,
      addressRegion: COMPANY_INFO.ADDRESS_REGION,
      postalCode: COMPANY_INFO.ADDRESS_POSTAL_CODE,
      addressCountry: COMPANY_INFO.ADDRESS_COUNTRY,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "0.000000", // Replace with actual latitude
      longitude: "0.000000", // Replace with actual longitude
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "18:00",
      },
    ],
    image: `${APP_INFO.BASE_URL}/images/logo.png`,
    priceRange: "$$", // Replace with appropriate price range //TODO:
    servesCuisine: "Usługi Kosmetyczne, stylizacja paznokci",
    sameAs: [
      // TODO: fill with actual social media links
      COMPANY_INFO.FACEBOOK,
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Usługi Stylizacji Paznokci",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Manicure Hybrydowy",
            description: "Profesjonalny manicure hybrydowy",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Manicure Żelowy",
            description: "Profesjonalny manicure żelowy",
          },
        },
        // TODO: Add more services as needed
      ],
    },
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
