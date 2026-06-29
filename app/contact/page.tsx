import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Contact | Shaikh Samir",
  description: "Get in touch with Samir Shaikh — a Node.js Backend Developer open to remote opportunities, freelance projects, and collaborations. Reach out via email or the contact form.",
};


export default function ContactPage() {
  return (
    <main className="flex flex-col flex-1 px-6 pb-20 md:px-10">
      <PageHeader title="Get in Touch" subtitle="Have a question or want to work together? Leave a message below." />
      <div className="max-w-2xl mx-auto w-full">
        <ContactForm />
      </div>
    </main>
  );
}

