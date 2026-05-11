import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projects | Shreyash Swami",
  description: "A collection of things I've built.",
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
    const result = await query(
      `SELECT id, title, slug, excerpt, cover_image_url, technologies, github_link, demo_link 
       FROM projects WHERE is_published = true ORDER BY published_at DESC`
    );
    return result.rows as unknown as Project[];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="flex-1 px-6 md:px-10 py-10 md:py-16">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Projects
        </h1>
        <p className="text-gray-500 text-lg mb-12">
          A collection of things I&apos;ve built.
        </p>

        {projects.length === 0 ? (
          <p className="text-gray-400">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                <Link href={`/projects/${project.slug}`} className="block relative aspect-[16/10] bg-gray-50 overflow-hidden">
                  {project.cover_image_url ? (
                    <Image
                      src={project.cover_image_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <span className="text-5xl font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-1 p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold tracking-wide uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link href={`/projects/${project.slug}`} className="block group-hover:text-gray-600 transition-colors">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                      {project.title}
                    </h3>
                  </Link>
                  
                  {project.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {project.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        Source
                      </a>
                    )}
                    {project.demo_link && (
                      <a
                        href={project.demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
