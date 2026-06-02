import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CloudTransition from "@/components/layout/CloudTransition";
import { PushSettings } from "@/components/PushSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const APP_URL = process.env.NEXTAUTH_URL;

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL || ''),
  title: {
    default: "Shreyash Swami",
    template: "%s | Shreyash Swami",
  },
  description: "My personal portfolio.",
  openGraph: {
    title: "Shreyash Swami",
    description: "My personal portfolio.",
    images: ["/Filled_Logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyash Swami",
    description: "My personal portfolio.",
    images: ["/Filled_Logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <Navbar />
        <div className="flex-1 flex flex-col" style={{ minHeight: "calc(100svh - var(--navbar-h))" }}>
          {children}
        </div>
        <Footer />
        <CloudTransition />
        <PushSettings />
      </body>
    </html>
  );
}
