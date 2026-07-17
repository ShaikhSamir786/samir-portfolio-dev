import type { Metadata } from "next";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import PageHeader from "@/components/layout/PageHeader";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BlogList from "@/components/blogs/BlogList";
import { APP_URL } from "@/lib/site-config";
import { getCollectionPageJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Samir Shaikh",
  description: "Technical articles by Samir Shaikh on AI SDE topics, agentic AI, Node.js backend engineering, microservices, GraphQL, PostgreSQL, Redis, system design, DevOps, and software development best practices.",
  keywords: [
    "Samir Shaikh blog",
    "backend engineering blog",
    "Node.js tutorials",
    "agentic AI articles",
    "RAG tutorials",
    "LLM integration guides",
    "microservices articles",
    "system design blog",
    "GraphQL tutorials",
    "PostgreSQL tips",
    "DevOps articles",
    "software engineering best practices",
  ],
  alternates: {
    canonical: `${APP_URL}/blogs`,
  },
  openGraph: {
    title: "Blog | Samir Shaikh",
    description: "Technical articles on agentic AI, AI SDE topics, Node.js backend engineering, microservices, GraphQL, PostgreSQL, Redis, system design, and DevOps by Samir Shaikh.",
    url: `${APP_URL}/blogs`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Samir Shaikh",
    description: "Technical articles on agentic AI, AI SDE, Node.js, microservices, GraphQL, PostgreSQL, Redis, and system design by Samir Shaikh.",
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

  const collectionJsonLd = getCollectionPageJsonLd({
    name: "Blog | Samir Shaikh",
    description:
      "Technical articles by Samir Shaikh on AI SDE topics, agentic AI, Node.js backend engineering, microservices, GraphQL, PostgreSQL, Redis, system design, and DevOps.",
    path: "/blogs",
    items: blogs.map((b) => ({ name: b.title, path: `/blogs/${b.slug}` })),
  });

  return (
    <main className="flex-1 px-6 md:px-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="pt-6 md:pt-10">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blogs" },
            ]}
          />
        </div>
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
