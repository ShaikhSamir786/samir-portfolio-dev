import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { geistSans, geistMono, playfair } from "@/lib/fonts";
import { metadata, viewport } from "@/lib/seo/metadata";
import { getRootJsonLd } from "@/lib/seo/structured-data";
import { AUTHOR_NAME } from "@/lib/site-config";
import { AppProviders } from "@/components/providers/AppProviders";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LazyClientComponents from "@/components/LazyClientComponents";

export { metadata, viewport };

function FooterSkeleton() {
  return (
    <footer className="w-full bg-footer-bg border-t border-border-primary">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="flex-shrink-0 w-20 h-20 rounded-full animate-pulse bg-hover-bg" />
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:ml-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[120px] space-y-3">
                <div className="h-3 w-16 animate-pulse rounded bg-hover-bg" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-3 w-24 animate-pulse rounded bg-hover-bg" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${AUTHOR_NAME} — Blog`}
          href="/api/feed"
        />
      </head>
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
          <Suspense fallback={<FooterSkeleton />}>
            <Footer />
          </Suspense>
          <LazyClientComponents />
          <GoogleAnalytics />
        </AppProviders>
      </body>
    </html>
  );
}
