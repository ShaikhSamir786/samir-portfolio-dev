import type { Metadata } from "next";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import PageHeader from "@/components/layout/PageHeader";
import BlogList from "@/components/blogs/BlogList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Samir Shaikh",
  description: "Technical articles by Samir Shaikh on Node.js backend engineering, microservices, GraphQL, PostgreSQL, Redis, system design, DevOps, and software development best practices.",
  alternates: {
    canonical: `${(process.env.NEXTAUTH_URL || 'https://samir-portfolio-dev.vercel.app').replace(/\/$/, '')}/blogs`,
  },
  openGraph: {
    title: "Blog | Samir Shaikh",
    description: "Technical articles on Node.js backend engineering, microservices, GraphQL, PostgreSQL, Redis, system design, and DevOps by Samir Shaikh.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Samir Shaikh",
    description: "Technical articles on Node.js, microservices, GraphQL, PostgreSQL, Redis, and system design by Samir Shaikh.",
  },
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
