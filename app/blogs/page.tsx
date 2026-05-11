import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";

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
    <main className="flex flex-col flex-1 px-6 pb-16 pt-4 md:px-10">
      {/* Page header */}
      <div className="mb-12">
        <h1
          className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Blogs
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Thoughts on engineering, AI, and things I&apos;m learning.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-24">
          <p className="text-gray-400 text-sm">No posts yet. Check back soon.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {blogs.map((blog, index) => (
            <BlogRow key={blog.id} blog={blog} reverse={index % 2 !== 0} />
          ))}
        </div>
      )}
    </main>
  );
}

function BlogRow({ blog, reverse }: { blog: Blog; reverse: boolean }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className={`group flex flex-col sm:flex-row items-stretch gap-0 py-10 transition-opacity duration-200 hover:opacity-80 ${reverse ? "sm:flex-row-reverse" : ""
        }`}
    >
      {/* Image */}
      <div className="relative w-full sm:w-1/3 aspect-[3/2] flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50">
        {blog.cover_image_url ? (
          <Image
            src={blog.cover_image_url}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-101"
            sizes="(max-width: 640px) 100vw, 40vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-7xl font-medium text-gray-200 select-none"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {blog.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div
        className={`flex flex-col justify-center flex-1 py-6 sm:py-0 ${reverse ? "sm:pr-10" : "sm:pl-10"
          }`}
      >
        <time className="text-xs text-gray-400 tabular-nums mb-3">
          {formatDate(blog.published_at)}
        </time>
        <h2
          className="text-2xl sm:text-3xl font-medium text-gray-900 leading-snug tracking-tight mb-3 group-hover:text-gray-600 transition-colors"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {blog.title}
        </h2>
        {blog.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5">
            {blog.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900">
          Read more
          <svg
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
