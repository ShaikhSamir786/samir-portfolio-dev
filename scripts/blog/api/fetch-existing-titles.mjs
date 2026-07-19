import { SITE_URL, AUTOMATION_TOKEN } from "../config.mjs";

/**
 * Fetches all existing blog titles and slugs from the production API.
 * Used for deduplication to avoid writing about the same topic twice
 * and to detect slug collisions before publishing.
 * Uses Bearer token authentication for admin access.
 * @returns {Promise<{titles: string[], slugs: string[]}>} Existing titles and slugs
 */
export async function fetchExistingTitles() {
  try {
    const res = await fetch(`${SITE_URL}/api/blogs`, {
      headers: {
        Authorization: `Bearer ${AUTOMATION_TOKEN}`,
      },
    });
    if (!res.ok) return { titles: [], slugs: [] };
    const blogs = await res.json();
    return {
      titles: blogs.map((b) => b.title).filter(Boolean),
      slugs: blogs.map((b) => b.slug).filter(Boolean),
    };
  } catch (err) {
    console.warn("Could not fetch existing blog data, continuing without dedupe list:", err.message);
    return { titles: [], slugs: [] };
  }
}
