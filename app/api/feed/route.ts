import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { APP_URL, AUTHOR_NAME } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const blogs = await db
      .select({
        title: blogsSchema.title,
        slug: blogsSchema.slug,
        excerpt: blogsSchema.excerpt,
        publishedAt: blogsSchema.publishedAt,
        updatedAt: blogsSchema.updatedAt,
      })
      .from(blogsSchema)
      .where(eq(blogsSchema.isPublished, true))
      .orderBy(desc(blogsSchema.publishedAt))
      .limit(50);

    const items = blogs
      .map((blog) => {
        const pubDate = blog.publishedAt
          ? new Date(blog.publishedAt).toUTCString()
          : new Date().toUTCString();
        const modDate = blog.updatedAt
          ? new Date(blog.updatedAt).toUTCString()
          : pubDate;

        return `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${APP_URL}/blogs/${blog.slug}</link>
      <guid isPermaLink="true">${APP_URL}/blogs/${blog.slug}</guid>
      <description>${escapeXml(blog.excerpt || "")}</description>
      <pubDate>${pubDate}</pubDate>
      <lastMod>${modDate}</lastMod>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(AUTHOR_NAME)} — Blog</title>
    <link>${APP_URL}/blogs</link>
    <description>Technical articles on backend engineering, AI, RAG systems, and Node.js by ${escapeXml(AUTHOR_NAME)}.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${APP_URL}/api/feed" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("RSS feed generation error:", error);
    return NextResponse.json({ error: "Failed to generate RSS feed" }, { status: 500 });
  }
}
