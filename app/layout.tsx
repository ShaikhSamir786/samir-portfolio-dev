import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import LazyClientComponents from "@/components/LazyClientComponents";

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

const APP_URL = (process.env.NEXTAUTH_URL || 'https://samir-portfolio-dev.vercel.app').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Samir Shaikh - AI Backend Engineer | Node.js Developer",
    template: "%s | Samir Shaikh",
  },
  description: "Portfolio of Samir Shaikh, an AI Backend Engineer with 9 months of production experience building scalable microservices, RAG pipelines, LLM-powered chatbots, and event-driven architectures using Node.js, NestJS, TypeScript, PostgreSQL (pgvector), Redis, BullMQ, and the Vercel AI SDK. Open to remote opportunities.",
  keywords: [
    "Samir Shaikh",
    "Samir Shaikh Portfolio",
    "AI Backend Engineer",
    "AI Engineer",
    "Backend Engineer AI",
    "LLM Engineer",
    "RAG Engineer",
    "Retrieval Augmented Generation",
    "Vector Search",
    "Vector Database",
    "pgvector",
    "Semantic Search",
    "Vercel AI SDK",
    "Google Gemini API",
    "OpenAI API",
    "Prompt Engineering",
    "AI Chatbot Development",
    "LLM Integration",
    "Embeddings",
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
    title: "Samir Shaikh - AI Backend Engineer | Node.js Developer",
    description: "AI Backend Engineer with production experience building RAG pipelines, LLM-powered chatbots, scalable microservices, and event-driven architectures using Node.js, NestJS, PostgreSQL (pgvector), Redis, BullMQ, and the Vercel AI SDK. Open to remote opportunities.",
    url: APP_URL,
    siteName: "Samir Shaikh Portfolio",
    images: [
      {
        url: "/Filled_Logo.png",
        width: 1200,
        height: 630,
        alt: "Samir Shaikh - AI Backend Engineer",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samir Shaikh - AI Backend Engineer | Node.js Developer",
    description: "AI Backend Engineer with production experience building RAG pipelines, LLM-powered chatbots, and event-driven backend architectures. Open to remote opportunities.",
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
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Samir Shaikh",
      "url": APP_URL,
      "email": "22amtics312@gmail.com",
      "telephone": "+91 8320927182",
      "jobTitle": "AI Backend Engineer",
      "description": "AI Backend Engineer with 9 months of production experience architecting scalable, event-driven backend solutions and Retrieval-Augmented Generation (RAG) systems using Node.js, Express.js, NestJS, PostgreSQL (pgvector), Redis, BullMQ, Docker, Apache Kafka, and the Vercel AI SDK.",
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
        "AI Backend Engineering", "Retrieval Augmented Generation (RAG)", "LLM Integration",
        "Vector Search", "pgvector", "Semantic Search", "Embeddings", "Vercel AI SDK",
        "Google Gemini API", "Prompt Engineering", "AI Chatbot Development",
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
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Samir Shaikh Portfolio",
      "url": APP_URL,
      "description": "Portfolio of Samir Shaikh, AI Backend Engineer specializing in RAG pipelines, LLM-powered chatbots, and event-driven microservices.",
      "author": {
        "@type": "Person",
        "name": "Samir Shaikh"
      }
    },
  ];

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
          <LazyClientComponents />
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
