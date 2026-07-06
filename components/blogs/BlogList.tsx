"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string;
  stars?: number;
}

interface BlogListProps {
  initialBlogs: Blog[];
  hideSearch?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList({ initialBlogs, hideSearch = false }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = initialBlogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = blog.title.toLowerCase().includes(query);
    const excerptMatch = blog.excerpt?.toLowerCase().includes(query) || false;
    
    return titleMatch || excerptMatch;
  });

  return (
    <>
      {!hideSearch && (
        <div className="mb-10">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-text-muted group-focus-within:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 text-base text-foreground bg-hover-bg border border-border-primary rounded-2xl focus:bg-background focus:ring-4 focus:ring-border-primary focus:border-text-muted focus:outline-none transition-all placeholder-text-muted"
              placeholder="Search blogs by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-footer-bg rounded-2xl border border-border-primary">
          <p className="text-text-muted text-lg">No posts found matching "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm text-foreground underline hover:text-text-secondary"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="group flex flex-col bg-background border border-border-primary rounded-2xl overflow-hidden hover:border-text-muted transition-colors"
            >
              <Link href={`/blogs/${blog.slug}`} className="block relative aspect-[16/10] bg-hover-bg overflow-hidden">
                {blog.cover_image_url ? (
                  <Image
                    src={blog.cover_image_url}
                    alt={`Cover image for ${blog.title} blog post`}
                    fill
                    priority={index === 0}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-border-primary">
                    <span className="text-5xl font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
                      {blog.title.charAt(0)}
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-wrap gap-2 mb-3 min-h-[24px]">
                  <span className="text-[10px] font-semibold tracking-wide uppercase text-text-secondary bg-hover-bg px-2 py-0.5 rounded-sm">
                    {formatDate(blog.published_at)}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide flex items-center gap-1 text-text-secondary bg-hover-bg px-2 py-0.5 rounded-sm">
                    <svg className="w-3 h-3 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {blog.stars ?? 0}
                  </span>
                </div>

                <Link href={`/blogs/${blog.slug}`} className="block group-hover:text-text-secondary transition-colors">
                  <h3 className="text-xl font-semibold text-foreground mb-2 leading-tight">
                    {blog.title}
                  </h3>
                </Link>
                
                {blog.excerpt && (
                  <p className="text-sm text-text-muted line-clamp-2 mb-4 flex-1">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border-primary">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-xs font-medium text-text-secondary hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    Read Post
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
