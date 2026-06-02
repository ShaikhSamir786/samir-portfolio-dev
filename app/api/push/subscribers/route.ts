import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pushSubscriptions as pushSubscriptionsSchema } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscribers = await db.select({
      id: pushSubscriptionsSchema.id,
      endpoint: pushSubscriptionsSchema.endpoint,
      topic: pushSubscriptionsSchema.topic,
      created_at: pushSubscriptionsSchema.createdAt,
    }).from(pushSubscriptionsSchema).orderBy(desc(pushSubscriptionsSchema.createdAt));
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
