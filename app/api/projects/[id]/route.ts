import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await db.select().from(projectsSchema).where(eq(projectsSchema.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // If body only has is_published, it's a toggle publish
    if (Object.keys(body).length === 1 && "is_published" in body) {
      const { is_published } = body;
      const published_at = is_published ? new Date() : null;

      await db.update(projectsSchema)
        .set({ isPublished: is_published, publishedAt: published_at, updatedAt: new Date() })
        .where(eq(projectsSchema.id, id));

      return NextResponse.json({ success: true });
    }

    // Otherwise it's a full update
    const { title, slug, excerpt, content, cover_image_url, technologies, github_link, demo_link } = body;

    await db.update(projectsSchema)
      .set({ 
        title, slug, excerpt, content, coverImageUrl: cover_image_url, technologies: technologies || [], githubLink: github_link, demoLink: demo_link, updatedAt: new Date()
      })
      .where(eq(projectsSchema.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(projectsSchema).where(eq(projectsSchema.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
