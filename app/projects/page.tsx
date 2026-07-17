import type { Metadata } from "next";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import PageHeader from "@/components/layout/PageHeader";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProjectList from "@/components/projects/ProjectList";
import { APP_URL } from "@/lib/site-config";
import { getCollectionPageJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects | Samir Shaikh",
  description: "Explore Samir Shaikh's AI, agentic AI, and backend engineering projects — including a RAG-powered portfolio chatbot with pgvector semantic search, a microservice-based AI ticket triage system, a WhatsApp campaign platform, and a full-stack event management platform built with Node.js, NestJS, GraphQL, PostgreSQL, Redis, BullMQ, Docker, and Apache Kafka.",
  keywords: [
    "Samir Shaikh projects",
    "backend engineering projects",
    "AI projects portfolio",
    "RAG chatbot project",
    "pgvector semantic search",
    "microservices project",
    "AI ticket triage system",
    "WhatsApp campaign platform",
    "event management platform",
    "Node.js NestJS GraphQL project",
    "Kafka BullMQ Redis project",
    "full-stack developer portfolio",
  ],
  alternates: {
    canonical: `${APP_URL}/projects`,
  },
  openGraph: {
    title: "Projects | Samir Shaikh",
    description: "AI, agentic AI, and backend engineering projects by Samir Shaikh: RAG chatbot, microservice AI ticket triage, WhatsApp campaign platform, and more.",
    url: `${APP_URL}/projects`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Samir Shaikh",
    description: "AI, agentic AI, and backend engineering projects by Samir Shaikh: RAG chatbot, microservice AI ticket triage, WhatsApp campaigns, and more.",
  },
};


interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  technologies: string[] | null;
  github_link: string | null;
  demo_link: string | null;
}

async function getProjects(): Promise<Project[]> {
  try {
    const result = await db.select({
      id: projectsSchema.id,
      title: projectsSchema.title,
      slug: projectsSchema.slug,
      excerpt: projectsSchema.excerpt,
      cover_image_url: projectsSchema.coverImageUrl,
      technologies: projectsSchema.technologies,
      github_link: projectsSchema.githubLink,
      demo_link: projectsSchema.demoLink,
    }).from(projectsSchema).where(eq(projectsSchema.isPublished, true)).orderBy(desc(projectsSchema.publishedAt));
    return result as unknown as Project[];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const collectionJsonLd = getCollectionPageJsonLd({
    name: "Projects | Samir Shaikh",
    description:
      "AI, agentic AI, and backend engineering projects by Samir Shaikh: RAG chatbot, microservice AI ticket triage, WhatsApp campaign platform, and more.",
    path: "/projects",
    items: projects.map((p) => ({ name: p.title, path: `/projects/${p.slug}` })),
  });

  return (
    <main className="flex-1 px-6 md:px-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="pt-6 md:pt-10">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Projects", href: "/projects" },
            ]}
          />
        </div>
        <PageHeader title="Projects" subtitle="A collection of things I've built." />
        {projects.length === 0 ? (
          <p className="text-gray-400">No projects yet.</p>
        ) : (
          <ProjectList initialProjects={projects} />
        )}
      </div>
    </main>
  );
}
