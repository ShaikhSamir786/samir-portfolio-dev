import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT description FROM about LIMIT 1");
    const description = (result.rows[0] as { description: string } | undefined)?.description ?? "";
    return NextResponse.json({ description });
  } catch (error) {
    console.error("GET /api/about error:", error);
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { description } = await req.json();

    // Upsert — table holds at most one row
    const existing = await query("SELECT 1 FROM about LIMIT 1");
    if (existing.rows.length > 0) {
      await query("UPDATE about SET description = $1", [description ?? ""]);
    } else {
      await query("INSERT INTO about (description) VALUES ($1)", [description ?? ""]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/about error:", error);
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 });
  }
}
