import type { Metadata } from "next";
import { db } from "@/lib/db";
import { about } from "@/lib/schema";
import PageHeader from "@/components/layout/PageHeader";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import HtmlParser from "@/components/HtmlParser";
import FAQ from "@/components/about/FAQ";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About | Shaikh Samir",
  description: "Learn more about Samir Shaikh — a Node.js Backend Developer from Gujarat, India, with experience building scalable microservices, REST & GraphQL APIs, and event-driven systems. Interned at Logicwind. B.Tech in IT from Uka Tarsadia University.",
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
          <HtmlParser
            html={description}
            className="prose prose-gray dark:prose-invert max-w-none text-text-muted prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground hover:prose-a:text-text-secondary"
          />
        ) : (
          <p className="text-text-muted text-sm text-center">Nothing here yet.</p>
        )}

        <ExperienceTimeline />
        <FAQ />
      </div>
    </main>
  );
}
