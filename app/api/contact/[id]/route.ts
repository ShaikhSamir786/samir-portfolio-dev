import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { contact as contactSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { seen } = await req.json();

    await db.update(contactSchema).set({ seen }).where(eq(contactSchema.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PATCH /api/contact/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update contact status" }, { status: 500 });
  }
}
