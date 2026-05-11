import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await query(`UPDATE contact SET seen = true WHERE seen = false`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`POST /api/contact/seen-all error:`, error);
    return NextResponse.json({ error: "Failed to update contact statuses" }, { status: 500 });
  }
}
