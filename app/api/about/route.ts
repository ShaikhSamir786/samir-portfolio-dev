import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { about } from "@/lib/schema";

export async function GET() {
  try {
    const result = await db.select({ description: about.description }).from(about).limit(1);
    const description = result[0]?.description ?? "";
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

    const existing = await db.select({ description: about.description }).from(about).limit(1);
    if (existing.length > 0) {
      await db.update(about).set({ description: description ?? "" });
    } else {
      await db.insert(about).values({ description: description ?? "" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/about error:", error);
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 });
  }
}
