import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Shreyash Swami",
  description: "Get in touch with me.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-col flex-1 px-6 pb-20 pt-4 md:px-10">
      <div className="max-w-2xl mx-auto w-full">
        <h1
          className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Get in Touch
        </h1>
        <p className="text-gray-500 mb-10">
          Have a question or want to work together? Leave a message below.
        </p>

        <ContactForm />
      </div>
    </main>
  );
}
