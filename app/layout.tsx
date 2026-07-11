import Script from "next/script";
import "./globals.css";
import { geistSans, geistMono, playfair } from "@/lib/fonts";
import { metadata, viewport } from "@/lib/seo/metadata";
import { getRootJsonLd } from "@/lib/seo/structured-data";
import { AppProviders } from "@/components/providers/AppProviders";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LazyClientComponents from "@/components/LazyClientComponents";

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = getRootJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script
          id="json-ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        <AppProviders>
          <Navbar />
          <div
            className="flex-1 flex flex-col"
            style={{ minHeight: "calc(100svh - var(--navbar-h))" }}
          >
            {children}
          </div>
          <Footer />
          <LazyClientComponents />
          <GoogleAnalytics />
        </AppProviders>
      </body>
    </html>
  );
}
