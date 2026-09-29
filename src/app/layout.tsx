import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Jay Real Estate | Luxury Property in Dubai",
    template: "%s | Jay Real Estate",
  },
  description:
    "Jay Real Estate offers exclusive ready and off-plan homes across Dubai's most sought-after communities. Discover luxury apartments, villas and investment opportunities with expert guidance.",
  keywords: [
    "Dubai real estate",
    "luxury property Dubai",
    "off-plan Dubai",
    "Dubai villas",
    "Dubai apartments",
    "Jay Real Estate",
  ],
  openGraph: {
    title: "Jay Real Estate | Luxury Property in Dubai",
    description:
      "Exclusive homes and off-plan investments across Dubai's most sought-after communities.",
    type: "website",
    locale: "en_AE",
    siteName: "Jay Real Estate",
    url: "/",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Dubai skyline at dusk" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jay Real Estate | Luxury Property in Dubai",
    description: "Exclusive homes and off-plan investments across Dubai's most sought-after communities.",
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
