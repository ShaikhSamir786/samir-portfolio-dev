import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq, and, ne, desc } from "drizzle-orm";
import ContentWithToc from "@/components/ContentWithToc";
import BlogInteractions from "@/components/blogs/BlogInteractions";
import BlogStarInteraction from "@/components/blogs/BlogStarInteraction";
import BlogShareButtons from "@/components/blogs/BlogShareButtons";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 3600;

import { APP_URL } from "@/lib/site-config";

interface Comment {
  name: string;
  comment: string;
  createdAt: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  tags: string[] | null;
  published_at: string;
  updated_at: string | null;
  stars: number;
  comments: Comment[];
}

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const result = await db.select({
      id: blogsSchema.id,
      title: blogsSchema.title,
      slug: blogsSchema.slug,
      excerpt: blogsSchema.excerpt,
      content: blogsSchema.content,
      cover_image_url: blogsSchema.coverImageUrl,
      tags: blogsSchema.tags,
      published_at: blogsSchema.publishedAt,
      updated_at: blogsSchema.updatedAt,
      stars: blogsSchema.stars,
      comments: blogsSchema.comments,
    }).from(blogsSchema).where(and(eq(blogsSchema.slug, slug), eq(blogsSchema.isPublished, true)));
    if (result.length === 0) return null;
    return result[0] as unknown as Blog;
  } catch {
    return null;
  }
}

async function getRelatedBlogs(currentSlug: string): Promise<RelatedBlog[]> {
  try {
    const result = await db.select({
      id: blogsSchema.id,
      title: blogsSchema.title,
      slug: blogsSchema.slug,
      excerpt: blogsSchema.excerpt,
      cover_image_url: blogsSchema.coverImageUrl,
      published_at: blogsSchema.publishedAt,
    })
      .from(blogsSchema)
      .where(and(eq(blogsSchema.isPublished, true), ne(blogsSchema.slug, currentSlug)))
      .orderBy(desc(blogsSchema.publishedAt))
      .limit(3);
    return result as unknown as RelatedBlog[];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const allBlogs = await db
      .select({ slug: blogsSchema.slug })
      .from(blogsSchema)
      .where(eq(blogsSchema.isPublished, true));
    return allBlogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Not Found" };
  return {
    title: `${blog.title} | Samir Shaikh`,
    description: blog.excerpt ?? undefined,
    keywords: [
      blog.title,
      "Samir Shaikh",
      "Samir Shaikh blog",
      "backend engineering",
      "Node.js",
      "agentic AI",
      "AI development",
      "technical article",
      "software engineering",
      ...(blog.tags ?? []),
    ],
    alternates: {
      canonical: `${APP_URL}/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt || undefined,
      url: `${APP_URL}/blogs/${blog.slug}`,
      images: blog.cover_image_url ? [{ url: blog.cover_image_url, width: 1200, height: 630, alt: blog.title }] : [{ url: `${APP_URL}/Filled_Logo.png`, width: 1200, height: 630, alt: blog.title }],
      type: "article",
      publishedTime: blog.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || undefined,
      images: blog.cover_image_url ? [blog.cover_image_url] : [`${APP_URL}/Filled_Logo.png`],
    },
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
  const [blog, relatedBlogs] = await Promise.all([getBlog(slug), getRelatedBlogs(slug)]);

  if (!blog) notFound();

  return (
    <main className="flex flex-col flex-1 px-6 pb-20 pt-4 md:px-10">
      <div className="max-w-3xl mx-auto w-full">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blogs" },
            { name: blog.title, href: `/blogs/${blog.slug}` },
          ]}
        />
        {/* Back link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-foreground transition-colors mb-10 group"
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
          <div className="flex flex-wrap items-center justify-between text-xs text-text-muted tabular-nums mb-2">
            <time>
              {formatDate(blog.published_at)}
            </time>
            <div className="flex items-center gap-2">
              <BlogShareButtons title={blog.title} slug={blog.slug} compact />
              <BlogStarInteraction slug={blog.slug} initialStars={blog.stars ?? 0} />
            </div>
          </div>
          <h1
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="mt-4 text-base text-text-muted leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          <p className="sr-only">
            This technical article by Samir Shaikh covers {blog.title?.toLowerCase()}. Read to learn about semantic search, RAG systems, and backend engineering best practices.
          </p>
        </header>

        {/* Cover image */}
        {blog.cover_image_url && (
          <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-12 bg-footer-bg">
            <Image
              src={blog.cover_image_url}
              alt={`Cover image for ${blog.title} — blog post by Samir Shaikh`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Blog content */}
        <ContentWithToc
          html={blog.content}
          className="prose prose-gray dark:prose-invert max-w-none text-text-muted prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground hover:prose-a:text-text-secondary"
        />

        {/* Share buttons */}
        <BlogShareButtons title={blog.title} slug={blog.slug} />

        {/* Blog Interactions (Comments) */}
        <BlogInteractions
          slug={blog.slug}
          initialComments={blog.comments ?? []}
        />

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border-primary">
            <h2 className="text-xl font-semibold text-foreground mb-6 tracking-tight">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((related) => (
                <Link
                  key={related.id}
                  href={`/blogs/${related.slug}`}
                  className="group flex flex-col bg-background border border-border-primary rounded-xl overflow-hidden hover:border-text-muted transition-colors"
                >
                  {related.cover_image_url && (
                    <div className="relative w-full aspect-[16/9] bg-hover-bg overflow-hidden">
                      <Image
                        src={related.cover_image_url}
                        alt={`Cover image for ${related.title}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-text-muted mb-2 tabular-nums">{formatDate(related.published_at)}</p>
                    <h3 className="text-sm font-medium text-foreground leading-snug group-hover:text-text-secondary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    {related.excerpt && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">{related.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: blog.title,
              description: blog.excerpt || undefined,
              image: blog.cover_image_url ? [blog.cover_image_url] : [`${APP_URL}/Filled_Logo.png`],
              url: `${APP_URL}/blogs/${blog.slug}`,
              mainEntityOfPage: `${APP_URL}/blogs/${blog.slug}`,
              datePublished: blog.published_at,
              dateModified: blog.updated_at || blog.published_at,
              publisher: {
                "@type": "Organization",
                name: "Samir Shaikh Portfolio",
                logo: {
                  "@type": "ImageObject",
                  url: `${APP_URL}/Filled_Logo.png`,
                },
              },
              speakable: {
                "@type": "SpeakableSpecification",
                cssSelector: ["h1", ".prose p"],
              },
              author: [
                {
                  "@type": "Person",
                  name: "Samir Shaikh",
                  url: APP_URL,
                  sameAs: [
                    "https://linkedin.com/in/samir-shaikh-760b932a8",
                    "https://github.com/ShaikhSamir786",
                  ],
                }
              ]
            })
          }}
        />
      </div>
    </main>
  );
}
