import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
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
      result = await db.select().from(projectsSchema).where(eq(projectsSchema.slug, slug));
    } else {
      result = await db.select().from(projectsSchema).where(and(eq(projectsSchema.slug, slug), eq(projectsSchema.isPublished, true)));
    }
    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result[0], {
      headers: session
        ? {}
        : {
            "Cache-Control": "public, max-age=3600, stale-while-revalidate",
          },
    });
  } catch (error) {
    console.error("GET /api/projects/slug/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
