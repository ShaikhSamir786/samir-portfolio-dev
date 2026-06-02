import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/lib/db";
import { pushSubscriptions as pushSubscriptionsSchema, sentNotifications as sentNotificationsSchema } from "@/lib/schema";
import { eq, or } from "drizzle-orm";
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
    const { title, body, url, image, targetTopic } = await req.json();

    // If targetTopic is "blogs", we send to users subscribed to "blogs" OR "all".
    // If targetTopic is "all", we only send to users subscribed to "all".
    let subscribers;
    if (targetTopic === "blogs") {
      subscribers = await db.select({ subscription_json: pushSubscriptionsSchema.subscriptionJson })
        .from(pushSubscriptionsSchema)
        .where(or(eq(pushSubscriptionsSchema.topic, "blogs"), eq(pushSubscriptionsSchema.topic, "all")));
    } else {
      subscribers = await db.select({ subscription_json: pushSubscriptionsSchema.subscriptionJson })
        .from(pushSubscriptionsSchema)
        .where(eq(pushSubscriptionsSchema.topic, "all"));
    }

    const payload = JSON.stringify({ title, body, url, image });

    const sendPromises = subscribers.map(async (row: any) => {
      const sub = row.subscription_json;
      try {
        await webpush.sendNotification(sub, payload);
        return true;
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired or is invalid, remove it from the DB
          await db.delete(pushSubscriptionsSchema).where(eq(pushSubscriptionsSchema.endpoint, sub.endpoint));
        } else {
          console.error("Error sending push:", err);
        }
        return false;
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(Boolean).length;

    await db.insert(sentNotificationsSchema).values({
      title, body, url: url || null, imageUrl: image || null, targetTopic, successCount
    });

    return NextResponse.json({ success: true, count: successCount });
  } catch (err) {
    console.error("Send push error:", err);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
