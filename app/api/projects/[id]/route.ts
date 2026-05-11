import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
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
    const result = await query(
      `SELECT id, title, slug, excerpt, content, cover_image_url, is_published, technologies, github_link, demo_link 
       FROM projects WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
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
      const published_at = is_published ? new Date().toISOString() : null;

      await query(
        `UPDATE projects SET is_published = $1, published_at = $2, updated_at = NOW() WHERE id = $3`,
        [is_published, published_at, id]
      );

      return NextResponse.json({ success: true });
    }

    // Otherwise it's a full update
    const { title, slug, excerpt, content, cover_image_url, technologies, github_link, demo_link } = body;

    await query(
      `UPDATE projects 
       SET title = $1, slug = $2, excerpt = $3, content = $4, cover_image_url = $5, technologies = $6, github_link = $7, demo_link = $8, updated_at = NOW() 
       WHERE id = $9`,
      [title, slug, excerpt, content, cover_image_url, technologies || [], github_link, demo_link, id]
    );

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
    await query(`DELETE FROM projects WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
