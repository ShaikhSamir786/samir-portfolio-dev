import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import PageHeader from "@/components/layout/PageHeader";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { APP_URL } from "@/lib/site-config";
import { getServiceJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Contact | Samir Shaikh",
  description: "Get in touch with Samir Shaikh — a Node.js Backend Developer open to remote opportunities, freelance projects, and collaborations. Reach out via email or the contact form.",
  keywords: [
    "contact Samir Shaikh",
    "hire Node.js developer",
    "hire AI Node.js developer",
    "hire backend developer",
    "hire AI backend developer",
    "freelance backend developer",
    "freelance AI backend developer",
    "remote backend developer",
    "remote AI backend developer",
    "backend developer available for hire",
    "AI engineer for hire",
    "contract backend engineer",
    "contract AI backend engineer",
    "work with Samir Shaikh",
    "backend development services",
  ],
  alternates: {
    canonical: `${APP_URL}/contact`,
  },
  openGraph: {
    title: "Contact | Samir Shaikh",
    description: "Get in touch with Samir Shaikh — open to remote roles, freelance work, and collaborations in AI backend and Node.js engineering.",
    url: `${APP_URL}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Samir Shaikh",
    description: "Get in touch with Samir Shaikh — open to remote roles, freelance work, and collaborations.",
  },
};


export default function ContactPage() {
  const serviceJsonLd = getServiceJsonLd();

  return (
    <main className="flex flex-col flex-1 px-6 pb-20 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <div className="max-w-2xl mx-auto w-full pt-6 md:pt-10">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
          ]}
        />
      </div>
      <PageHeader title="Get in Touch" subtitle="Have a question or want to work together? Leave a message below." />
      <p className="sr-only">
        Looking to hire a backend engineer for an AI project? Need someone to ship an AI feature into your SaaS product? Samir Shaikh is a Node.js and TypeScript backend developer available for remote roles, freelance projects, and contract work.
      </p>
      <div className="max-w-2xl mx-auto w-full">
        <ContactForm />
      </div>
    </main>
  );
}

