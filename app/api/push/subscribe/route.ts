import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pushSubscriptions as pushSubscriptionsSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, topic } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription payload" },
        { status: 400 }
      );
    }

    // Default to 'all' if the user somehow submits an invalid topic
    const topicValue = topic === "blogs" ? "blogs" : "all";

    await db.insert(pushSubscriptionsSchema).values({
      endpoint: subscription.endpoint,
      subscriptionJson: subscription,
      topic: topicValue,
    }).onConflictDoUpdate({
      target: pushSubscriptionsSchema.endpoint,
      set: { topic: topicValue, subscriptionJson: subscription }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
