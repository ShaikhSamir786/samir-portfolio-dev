import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();

  try {
    let result;
    if (session) {
      // Admin can view any project by slug (draft or published)
      result = await query(
        `SELECT id, title, slug, excerpt, content, cover_image_url, is_published, technologies, github_link, demo_link, published_at, created_at
         FROM projects WHERE slug = $1`,
        [slug]
      );
    } else {
      // Public can only view published projects
      result = await query(
        `SELECT id, title, slug, excerpt, content, cover_image_url, technologies, github_link, demo_link, published_at
         FROM projects WHERE slug = $1 AND is_published = true`,
        [slug]
      );
    }

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/projects/slug/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
