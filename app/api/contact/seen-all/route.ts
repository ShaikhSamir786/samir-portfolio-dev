import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { contact as contactSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.update(contactSchema).set({ seen: true }).where(eq(contactSchema.seen, false));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`POST /api/contact/seen-all error:`, error);
    return NextResponse.json({ error: "Failed to update contact statuses" }, { status: 500 });
  }
}
