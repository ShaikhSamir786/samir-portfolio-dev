import type { Metadata } from "next";
import { db } from "@/lib/db";
import { about } from "@/lib/schema";
import PageHeader from "@/components/layout/PageHeader";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About | Shreyash Swami",
  description: "A little bit about me.",
};

async function getAbout(): Promise<string> {
  try {
    const result = await db.select({ description: about.description }).from(about).limit(1);
    return result[0]?.description ?? "";
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
            className="prose prose-gray dark:prose-invert max-w-none text-text-muted prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground hover:prose-a:text-text-secondary"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p className="text-text-muted text-sm text-center">Nothing here yet.</p>
        )}
        
        <ExperienceTimeline />
      </div>
    </main>
  );
}

