import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import type { Metadata, ResolvingMetadata } from "next";
import ContentWithToc from "@/components/ContentWithToc";

export const revalidate = 3600;

interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  technologies: string[] | null;
  github_link: string | null;
  demo_link: string | null;
  published_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const result = await db.select({
      id: projectsSchema.id,
      title: projectsSchema.title,
      slug: projectsSchema.slug,
      excerpt: projectsSchema.excerpt,
      content: projectsSchema.content,
      cover_image_url: projectsSchema.coverImageUrl,
      technologies: projectsSchema.technologies,
      github_link: projectsSchema.githubLink,
      demo_link: projectsSchema.demoLink,
      published_at: projectsSchema.publishedAt,
    }).from(projectsSchema).where(and(eq(projectsSchema.slug, slug), eq(projectsSchema.isPublished, true)));

    if (result.length === 0) return null;
    return result[0] as unknown as Project;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Shreyash Swami`,
    description: project.excerpt || `Read about my project ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.excerpt || undefined,
      images: project.cover_image_url ? [project.cover_image_url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const publishedDate = new Date(project.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="flex-1">
      <article className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-foreground transition-colors mb-8 md:mb-12"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>

        <header className="mb-10 md:mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <time className="text-sm font-medium text-text-secondary bg-hover-bg px-3 py-1 rounded-full">
              {publishedDate}
            </time>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight tracking-tight mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {project.title}
          </h1>

          {project.excerpt && (
            <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl mb-8">
              {project.excerpt}
            </p>
          )}

          <div className="flex flex-col gap-6 py-6 border-y border-border-primary">
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold tracking-wide uppercase text-text-secondary bg-hover-bg px-3 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground bg-background border border-border-primary hover:bg-hover-bg px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
              )}
              {project.demo_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-background bg-foreground hover:opacity-90 px-4 py-2 rounded-lg transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </header>

        {project.cover_image_url && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-footer-bg mb-12 md:mb-20 shadow-sm border border-border-primary">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        <ContentWithToc
          html={project.content}
          className="prose prose-gray dark:prose-invert prose-lg max-w-none text-text-muted
            prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground prose-strong:text-foreground
            prose-h1:font-playfair prose-h2:font-playfair prose-h3:font-playfair
            prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-text-secondary
            prose-img:rounded-2xl prose-img:border prose-img:border-border-primary prose-img:shadow-sm"
        />

        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: project.title,
              description: project.excerpt || undefined,
              image: project.cover_image_url ? [project.cover_image_url] : undefined,
              datePublished: project.published_at,
              author: {
                "@type": "Person",
                name: "Shreyash Swami",
                url: process.env.NEXTAUTH_URL,
              }
            })
          }}
        />
      </article>
    </main>
  );
}
