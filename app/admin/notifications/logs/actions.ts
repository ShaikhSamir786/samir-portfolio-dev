"use server";

import { db } from "@/lib/db";
import { sentNotifications as sentNotificationsSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteNotificationLog(id: string) {
  try {
    await db.delete(sentNotificationsSchema).where(eq(sentNotificationsSchema.id, id));
    revalidatePath("/admin/notifications/logs");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification log:", error);
    return { success: false, error: "Failed to delete log" };
  }
}
