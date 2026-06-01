import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

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

    await query(
      `INSERT INTO push_subscriptions (endpoint, subscription_json, topic)
       VALUES ($1, $2, $3)
       ON CONFLICT (endpoint) DO UPDATE SET topic = $3, subscription_json = $2`,
      [subscription.endpoint, JSON.stringify(subscription), topicValue]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
