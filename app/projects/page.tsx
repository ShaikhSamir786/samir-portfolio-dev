import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import PageHeader from "@/components/layout/PageHeader";
import ProjectList from "@/components/projects/ProjectList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects | Shaikh Samir",
  description: "Explore Samir Shaikh's backend engineering projects — including a WhatsApp campaign platform, microservice-based AI ticket triage system, and a full-stack event management platform built with Node.js, NestJS, GraphQL, PostgreSQL, Redis, BullMQ, Docker, and Apache Kafka.",
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
