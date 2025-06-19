import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: Replace with your actual domain name
export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain-name.com"),
  title:
    "Stylizacja Paznokci Patrycja Kuczkowska - Profesjonalna Stylizacja Paznokci",
  description:
    "Profesjonalna stylizacja paznokci w Gdyni. Manicure hybrydowy, żelowy, klasyczny. Umów się na wizytę już dziś!",
  keywords:
    "stylizacja paznokci, manicure hybrydowy, paznokcie żelowe, salon kosmetyczny, Patrycja Kuczkowska, Gdynia",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stylizacja Paznokci Patrycja Kuczkowska",
    description:
      "Profesjonalna stylizacja paznokci. Manicure hybrydowy, żelowy, klasyczny. Umów się na wizytę już dziś!",
    locale: "pl_PL",
    type: "website",
    url: "https://your-domain-name.com",
    siteName: "Stylizacja Paznokci Patrycja Kuczkowska",
    images: [
      {
        url: "https://your-domain-name.com/images/logo.png",
        width: 800,
        height: 600,
        alt: "Logo Stylizacja Paznokci Patrycja Kuczkowska",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pl">
        <head>
          {/* Progressive Web App */}
          <link rel="manifest" href="/manifest.json" />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link
            rel="icon"
            href="/favicon/favicon-16x16.png"
            type="image/png"
            sizes="16x16"
          />
          <link
            rel="icon"
            href="/favicon/favicon-32x32.png"
            type="image/png"
            sizes="32x32"
          />
          <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />

          {/* Add StructuredData component */}
          <StructuredData />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              duration: 2000,
            }}
          />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
