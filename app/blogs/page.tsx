import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blogs | Shreyash Swami",
  description: "Articles and thoughts on backend engineering, AI, and software development.",
};

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string;
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const result = await query(
      `SELECT id, title, slug, excerpt, cover_image_url, published_at
       FROM blogs WHERE is_published = true ORDER BY published_at DESC`
    );
    return result.rows as unknown as Blog[];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="flex-1 px-6 md:px-10 pb-16">
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Blog" subtitle="Thoughts on engineering, AI, and things I'm learning." />
        {blogs.length === 0 ? (
          <p className="text-gray-400">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
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
      </div>
    </main>
  );
}
