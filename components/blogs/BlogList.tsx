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
}

interface BlogListProps {
  initialBlogs: Blog[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList({ initialBlogs }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = initialBlogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = blog.title.toLowerCase().includes(query);
    const excerptMatch = blog.excerpt?.toLowerCase().includes(query) || false;
    
    return titleMatch || excerptMatch;
  });

  return (
    <>
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
            placeholder="Search blogs by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-lg">No posts found matching "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm text-black underline hover:text-gray-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
            >
              <Link href={`/blogs/${blog.slug}`} className="block relative aspect-[16/10] bg-gray-50 overflow-hidden">
                {blog.cover_image_url ? (
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <span className="text-5xl font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
                      {blog.title.charAt(0)}
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-wrap gap-2 mb-3 min-h-[24px]">
                  <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm">
                    {formatDate(blog.published_at)}
                  </span>
                </div>

                <Link href={`/blogs/${blog.slug}`} className="block group-hover:text-gray-600 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                    {blog.title}
                  </h3>
                </Link>
                
                {blog.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
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
