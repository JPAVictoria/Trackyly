import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/app/context/loaderContext";
import { SnackbarProvider } from "@/app/context/SnackbarContext";
import ReactQueryProvider from "@/app/providers/ReactQueryProvider";
import type { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Trackyly",
  description: "A modern platform to manage merchandising and SOS analytics.",
  keywords: ["merchandising", "analytics", "SOS", "admin dashboard", "Next.js"],
  authors: [{ name: "Andre Victoria", url: "https://andre-victoria.vercel.app" }],
  creator: "Andre Victoria",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Trackyly",
    description: "Optimize your field data with a powerful merchandising tool.",
    url: "https://trackyly.vercel.app/pages/login",
    siteName: "Trackyly",
    images: [
      {
        url: "https://trackyly.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenGraph Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <SnackbarProvider>
          <LoadingProvider>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </LoadingProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
