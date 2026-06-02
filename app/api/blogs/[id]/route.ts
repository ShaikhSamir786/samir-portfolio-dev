import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const result = await db.select().from(blogsSchema).where(eq(blogsSchema.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, excerpt, content, cover_image_url, is_published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug and content are required" },
        { status: 400 }
      );
    }

    // Get current blog to check if published status changed
    const current = await db.select({ isPublished: blogsSchema.isPublished, publishedAt: blogsSchema.publishedAt }).from(blogsSchema).where(eq(blogsSchema.id, id));

    if (current.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const wasPublished = current[0].isPublished ?? false;
    const publishedAt =
      !wasPublished && is_published
        ? new Date()
        : current[0].publishedAt;

    const result = await db.update(blogsSchema)
      .set({
        title, slug, excerpt: excerpt || null, content, coverImageUrl: cover_image_url || null,
        isPublished: is_published ?? false, publishedAt, updatedAt: new Date()
      })
      .where(eq(blogsSchema.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PUT /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function PATCH(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const current = await db.select({ isPublished: blogsSchema.isPublished, publishedAt: blogsSchema.publishedAt }).from(blogsSchema).where(eq(blogsSchema.id, id));

    if (current.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const row = current[0];
    const newPublished = !(row.isPublished ?? false);
    const publishedAt = newPublished && !row.publishedAt ? new Date() : row.publishedAt;

    const result = await db.update(blogsSchema)
      .set({ isPublished: newPublished, publishedAt, updatedAt: new Date() })
      .where(eq(blogsSchema.id, id))
      .returning({ id: blogsSchema.id, isPublished: blogsSchema.isPublished, publishedAt: blogsSchema.publishedAt });

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PATCH /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to toggle publish status" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await db.delete(blogsSchema).where(eq(blogsSchema.id, id)).returning({ id: blogsSchema.id });

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
