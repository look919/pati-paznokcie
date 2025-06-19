import Script from "next/script";

// TODO: fill the data

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: "Stylizacja Paznokci Patrycja Kuczkowska",
    description:
      "Profesjonalna stylizacja paznokci. Manicure hybrydowy, żelowy, klasyczny.",
    url: "https://your-domain-name.com",
    telephone: "+48XXXXXXXXX", // Replace with actual phone number
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address", // Replace with actual address
      addressLocality: "Your City", // Replace with actual city
      addressRegion: "Your Region", // Replace with actual region
      postalCode: "Your Postal Code", // Replace with actual postal code
      addressCountry: "PL",
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
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    image: "https://your-domain-name.com/images/logo.png",
    priceRange: "$$", // Replace with appropriate price range
    servesCuisine: "Nail salon services",
    sameAs: [
      "https://www.facebook.com/YourFacebookPage", // Replace with actual social media links
      "https://www.instagram.com/YourInstagramPage",
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
        // Add more services as needed
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
