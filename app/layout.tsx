import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CloudTransition from "@/components/layout/CloudTransition";
import { PushSettings } from "@/components/PushSettings";
import { ThemeProvider } from "@/components/ThemeProvider";
import Chatbot from "@/components/Chatbot";

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

const APP_URL = process.env.NEXTAUTH_URL || 'https://shreyashswami.is-a.dev';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Samir Shaikh - Full Stack Developer",
    template: "%s | Samir Shaikh",
  },
  description: "Portfolio of Samir Shaikh, a passionate Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Explore my projects, read my blogs, and let's build something amazing.",
  keywords: ["Samir Shaikh", "Samir Shaikh Portfolio", "Full Stack Developer", "Next.js", "React", "Node.js", "Web Developer"],
  authors: [{ name: "Samir Shaikh", url: APP_URL }],
  creator: "Samir Shaikh",
  openGraph: {
    title: "Samir Shaikh - Full Stack Developer",
    description: "Portfolio of Samir Shaikh, a passionate Full Stack Developer. Explore my projects and read my blogs.",
    url: APP_URL,
    siteName: "Samir Shaikh Portfolio",
    images: ["/Filled_Logo.png"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samir Shaikh - Full Stack Developer",
    description: "Portfolio of Samir Shaikh, a passionate Full Stack Developer. Explore my projects and read my blogs.",
    images: ["/Filled_Logo.png"],
    creator: "@ShaikhSamir Shaikh786",
  },
  verification: {
    google: "wG30YPnRWXKntcKGL7eYVh-CMNHF9l_2Dyr0T18ARl4",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="flex-1 flex flex-col" style={{ minHeight: "calc(100svh - var(--navbar-h))" }}>
            {children}
          </div>
          <Footer />
          <CloudTransition />
          <PushSettings />
          <Chatbot />
          {/* Google Analytics */}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
              </Script>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
