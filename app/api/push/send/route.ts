import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    "mailto:your-email@example.com", // Replace with your actual email
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  try {
    const { title, body, url, targetTopic } = await req.json();

    // If targetTopic is "blogs", we send to users subscribed to "blogs" OR "all".
    // If targetTopic is "all", we only send to users subscribed to "all".
    const sqlQuery = targetTopic === "blogs" 
      ? "SELECT subscription_json FROM push_subscriptions WHERE topic = 'blogs' OR topic = 'all'"
      : "SELECT subscription_json FROM push_subscriptions WHERE topic = 'all'";

    const result = await query(sqlQuery);

    const payload = JSON.stringify({ title, body, url });

    const sendPromises = result.rows.map(async (row: any) => {
      const sub = row.subscription_json;
      try {
        await webpush.sendNotification(sub, payload);
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired or is invalid, remove it from the DB
          await query("DELETE FROM push_subscriptions WHERE endpoint = $1", [sub.endpoint]);
        } else {
          console.error("Error sending push:", err);
        }
      }
    });

    await Promise.allSettled(sendPromises);

    return NextResponse.json({ success: true, count: result.rows.length });
  } catch (err) {
    console.error("Send push error:", err);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
