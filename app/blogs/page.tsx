import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import PageHeader from "@/components/layout/PageHeader";
import BlogList from "@/components/blogs/BlogList";

export const revalidate = 3600;

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
  stars: number;
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const result = await db.select({
      id: blogsSchema.id,
      title: blogsSchema.title,
      slug: blogsSchema.slug,
      excerpt: blogsSchema.excerpt,
      cover_image_url: blogsSchema.coverImageUrl,
      published_at: blogsSchema.publishedAt,
      stars: blogsSchema.stars,
    }).from(blogsSchema).where(eq(blogsSchema.isPublished, true)).orderBy(desc(blogsSchema.publishedAt));
    return result as unknown as Blog[];
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
          <BlogList initialBlogs={blogs} />
        )}
      </div>
    </main>
  );
}
