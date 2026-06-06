import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { indexDocumentForRag } from "@/lib/rag";

export async function GET() {
  try {
    const session = await auth();
    const isAdmin = !!session;

    const result = isAdmin
      ? await db.select().from(blogsSchema).orderBy(desc(blogsSchema.createdAt))
      : await db.select().from(blogsSchema).where(eq(blogsSchema.isPublished, true)).orderBy(desc(blogsSchema.publishedAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, cover_image_url, is_published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug and content are required" },
        { status: 400 }
      );
    }

    const result = await db.insert(blogsSchema).values({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImageUrl: cover_image_url || null,
      isPublished: is_published ?? false,
      publishedAt: is_published ? new Date() : null,
    }).returning();

    // Fire and forget RAG indexing in the background
    indexDocumentForRag({
      id: result[0].id,
      type: 'blog',
      title,
      excerpt: excerpt || '',
      content,
    }).catch(console.error);

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
