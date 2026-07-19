#!/usr/bin/env node
/**
 * Automated blog generation & publishing orchestrator.
 *
 * Pipeline: topic selection (grounded in llms.txt + existing posts) ->
 * Groq content generation -> Markdown->HTML (sanitized) -> POST /api/blogs
 * -> POST /api/push/send (only if actually published).
 *
 * RAG re-indexing is NOT triggered separately here: POST /api/blogs already
 * fire-and-forgets indexDocumentForRag() server-side (see app/api/blogs/route.ts).
 *
 * Required env vars (set as GitHub Actions secrets):
 *   GROQ_API_KEY            - Groq API key (same one the chatbot uses)
 *   SITE_URL                - e.g. https://samir-portfolio-dev.vercel.app
 *   BLOG_AUTOMATION_TOKEN   - shared secret, must match the Vercel env var of the same name
 *
 * Optional:
 *   AUTO_PUBLISH            - "true" (default) or "false". If "false", posts are
 *                              always saved as drafts (is_published: false) for
 *                              manual review in /admin/blogs before going live.
 *   MIN_WORD_COUNT          - quality gate; below this, force draft regardless
 *                              of AUTO_PUBLISH (default: 350)
 */

import { ENABLE_BLOG_AUTOMATION, AUTO_PUBLISH, SITE_URL } from "./config.mjs";
import { fetchExistingTitles, publishBlog, notifySubscribers } from "./api/index.mjs";
import { loadGroundingContext, generatePostWithRetry } from "./generate.mjs";
import { markdownToSafeHtml } from "./convert.mjs";
import { validatePost } from "./validate.mjs";

if (!ENABLE_BLOG_AUTOMATION) {
  console.log("Blog automation is disabled (ENABLE_BLOG_AUTOMATION is not 'true'). Exiting.");
  process.exit(0);
}

/**
 * Main pipeline: fetch context -> generate -> validate -> publish -> notify.
 * Includes retry logic (3 attempts) with exponential backoff.
 * Logs structured metrics for each run.
 */
async function main() {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`\n=== Attempt ${attempt}/${MAX_ATTEMPTS} ===`);

      console.log("Fetching existing blog titles and slugs for dedupe...");
      const { titles: existingTitles, slugs: existingSlugs } = await fetchExistingTitles();

      console.log("Loading grounding context from public/llms.txt...");
      const groundingContext = await loadGroundingContext();

      console.log("Generating post with Groq (llama-3.3-70b-versatile)...");
      const post = await generatePostWithRetry({ groundingContext, existingTitles, existingSlugs });

      console.log("Running quality checks...");
      const validation = validatePost(post);
      console.log(`Quality score: ${validation.score}/7 | Checks:`, validation.checks);

      const shouldPublish = AUTO_PUBLISH && validation.passes;

      if (!validation.passes) {
        console.warn(`Quality gate failed (score ${validation.score}/7) — saving as draft.`);
      }

      console.log(`Converting markdown to sanitized HTML for: "${post.title}"`);
      const html = await markdownToSafeHtml(post.markdown);

      console.log(`Publishing (is_published=${shouldPublish})...`);
      const created = await publishBlog({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        html,
        tags: post.tags,
        publish: shouldPublish,
      });
      console.log(`Created blog: ${SITE_URL}/blogs/${created.slug} (id: ${created.id})`);

      if (shouldPublish) {
        await notifySubscribers({ title: post.title, excerpt: post.excerpt, slug: post.slug });
      } else {
        console.log("Skipping subscriber notification (post is a draft — review it in /admin/blogs).");
      }

      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        attempt,
        title: post.title,
        slug: post.slug,
        wordCount: validation.wordCount,
        qualityScore: validation.score,
        published: shouldPublish,
      }));

      return;
    } catch (err) {
      console.error(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt < MAX_ATTEMPTS) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  console.error(`Failed after ${MAX_ATTEMPTS} attempts`);
  process.exit(1);
}

main().catch((err) => {
  console.error("Blog generation failed:", err);
  process.exit(1);
});
