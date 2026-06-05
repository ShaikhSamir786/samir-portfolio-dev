import Link from 'next/link';
import { db } from "@/lib/db";
import { projects as projectsSchema, blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitemap | Portfolio',
  description: 'A directory of all pages on the website.',
};

export const dynamic = 'force-dynamic';

export default async function SitemapPage() {
  const projects = await db.select({ title: projectsSchema.title, slug: projectsSchema.slug })
    .from(projectsSchema)
    .where(eq(projectsSchema.isPublished, true))
    .orderBy(desc(projectsSchema.publishedAt));

  const blogs = await db.select({ title: blogsSchema.title, slug: blogsSchema.slug })
    .from(blogsSchema)
    .where(eq(blogsSchema.isPublished, true))
    .orderBy(desc(blogsSchema.publishedAt));

  const staticPages = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact", href: "/contact" },
    { label: "Resume", href: "/resume" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 tracking-tight text-foreground">Sitemap</h1>
      <p className="text-text-muted mb-16 text-lg">A complete directory of all pages on this website.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Core Pages */}
        <div>
          <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-border-primary text-foreground">Main Pages</h2>
          <ul className="flex flex-col gap-4">
            {staticPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-text-muted hover:text-foreground transition-colors flex items-center gap-2 group text-sm">
                  <span className="text-text-muted opacity-50 group-hover:text-foreground group-hover:opacity-100 transition-colors text-xs font-mono">/</span>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-border-primary text-foreground">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-text-muted italic text-sm">No projects published yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="text-text-muted hover:text-foreground transition-colors flex items-center gap-2 group text-sm">
                    <span className="text-text-muted opacity-50 group-hover:text-foreground group-hover:opacity-100 transition-colors text-xs font-mono">/</span>
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Blogs */}
        <div>
          <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-border-primary text-foreground">Blog Posts</h2>
          {blogs.length === 0 ? (
            <p className="text-text-muted italic text-sm">No blog posts published yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {blogs.map((blog) => (
                <li key={blog.slug}>
                  <Link href={`/blogs/${blog.slug}`} className="text-text-muted hover:text-foreground transition-colors flex items-center gap-2 group text-sm">
                    <span className="text-text-muted opacity-50 group-hover:text-foreground group-hover:opacity-100 transition-colors text-xs font-mono">/</span>
                    {blog.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
