import { SITE_URL, AUTOMATION_TOKEN } from "../config.mjs";

/**
 * Sends push notification to subscribers about a new blog post.
 * Best-effort: failures don't block the pipeline since the post is already live.
 * Targets subscribers with "blogs" topic preference.
 * @param {Object} params - Notification data
 * @param {string} params.title - Post title (prefixed with "New post: " in notification)
 * @param {string} params.excerpt - Post summary used as notification body
 * @param {string} params.slug - Post slug for the notification URL
 */
export async function notifySubscribers({ title, excerpt, slug }) {
  const res = await fetch(`${SITE_URL}/api/push/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTOMATION_TOKEN}`,
    },
    body: JSON.stringify({
      title: `New post: ${title}`,
      body: excerpt,
      url: `/blogs/${slug}`,
      targetTopic: "blogs",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`POST /api/push/send failed (post is still published): ${res.status} ${body}`);
    return;
  }

  console.log("Push notification sent to blog subscribers.");
}
