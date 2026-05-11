import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT resume FROM resume LIMIT 1");
    const resume = (result.rows[0] as { resume: string } | undefined)?.resume ?? "";
    return NextResponse.json({ resume });
  } catch (error) {
    console.error("GET /api/resume error:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resume } = await req.json();

    // Upsert — table holds at most one row
    const existing = await query("SELECT 1 FROM resume LIMIT 1");
    if (existing.rows.length > 0) {
      await query("UPDATE resume SET resume = $1", [resume ?? ""]);
    } else {
      await query("INSERT INTO resume (resume) VALUES ($1)", [resume ?? ""]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/resume error:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}
