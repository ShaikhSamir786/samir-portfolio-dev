import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { projects as projectsSchema, blogs as blogsSchema, socials as socialsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

interface SlimItem {
  title: string;
  slug: string;
}

/**
 * Cached fetch of published projects for footer/nav.
 * Revalidated every 60 seconds via unstable_cache.
 */
export const getCachedProjects = unstable_cache(
  async (): Promise<SlimItem[]> => {
    try {
      const rows = await db
        .select({ title: projectsSchema.title, slug: projectsSchema.slug })
        .from(projectsSchema)
        .where(eq(projectsSchema.isPublished, true))
        .orderBy(desc(projectsSchema.publishedAt))
        .limit(6);
      return rows as SlimItem[];
    } catch {
      return [];
    }
  },
  ["footer-projects"],
  { revalidate: 60, tags: ["projects"] }
);

/**
 * Cached fetch of published blogs for footer/nav.
 */
export const getCachedBlogs = unstable_cache(
  async (): Promise<SlimItem[]> => {
    try {
      const rows = await db
        .select({ title: blogsSchema.title, slug: blogsSchema.slug })
        .from(blogsSchema)
        .where(eq(blogsSchema.isPublished, true))
        .orderBy(desc(blogsSchema.publishedAt))
        .limit(6);
      return rows as SlimItem[];
    } catch {
      return [];
    }
  },
  ["footer-blogs"],
  { revalidate: 60, tags: ["blogs"] }
);

/**
 * Cached fetch of socials for footer.
 */
export const getCachedSocials = unstable_cache(
  async (): Promise<{ name: string; url: string }[]> => {
    try {
      const rows = await db
        .select({ name: socialsSchema.name, url: socialsSchema.url })
        .from(socialsSchema)
        .orderBy(socialsSchema.displayOrder);
      return rows as { name: string; url: string }[];
    } catch {
      return [];
    }
  },
  ["footer-socials"],
  { revalidate: 60, tags: ["socials"] }
);
