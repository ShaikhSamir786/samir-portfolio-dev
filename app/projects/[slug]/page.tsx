import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { query } from "@/lib/db";
import type { Metadata, ResolvingMetadata } from "next";

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
    const result = await query(
      `SELECT id, title, slug, excerpt, content, cover_image_url, technologies, github_link, demo_link, published_at
       FROM projects WHERE slug = $1 AND is_published = true`,
      [slug]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as Project;
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
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 md:mb-12"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>

        <header className="mb-10 md:mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <time className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {publishedDate}
            </time>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight tracking-tight mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {project.title}
          </h1>

          {project.excerpt && (
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl mb-8">
              {project.excerpt}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-gray-100">
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold tracking-wide uppercase text-gray-600 bg-gray-100 px-3 py-1 rounded-md"
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
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors shadow-sm"
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
                  className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors shadow-sm"
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
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-gray-50 mb-12 md:mb-20 shadow-sm border border-gray-100">
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

        <div
          className="prose prose-gray prose-lg max-w-none 
            prose-headings:font-medium prose-headings:tracking-tight
            prose-h1:font-playfair prose-h2:font-playfair prose-h3:font-playfair
            prose-a:text-gray-900 prose-a:underline-offset-4 hover:prose-a:text-gray-600
            prose-img:rounded-2xl prose-img:border prose-img:border-gray-100 prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      </article>
    </main>
  );
}
