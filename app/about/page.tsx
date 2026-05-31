import type { Metadata } from "next";
import { query } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";

export const revalidate = 0;

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
    <main className="flex flex-col flex-1 px-6 pb-20 md:px-10">
      <PageHeader title="About" subtitle="A little bit about me." />
      <div className="max-w-3xl mx-auto w-full">
        {description ? (
          <article
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p className="text-gray-400 text-sm text-center">Nothing here yet.</p>
        )}
      </div>
    </main>
  );
}

