import type { Metadata } from "next";
import { db } from "@/lib/db";
import { about } from "@/lib/schema";
import PageHeader from "@/components/layout/PageHeader";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import HtmlParser from "@/components/HtmlParser";
import FAQ from "@/components/about/FAQ";
import { APP_URL } from "@/lib/site-config";
import { getSpeakableJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About | Samir Shaikh",
  description: "Learn more about Samir Shaikh — an AI Backend Engineer, AI SDE, and Agentic AI Engineer from Gujarat, India, with experience building RAG pipelines, LLM-powered chatbots, agentic AI systems, scalable microservices, and event-driven systems. Interned at Logicwind. B.Tech in IT from Uka Tarsadia University.",
  keywords: [
    "About Samir Shaikh",
    "Samir Shaikh biography",
    "AI Backend Engineer",
    "Agentic AI Engineer",
    "AI SDE",
    "Node.js Backend Developer",
    "AI Node.js Backend Developer",
    "RAG pipeline developer",
    "LLM integration engineer",
    "microservices developer",
    "AI microservices developer",
    "event-driven systems",
    "B.Tech Information Technology",
    "Uka Tarsadia University",
    "Logicwind intern",
    "backend developer Gujarat India",
  ],
  alternates: {
    canonical: `${APP_URL}/about`,
  },
  openGraph: {
    title: "About | Samir Shaikh",
    description: "Learn more about Samir Shaikh — an AI Backend Engineer, AI SDE, and Agentic AI Engineer from Gujarat, India, with experience building RAG pipelines, agentic AI systems, LLM-powered chatbots, and event-driven systems.",
    url: `${APP_URL}/about`,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Samir Shaikh",
    description: "AI Backend Engineer and Agentic AI Engineer from Gujarat, India. Experienced in RAG pipelines, LLM chatbots, agentic AI, Node.js, NestJS, PostgreSQL, and microservices.",
  },
};

async function getAbout() {
  try {
    const result = await db
      .select({ description: about.description, present: about.present, future: about.future })
      .from(about)
      .limit(1);
    return {
      description: result[0]?.description ?? "",
      present: result[0]?.present ?? "",
      future: result[0]?.future ?? "",
    };
  } catch {
    return { description: "", present: "", future: "" };
  }
}

interface TimelineEntryProps {
  variant: "past" | "present" | "future";
  badge: string;
  secondaryBadge?: string;
  heading: string;
  content: string;
  isLast?: boolean;
}

function TimelineEntry({
  variant,
  badge,
  secondaryBadge,
  heading,
  content,
  isLast,
}: TimelineEntryProps) {
  const isPresent = variant === "present";
  const isFuture = variant === "future";

  return (
    <div className={`relative pl-10 ${!isLast ? "pb-12" : ""}`}>
      {/* Node */}
      <span
        className={`absolute left-0 top-[3px] flex h-[19px] w-[19px] items-center justify-center rounded-full border ${
          isPresent
            ? "border-green-500 shadow-[0_0_0_3px_rgba(74,222,128,0.15)] dark:shadow-[0_0_0_3px_rgba(74,222,128,0.18)]"
            : "border-border-primary"
        } bg-background`}
      >
        <span
          className={`inline-block h-[7px] w-[7px] rounded-full ${
            isPresent ? "bg-green-500" : "bg-text-muted"
          }`}
        />
      </span>

      {/* Ref row */}
      <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
        <span
          className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
            isPresent
              ? "text-green-600 dark:text-green-400 border-green-500/40 bg-green-500/10 font-semibold"
              : isFuture
              ? "text-text-muted border-dashed border-border-primary"
              : "text-text-muted border-border-primary"
          }`}
        >
          {badge}
        </span>
        {secondaryBadge && (
          <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-border-primary text-text-muted">
            {secondaryBadge}
          </span>
        )}
      </div>

      {/* Heading */}
      <h2 className="font-serif font-semibold italic text-xl mb-2.5 text-foreground">
        {heading}
      </h2>

      {/* Content */}
      <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-text-muted prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground hover:prose-a:text-text-secondary prose-p:my-0">
        <HtmlParser html={content} />
      </div>
    </div>
  );
}

export default async function AboutPage() {
  const { description, present, future } = await getAbout();

  const hasPast = Boolean(description);
  const hasPresent = Boolean(present);
  const hasFuture = Boolean(future);
  const hasAnySection = hasPast || hasPresent || hasFuture;

  return (
    <main className="flex flex-col flex-1 px-6 pb-20 md:px-10">
      <div className="max-w-3xl mx-auto w-full pt-6 md:pt-10">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ]}
        />
      </div>
      <PageHeader title="About" subtitle="AI Backend Engineer and Agentic AI Engineer from Gujarat, India." />
      <div className="max-w-3xl mx-auto w-full">
        {hasAnySection ? (
          <>
            {/* Subtitle */}
            <p className="text-text-muted text-sm mb-8 font-mono">
              past → present → future, before the full work history below.
            </p>

            {/* Voice-search optimized intro (hidden but crawlable for AEO) */}
            <p className="sr-only">
              Samir Shaikh is a backend developer based in Gujarat, India with experience in Node.js, TypeScript, PostgreSQL, and AI systems. He has built RAG chatbots, microservices with Kafka and BullMQ, and production APIs. He is available for freelance backend engineering and remote AI backend engineer roles. If you are looking for a remote TypeScript backend developer, or someone who builds event-driven systems with Kafka and Redis, Samir Shaikh is the right engineer to contact.
            </p>

            {/* Git-log timeline */}
            <div className="relative">
              {/* Vertical line */}
              <span
                className="absolute left-[9px] top-3 bottom-3 w-px bg-border-primary"
                aria-hidden="true"
              />

              {hasPast && (
                <TimelineEntry
                  variant="past"
                  badge="v1.0 — foundation"
                  secondaryBadge="2022 – 2026"
                  heading="Past"
                  content={description}
                  isLast={!hasPresent && !hasFuture}
                />
              )}

              {hasPresent && (
                <TimelineEntry
                  variant="present"
                  badge="HEAD → main"
                  secondaryBadge="now"
                  heading="Present"
                  content={present}
                  isLast={!hasFuture}
                />
              )}

              {hasFuture && (
                <TimelineEntry
                  variant="future"
                  badge="roadmap / next"
                  heading="Future"
                  content={future}
                  isLast
                />
              )}
            </div>
          </>
        ) : (
          <p className="text-text-muted text-sm text-center">Nothing here yet.</p>
        )}

        <ExperienceTimeline />
        <FAQ />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSpeakableJsonLd(["h1", "h2"])),
          }}
        />
      </div>
    </main>
  );
}
