"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/app/context/loaderContext";
import { SnackbarProvider } from "@/app/context/SnackbarContext";
import ReactQueryProvider from "@/app/providers/ReactQueryProvider";  // Import the Query Client provider

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
