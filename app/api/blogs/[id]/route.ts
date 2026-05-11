import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM blogs WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
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
    const current = await query(
      "SELECT is_published, published_at FROM blogs WHERE id = $1",
      [id]
    );

    if (current.rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const wasPublished = (current.rows[0] as { is_published: boolean; published_at: string | null }).is_published;
    const publishedAt =
      !wasPublished && is_published
        ? new Date().toISOString()
        : (current.rows[0] as { published_at: string | null }).published_at;

    const result = await query(
      `UPDATE blogs
       SET title = $1, slug = $2, excerpt = $3, content = $4,
           cover_image_url = $5, is_published = $6, published_at = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [title, slug, excerpt || null, content, cover_image_url || null, is_published ?? false, publishedAt, id]
    );

    return NextResponse.json(result.rows[0]);
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

    const current = await query(
      "SELECT is_published, published_at FROM blogs WHERE id = $1",
      [id]
    );

    if (current.rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const row = current.rows[0] as { is_published: boolean; published_at: string | null };
    const newPublished = !row.is_published;
    const publishedAt = newPublished && !row.published_at ? new Date().toISOString() : row.published_at;

    const result = await query(
      `UPDATE blogs
       SET is_published = $1, published_at = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, is_published, published_at`,
      [newPublished, publishedAt, id]
    );

    return NextResponse.json(result.rows[0]);
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
    const result = await query(
      "DELETE FROM blogs WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
