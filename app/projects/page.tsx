import type { Metadata } from "next";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import PageHeader from "@/components/layout/PageHeader";
import ProjectList from "@/components/projects/ProjectList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects | Samir Shaikh",
  description: "Explore Samir Shaikh's AI and backend engineering projects — including a RAG-powered portfolio chatbot with pgvector semantic search, a microservice-based AI ticket triage system, a WhatsApp campaign platform, and a full-stack event management platform built with Node.js, NestJS, GraphQL, PostgreSQL, Redis, BullMQ, Docker, and Apache Kafka.",
  alternates: {
    canonical: `${(process.env.NEXTAUTH_URL || 'https://samir-portfolio-dev.vercel.app').replace(/\/$/, '')}/projects`,
  },
  openGraph: {
    title: "Projects | Samir Shaikh",
    description: "AI and backend engineering projects by Samir Shaikh: RAG chatbot, microservice AI ticket triage, WhatsApp campaign platform, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Samir Shaikh",
    description: "AI and backend engineering projects by Samir Shaikh: RAG chatbot, microservice AI ticket triage, WhatsApp campaigns, and more.",
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

  return (
    <main className="flex-1 px-6 md:px-10 pb-16">
      <div className="max-w-6xl mx-auto">
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
