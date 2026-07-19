import { SITE_URL, AUTOMATION_TOKEN } from "../config.mjs";

/**
 * Publishes a blog post to the production API.
 * Uses Bearer token authentication for server-to-server access.
 * The API automatically triggers RAG re-indexing on creation.
 * @param {Object} params - Blog post data
 * @param {string} params.title - Post title
 * @param {string} params.slug - URL-safe slug
 * @param {string} params.excerpt - Short summary (under 200 chars)
 * @param {string} params.html - Sanitized HTML content
 * @param {string|string[]} params.tags - Comma-separated tags string or pre-parsed array
 * @param {boolean} params.publish - Whether to publish immediately or save as draft
 * @returns {Promise<Object>} Created blog post object with id and slug
 */
export async function publishBlog({ title, slug, excerpt, html, tags, publish }) {
  const res = await fetch(`${SITE_URL}/api/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTOMATION_TOKEN}`,
    },
    body: JSON.stringify({
      title,
      slug,
      excerpt,
      content: html,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : null),
      is_published: publish,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST /api/blogs failed: ${res.status} ${body}`);
  }

  return res.json();
}
