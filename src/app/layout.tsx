import type { Metadata } from "next";
import { Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Halo Hair Lounge | Premium Hair Salon & Store",
    template: "%s | Halo Hair Lounge",
  },
  description:
    "Experience luxury hair care at Halo Hair Lounge. Professional haircuts, coloring, treatments, and premium hair products. Book your appointment today!",
  keywords: [
    "hair salon",
    "haircuts",
    "hair coloring",
    "hair treatments",
    "hair products",
    "beauty salon",
  ],
  authors: [{ name: "Halo Hair Lounge" }],
  creator: "Halo Hair Lounge",
  publisher: "Halo Hair Lounge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Halo Hair Lounge | Premium Hair Salon & Store",
    description:
      "Experience luxury hair care at Halo Hair Lounge. Professional haircuts, coloring, treatments, and premium hair products.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Halo Hair Lounge",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Halo Hair Lounge",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halo Hair Lounge | Premium Hair Salon & Store",
    description: "Experience luxury hair care at Halo Hair Lounge.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${playfair.variable}`}>
      <body
        className={`${roboto.className} antialiased bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 min-h-screen`}
      >
        <Providers>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#fff",
                borderRadius: "12px",
              },
              success: {
                iconTheme: {
                  primary: "#d946ef",
                  secondary: "#fff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
