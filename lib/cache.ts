import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { projects as projectsSchema, blogs as blogsSchema, socials as socialsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

interface SlimItem {
  title: string;
  slug: string;
}

/**
 * Cached fetch of published projects for footer/nav (max 6).
 * Revalidated hourly via unstable_cache; on-demand tag revalidation
 * can be added later via revalidateTag("projects") on publish.
 */
export const getCachedProjects = unstable_cache(
  async (): Promise<SlimItem[]> => {
    const rows = await db
      .select({ title: projectsSchema.title, slug: projectsSchema.slug })
      .from(projectsSchema)
      .where(eq(projectsSchema.isPublished, true))
      .orderBy(desc(projectsSchema.publishedAt))
      .limit(6);
    return rows;
  },
  ["footer-projects"],
  { revalidate: 3600, tags: ["projects"] }
);

/**
 * Cached fetch of published blogs for footer/nav (max 6).
 * Revalidated hourly via unstable_cache.
 */
export const getCachedBlogs = unstable_cache(
  async (): Promise<SlimItem[]> => {
    const rows = await db
      .select({ title: blogsSchema.title, slug: blogsSchema.slug })
      .from(blogsSchema)
      .where(eq(blogsSchema.isPublished, true))
      .orderBy(desc(blogsSchema.publishedAt))
      .limit(6);
    return rows;
  },
  ["footer-blogs"],
  { revalidate: 3600, tags: ["blogs"] }
);

/**
 * Cached fetch of socials for footer (max 10).
 * Revalidated hourly via unstable_cache.
 */
export const getCachedSocials = unstable_cache(
  async (): Promise<{ name: string; url: string }[]> => {
    const rows = await db
      .select({ name: socialsSchema.name, url: socialsSchema.url })
      .from(socialsSchema)
      .orderBy(socialsSchema.displayOrder)
      .limit(10);
    return rows.filter((r): r is { name: string; url: string } => r.name !== null && r.url !== null);
  },
  ["footer-socials"],
  { revalidate: 3600, tags: ["socials"] }
);
