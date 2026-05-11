import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const result = await query(
      "SELECT * FROM blogs WHERE slug = $1 AND is_published = true",
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/blogs/slug/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
