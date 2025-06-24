import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import StructuredData from "@/components/StructuredData";
import { APP_INFO } from "@/consts";
import "@/lib/time";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_INFO.BASE_URL),
  title: APP_INFO.SITE_NAME,
  description: APP_INFO.SITE_DESCRIPTION,
  keywords: APP_INFO.SITE_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: APP_INFO.SITE_NAME,
    description: APP_INFO.SITE_DESCRIPTION,
    locale: APP_INFO.SITE_LOCALE,
    type: "website",
    url: APP_INFO.BASE_URL,
    siteName: APP_INFO.SITE_NAME,
    images: [
      {
        url: `${APP_INFO.BASE_URL}/images/logo.png`,
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
          <link rel="manifest" href="/manifest.json" />
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
          {process.env.NODE_ENV === "production" && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  );
}
