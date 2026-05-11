import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  try {
    let result;
    if (session) {
      // Admin sees everything
      result = await query(
        `SELECT id, title, slug, excerpt, cover_image_url, is_published, created_at, technologies, github_link, demo_link 
         FROM projects ORDER BY created_at DESC`
      );
    } else {
      // Public sees only published
      result = await query(
        `SELECT id, title, slug, excerpt, cover_image_url, published_at, technologies, github_link, demo_link 
         FROM projects WHERE is_published = true ORDER BY published_at DESC`
      );
    }
    return NextResponse.json(result.rows);
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
    const { title, slug } = await req.json();

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO projects (title, slug, content) 
       VALUES ($1, $2, $3) RETURNING id`,
      [title, slug, ""]
    );

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    if (error.code === "23505") {
      // unique violation
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
