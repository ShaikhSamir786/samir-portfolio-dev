import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const result = await query(
      "SELECT * FROM blogs WHERE slug = $1 AND is_published = true",
      [slug]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as Blog;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Not Found" };
  return {
    title: `${blog.title} | Shreyash Swami`,
    description: blog.excerpt ?? undefined,
    openGraph: blog.cover_image_url
      ? { images: [blog.cover_image_url] }
      : undefined,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  return (
    <main className="flex flex-col flex-1 px-6 pb-20 pt-4 md:px-10">
      <div className="max-w-3xl mx-auto w-full">
        {/* Back link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-10 group"
        >
          <svg
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 8H3M7 12L3 8l4-4" />
          </svg>
          All posts
        </Link>

        {/* Header */}
        <header className="mb-10">
          <time className="text-xs text-gray-400 tabular-nums">
            {formatDate(blog.published_at)}
          </time>
          <h1
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="mt-4 text-base text-gray-500 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </header>

        {/* Cover image */}
        {blog.cover_image_url && (
          <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-12 bg-gray-50">
            <Image
              src={blog.cover_image_url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Blog content */}
        <article
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </main>
  );
}
