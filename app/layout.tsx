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

const APP_URL = process.env.NEXTAUTH_URL || 'https://samir-portfolio-dev.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Samir Shaikh - Node.js Backend Developer",
    template: "%s | Samir Shaikh",
  },
  description: "Portfolio of Samir Shaikh, a Node.js Backend Developer with 9 months of production experience building scalable microservices, REST & GraphQL APIs, and event-driven architectures using Node.js, Express.js, NestJS, PostgreSQL, Redis, BullMQ, and Docker. Open to remote opportunities.",
  keywords: [
    "Samir Shaikh",
    "Samir Shaikh Portfolio",
    "Node.js Developer",
    "Backend Developer",
    "Backend Developer India",
    "Node.js Backend Developer",
    "Express.js",
    "NestJS",
    "GraphQL",
    "REST API",
    "Microservices",
    "PostgreSQL",
    "Redis",
    "BullMQ",
    "Apache Kafka",
    "Docker",
    "TypeScript",
    "JavaScript",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Web Developer",
    "Open to Remote",
    "Logicwind",
    "Uka Tarsadia University",
    "Gujarat Developer",
    "API Integration",
    "JWT Authentication",
    "Socket.io",
    "OpenTelemetry",
    "Prometheus",
    "Grafana",
    "CI/CD",
    "GitHub Actions",
  ],
  authors: [{ name: "Samir Shaikh", url: APP_URL }],
  creator: "Samir Shaikh",
  openGraph: {
    title: "Samir Shaikh - Node.js Backend Developer",
    description: "Node.js Backend Developer with production experience in scalable microservices, REST & GraphQL APIs, PostgreSQL, Redis, BullMQ, Docker, and event-driven architectures. Open to remote opportunities.",
    url: APP_URL,
    siteName: "Samir Shaikh Portfolio",
    images: [
      {
        url: "/Filled_Logo.png",
        width: 1200,
        height: 630,
        alt: "Samir Shaikh - Node.js Backend Developer",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samir Shaikh - Node.js Backend Developer",
    description: "Node.js Backend Developer with production experience in scalable microservices, REST & GraphQL APIs, and event-driven architectures. Open to remote opportunities.",
    images: ["/Filled_Logo.png"],
    creator: "@ShaikhSamir786",
  },
  verification: {
    google: "H6Pq0eI_0M2sSwSWyHpuCbS7ufcyBMaw_r2k7VCv9Ok",
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
  alternates: {
    canonical: APP_URL,
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Samir Shaikh",
    "url": APP_URL,
    "email": "22amtics312@gmail.com",
    "telephone": "+91 8320927182",
    "jobTitle": "Node.js Backend Developer",
    "description": "Node.js Backend Developer with 9 months of production experience architecting scalable, event-driven backend solutions using Node.js, Express.js, NestJS, PostgreSQL, Redis, BullMQ, Docker, and Apache Kafka.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Vapi / Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://linkedin.com/in/samir-shaikh-760b932a8",
      "https://github.com/ShaikhSamir786",
    ],
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Uka Tarsadia University",
      "sameAs": "https://utu.ac.in"
    },
    "knowsAbout": [
      "Node.js", "Express.js", "NestJS", "GraphQL", "REST APIs",
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase",
      "BullMQ", "Apache Kafka", "Docker", "TypeScript", "JavaScript",
      "JWT", "Socket.io", "Sequelize", "OpenTelemetry", "Prometheus",
      "Grafana", "GitHub Actions", "CI/CD", "Microservices", "Next.js", "React"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Logicwind"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* JSON-LD Structured Data */}
        <Script
          id="json-ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
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
