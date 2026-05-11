import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    const isAdmin = !!session;

    const result = await query(
      isAdmin
        ? `SELECT id, title, slug, excerpt, cover_image_url, is_published, created_at, published_at
           FROM blogs ORDER BY created_at DESC`
        : `SELECT id, title, slug, excerpt, cover_image_url, is_published, created_at, published_at
           FROM blogs WHERE is_published = true ORDER BY published_at DESC`
    );
    return NextResponse.json(result.rows);
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

    const result = await query(
      `INSERT INTO blogs (title, slug, excerpt, content, cover_image_url, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        slug,
        excerpt || null,
        content,
        cover_image_url || null,
        is_published ?? false,
        is_published ? new Date().toISOString() : null,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
