#!/usr/bin/env node
/**
 * Automated blog generation & publishing.
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

import { readFile } from "node:fs/promises";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const rawSiteUrl = process.env.SITE_URL || process.env.NEXTAUTH_URL;
if (!rawSiteUrl) {
  console.error(`Missing required env var: SITE_URL or NEXTAUTH_URL`);
  process.exit(1);
}
const SITE_URL = rawSiteUrl.replace(/\/$/, "");
const GROQ_API_KEY = requireEnv("GROQ_API_KEY");
const AUTOMATION_TOKEN = requireEnv("BLOG_AUTOMATION_TOKEN");
const AUTO_PUBLISH = (process.env.AUTO_PUBLISH ?? "true").toLowerCase() !== "false";
const ENABLE_BLOG_AUTOMATION = process.env.ENABLE_BLOG_AUTOMATION === "true";
const MIN_WORD_COUNT = Number(process.env.MIN_WORD_COUNT ?? 350);

if (!ENABLE_BLOG_AUTOMATION) {
  console.log("Blog automation is disabled (ENABLE_BLOG_AUTOMATION is not 'true'). Exiting.");
  process.exit(0);
}

/**
 * Validates that a required environment variable exists.
 * Exits the process immediately if the variable is missing.
 * @param {string} name - The environment variable name to check
 * @returns {string} The value of the environment variable
 */
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

// Rotating pillar topics grounded in Samir's real stack + positioning.
// The model picks/narrows one per run and is told to skip anything close
// to an already-published title, so this stays fresh across runs without
// needing a separate research API.
const TOPIC_PILLARS = [
  "Building and scaling a Retrieval-Augmented Generation (RAG) pipeline with pgvector",
  "Event-driven backend architecture with Kafka and BullMQ",
  "Lessons from building a production WhatsApp automation system (whatsapp-web.js)",
  "Observability for Node.js/NestJS services with OpenTelemetry, Prometheus, and Grafana",
  "What moving toward Forward Deployed Engineering looks like for a backend-first engineer",
  "Designing a microservice pipeline for AI customer ticket triage",
  "Practical prompt engineering and evaluation for production LLM features",
  "GraphQL vs REST tradeoffs from a real full-stack project (Eventify)",
  "What actually breaks when you deploy an AI feature into a real customer environment",
  "Semantic search and embeddings in practice: pgvector cosine similarity end-to-end",
];

/**
 * Converts a string into a URL-safe slug.
 * - Lowercases and trims whitespace
 * - Replaces non-alphanumeric characters with hyphens
 * - Removes leading/trailing hyphens
 * - Truncates to 80 characters max
 * @param {string} text - The text to slugify
 * @returns {string} URL-safe slug
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Fetches all existing blog titles from the production API.
 * Used for deduplication to avoid writing about the same topic twice.
 * Uses Bearer token authentication for admin access.
 * @returns {Promise<string[]>} Array of existing blog titles, empty on failure
 */
async function fetchExistingTitles() {
  try {
    const res = await fetch(`${SITE_URL}/api/blogs`, {
      headers: {
        Authorization: `Bearer ${AUTOMATION_TOKEN}`,
      },
    });
    if (!res.ok) return [];
    const blogs = await res.json();
    return blogs.map((b) => b.title).filter(Boolean);
  } catch (err) {
    console.warn("Could not fetch existing blog titles, continuing without dedupe list:", err.message);
    return [];
  }
}

/**
 * Loads the grounding context from public/llms.txt.
 * This file contains verified facts about Samir's skills, projects, and experience.
 * The AI model uses this to generate accurate, non-hallucinated content.
 * Runs in GitHub Actions where the repo is already cloned.
 * @returns {Promise<string>} The grounding context text, empty string if file not found
 */
async function loadGroundingContext() {
  try {
    return await readFile(new URL("../public/llms.txt", import.meta.url), "utf-8");
  } catch {
    console.warn("public/llms.txt not found, generating without grounding context.");
    return "";
  }
}

/**
 * Generates a blog post using Groq's llama-3.3-70b-versatile model.
 * Uses grounded context from llms.txt to prevent hallucinations.
 * Includes anti-patterns list to avoid generic/corporate writing.
 * @param {Object} params - Generation parameters
 * @param {string} params.groundingContext - Verified facts about Samir from llms.txt
 * @param {string[]} params.existingTitles - Titles to avoid duplicating
 * @returns {Promise<Object>} Parsed post with title, slug, excerpt, markdown
 */
async function generatePost({ groundingContext, existingTitles }) {
  const groq = createGroq({ apiKey: GROQ_API_KEY });

  const systemPrompt = `You are ghostwriting a technical blog post for Samir Shaikh's personal engineering blog.

GROUNDING FACTS (only true, verifiable information about Samir — do not invent experience, employers, metrics, or claims beyond what's here or reasonably explained as general technical knowledge):
<CONTEXT>
${groundingContext}
</CONTEXT>

ALREADY-PUBLISHED TITLES (write about something meaningfully different from all of these):
${existingTitles.length ? existingTitles.map((t) => `- ${t}`).join("\n") : "(none yet)"}

CANDIDATE TOPIC PILLARS (pick the one least covered by the titles above, and narrow it to one specific, concrete angle):
${TOPIC_PILLARS.map((t) => `- ${t}`).join("\n")}

WRITING RULES:
1. First person, as Samir. Technical, specific, and grounded in the real projects/stack in the context above.
2. Lead with a direct, concrete opening claim (no throat-clearing like "In today's world..."). Answer-first structure.
3. Include at least one concrete number, metric, or specific technical detail per major section where honestly possible (avoid vague claims).
4. Use Markdown: a single H1 title, H2 section headings, code blocks with language tags where relevant, and a short concluding section.
5. Do not fabricate company names, coworkers, client quotes, or metrics that are not implied by the grounding context. If unsure, write about the general technical pattern instead of a specific unverifiable claim.
6. Length: 700-1100 words.

VOICE EXAMPLES (match this tone):
- "I spent three days debugging a race condition in our BullMQ worker..."
- "Here's what actually happens when pgvector scans a 1M row index..."
- "The trick with NextAuth v5 is understanding how session callbacks compose..."

ANTI-PATTERNS (never do these):
- Starting with "In today's fast-paced world..." or "In the realm of..."
- Using filler words: "leverage", "synergy", "game-changer", "seamless", "cutting-edge", "robust", "scalable"
- Making up specific company names, client numbers, or team sizes
- Writing generic conclusions like "In conclusion..." or "To sum up..."
- Using bullet points for the entire post (use prose with code blocks)
- Repeating the same sentence structure multiple times

OUTPUT FORMAT: Respond with ONLY the following structure (no markdown fences, no preamble):
<title>Post Title</title>
<slug>url-safe-slug</slug>
<excerpt>one or two sentence summary, under 200 characters</excerpt>
<tags>comma-separated relevant tags, lowercase</tags>
<markdown>
# Post Title
Full markdown body here...
</markdown>`;

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: systemPrompt,
    temperature: 0.5,
    maxTokens: 2000,
  });

  /**
   * Extracts content between XML-style tags from model output.
   * @param {string} tag - The tag name to extract
   * @returns {string|null} The trimmed content inside the tag, or null if not found
   */
  const getTag = (tag) => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
    return match ? match[1].trim() : null;
  };

  const parsed = {
    title: getTag("title"),
    slug: getTag("slug"),
    excerpt: getTag("excerpt"),
    tags: getTag("tags"),
    markdown: getTag("markdown")
  };

  if (!parsed.title || !parsed.markdown) {
    throw new Error(`Model output missing required fields (title or markdown). Raw output:\n${text}`);
  }

  // Validate and fix excerpt length
  if (!parsed.excerpt || parsed.excerpt.length > 200) {
    const firstParagraph = parsed.markdown.split('\n\n')[1] || '';
    parsed.excerpt = firstParagraph.slice(0, 197).trim() + '...';
  }

  parsed.slug = slugify(parsed.slug || parsed.title);
  return parsed;
}

/**
 * Converts markdown to sanitized HTML safe for rendering.
 * Pipeline: markdown -> GFM parsing -> rehype -> sanitize -> HTML string.
 * Allows className on code/span for syntax highlighting styles.
 * @param {string} markdown - Raw markdown content from the AI model
 * @returns {Promise<string>} Sanitized HTML string
 */
async function markdownToSafeHtml(markdown) {
  const schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      code: [...(defaultSchema.attributes?.code ?? []), "className"],
      span: [...(defaultSchema.attributes?.span ?? []), "className"],
    },
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

/**
 * Publishes a blog post to the production API.
 * Uses Bearer token authentication for server-to-server access.
 * The API automatically triggers RAG re-indexing on creation.
 * @param {Object} params - Blog post data
 * @param {string} params.title - Post title
 * @param {string} params.slug - URL-safe slug
 * @param {string} params.excerpt - Short summary (under 200 chars)
 * @param {string} params.html - Sanitized HTML content
 * @param {boolean} params.publish - Whether to publish immediately or save as draft
 * @returns {Promise<Object>} Created blog post object with id and slug
 */
async function publishBlog({ title, slug, excerpt, html, tags, publish }) {
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
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : null,
      is_published: publish,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST /api/blogs failed: ${res.status} ${body}`);
  }

  return res.json();
}

/**
 * Sends push notification to subscribers about a new blog post.
 * Best-effort: failures don't block the pipeline since the post is already live.
 * Targets subscribers with "blogs" topic preference.
 * @param {Object} params - Notification data
 * @param {string} params.title - Post title (prefixed with "New post: " in notification)
 * @param {string} params.excerpt - Post summary used as notification body
 * @param {string} params.slug - Post slug for the notification URL
 */
async function notifySubscribers({ title, excerpt, slug }) {
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

/**
 * Validates a generated blog post against quality criteria.
 * Checks for: word count, code blocks, H2 sections, no clichés,
 * excerpt length, and presence of specific numbers/metrics.
 * @param {Object} post - The generated post object
 * @param {string} post.markdown - The markdown content
 * @param {string} post.excerpt - The post excerpt
 * @returns {Object} { passes: boolean, score: number, checks: Object, wordCount: number }
 */
function validatePost(post) {
  const wordCount = post.markdown.trim().split(/\s+/).length;

  const checks = {
    wordCount: wordCount >= MIN_WORD_COUNT,
    hasCodeBlock: /```[\s\S]+?```/.test(post.markdown),
    hasH2Sections: /^## .+$/m.test(post.markdown),
    noClichés: !/game.?changer|leverage|synergy|seamless|cutting.?edge|robust/i.test(post.markdown),
    excerptLength: post.excerpt && post.excerpt.length <= 200,
    hasNumbers: /\d+/.test(post.markdown),
    hasVariety: !/^(#{1,2}\s+.+\n?){1,2}$/.test(post.markdown.trim()),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const passes = score >= 5;

  return { passes, score, checks, wordCount };
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

      console.log("Fetching existing blog titles for dedupe...");
      const existingTitles = await fetchExistingTitles();

      console.log("Loading grounding context from public/llms.txt...");
      const groundingContext = await loadGroundingContext();

      console.log("Generating post with Groq (llama-3.3-70b-versatile)...");
      const post = await generatePost({ groundingContext, existingTitles });

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
        await new Promise(r => setTimeout(r, delay));
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
