import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { about } from "@/lib/schema";
import { reindexAboutForRag } from "@/lib/rag";

export async function GET() {
  try {
    const result = await db
      .select({ description: about.description, present: about.present, future: about.future })
      .from(about)
      .limit(1);
    const row = result[0];
    return NextResponse.json({
      description: row?.description ?? "",
      present: row?.present ?? "",
      future: row?.future ?? "",
    });
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
    const { description, present, future } = await req.json();

    const existing = await db
      .select({ description: about.description })
      .from(about)
      .limit(1);

    if (existing.length > 0) {
      await db.update(about).set({
        description: description ?? "",
        present: present ?? "",
        future: future ?? "",
      });
    } else {
      await db.insert(about).values({
        description: description ?? "",
        present: present ?? "",
        future: future ?? "",
      });
    }

    await reindexAboutForRag();

    revalidatePath("/");
    revalidatePath("/about");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/about error:", error);
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 });
  }
}
