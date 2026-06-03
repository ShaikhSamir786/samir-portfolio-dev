"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

interface ProjectListProps {
  initialProjects: Project[];
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = initialProjects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = project.title.toLowerCase().includes(query);
    const excerptMatch = project.excerpt?.toLowerCase().includes(query) || false;
    const techMatch = project.technologies?.some(tech => tech.toLowerCase().includes(query)) || false;
    
    return titleMatch || excerptMatch || techMatch;
  });

  return (
    <>
      <div className="mb-10">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 text-base text-gray-900 bg-gray-50/50 border border-gray-200/60 rounded-2xl focus:bg-white focus:ring-4 focus:ring-gray-50 focus:border-gray-300 focus:outline-none transition-all placeholder-gray-400"
            placeholder="Search projects by name, description, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-lg">No projects found matching "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm text-black underline hover:text-gray-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
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
                <div className="flex flex-wrap gap-2 mb-3 min-h-[24px]">
                  {project.technologies && project.technologies.length > 0 ? (
                    project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold tracking-wide uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm">
                      Project
                    </span>
                  )}
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
                  {!project.github_link && !project.demo_link && (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                    >
                      View Project
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
