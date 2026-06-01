import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await query(
      "SELECT id, endpoint, topic, created_at FROM push_subscriptions ORDER BY created_at DESC"
    );
    
    const subscribers = result.rows;
    const total = subscribers.length;
    const blogsOnly = subscribers.filter((s: any) => s.topic === "blogs").length;
    const all = subscribers.filter((s: any) => s.topic === "all").length;

    return NextResponse.json({
      metrics: { total, blogsOnly, all },
      subscribers
    });
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
