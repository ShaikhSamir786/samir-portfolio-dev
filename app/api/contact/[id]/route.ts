import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

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

    await query(
      `UPDATE contact SET seen = $1 WHERE id = $2`,
      [seen, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PATCH /api/contact/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update contact status" }, { status: 500 });
  }
}
