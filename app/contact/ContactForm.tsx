"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {success && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
          Message sent successfully! I&apos;ll get back to you soon.
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full rounded-lg bg-background border border-border-primary px-4 py-3 text-sm text-foreground placeholder-text-muted outline-none focus:border-text-muted focus:ring-1 focus:ring-border-primary transition-all disabled:opacity-50"
            placeholder="John Doe"
            disabled={loading}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full rounded-lg bg-background border border-border-primary px-4 py-3 text-sm text-foreground placeholder-text-muted outline-none focus:border-text-muted focus:ring-1 focus:ring-border-primary transition-all disabled:opacity-50"
            placeholder="john@example.com"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full rounded-lg bg-background border border-border-primary px-4 py-3 text-sm text-foreground placeholder-text-muted outline-none focus:border-text-muted focus:ring-1 focus:ring-border-primary transition-all disabled:opacity-50"
          placeholder="What is this regarding?"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="w-full rounded-lg bg-background border border-border-primary px-4 py-3 text-sm text-foreground placeholder-text-muted outline-none focus:border-text-muted focus:ring-1 focus:ring-border-primary transition-all resize-y min-h-[120px] disabled:opacity-50"
          placeholder="Your message here..."
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity w-full sm:w-auto self-start mt-2 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
