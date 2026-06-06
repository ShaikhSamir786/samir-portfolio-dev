import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { indexDocumentForRag } from "@/lib/rag";

export async function GET() {
  const session = await auth();

  try {
    let result;
    if (session) {
      // Admin sees everything
      result = await db.select().from(projectsSchema).orderBy(desc(projectsSchema.createdAt));
    } else {
      // Public sees only published
      result = await db.select().from(projectsSchema).where(eq(projectsSchema.isPublished, true)).orderBy(desc(projectsSchema.publishedAt));
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, cover_image_url, is_published, technologies, github_link, demo_link } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug and content are required" },
        { status: 400 }
      );
    }

    const result = await db.insert(projectsSchema).values({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImageUrl: cover_image_url || null,
      isPublished: is_published ?? false,
      publishedAt: is_published ? new Date() : null,
      technologies: technologies || [],
      githubLink: github_link || null,
      demoLink: demo_link || null,
    }).returning();

    // Fire and forget RAG indexing
    indexDocumentForRag({
      id: result[0].id,
      type: 'project',
      title,
      excerpt: excerpt || '',
      content,
      technologies: technologies || [],
    }).catch(console.error);

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    if (error.code === "23505") {
      // unique violation
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
