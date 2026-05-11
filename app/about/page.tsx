import type { Metadata } from "next";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "About | Shreyash Swami",
  description: "A little bit about me.",
};

async function getAbout(): Promise<string> {
  try {
    const result = await query("SELECT description FROM about LIMIT 1");
    return ((result.rows[0] as { description: string } | undefined)?.description) ?? "";
  } catch {
    return "";
  }
}

export default async function AboutPage() {
  const description = await getAbout();

  return (
    <main className="flex flex-col flex-1 px-6 pb-20 pt-4 md:px-10">
      <div className="max-w-3xl mx-auto w-full">
        <h1
          className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight mb-12"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          About
        </h1>

        {description ? (
          <article
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p className="text-gray-400 text-sm">Nothing here yet.</p>
        )}
      </div>
    </main>
  );
}
