import { readFile } from "node:fs/promises";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { GROQ_API_KEY } from "./config.mjs";
import { TOPIC_PILLARS } from "./topics.mjs";
import { slugify } from "./utils.mjs";

/**
 * Loads the grounding context from public/llms.txt.
 * This file contains verified facts about Samir's skills, projects, and experience.
 * The AI model uses this to generate accurate, non-hallucinated content.
 * Runs in GitHub Actions where the repo is already cloned.
 * @returns {Promise<string>} The grounding context text, empty string if file not found
 */
export async function loadGroundingContext() {
  try {
    return await readFile(new URL("../../public/llms.txt", import.meta.url), "utf-8");
  } catch {
    console.warn("public/llms.txt not found, generating without grounding context.");
    return "";
  }
}

/**
 * Retry wrapper for generatePost — LLMs occasionally malform structured output.
 * @param {Object} params - Same as generatePost params
 * @param {number} [maxRetries=2] - Max retry attempts
 * @returns {Promise<Object>} Parsed post
 */
export async function generatePostWithRetry(params, maxRetries = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await generatePost(params);
    } catch (err) {
      if (i === maxRetries) throw err;
      console.warn(`[generatePost] Attempt ${i + 1} failed, retrying:`, err.message);
    }
  }
}

/**
 * Generates a blog post using Groq's llama-3.3-70b-versatile model.
 * Uses grounded context from llms.txt to prevent hallucinations.
 * Includes anti-patterns list to avoid generic/corporate writing.
 * @param {Object} params - Generation parameters
 * @param {string} params.groundingContext - Verified facts about Samir from llms.txt
 * @param {string[]} params.existingTitles - Titles to avoid duplicating
 * @param {string[]} [params.existingSlugs] - Existing slugs for collision detection
 * @returns {Promise<Object>} Parsed post with title, slug, excerpt, markdown
 */
export async function generatePost({ groundingContext, existingTitles, existingSlugs = [] }) {
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

OUTPUT FORMAT: Respond with ONLY the following structure (no markdown fences, no preamble). The <markdown> block MUST be the very last thing in your response — nothing after the closing </markdown> tag.
<title>Post Title</title>
<slug>url-safe-slug</slug>
<excerpt>one or two sentence summary, under 200 characters</excerpt>
<tags>comma-separated relevant tags, lowercase</tags>
<markdown>
# Post Title
Full markdown body here...
</markdown>`;

  let text;
  let finishReason;
  try {
    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: systemPrompt,
      temperature: 0.5,
      maxTokens: 3000,
    });
    text = result.text;
    finishReason = result.finishReason;
  } catch (err) {
    throw new Error(`Groq generation request failed: ${err.message}`);
  }

  if (finishReason === "length") {
    throw new Error("Generation truncated due to token limit — increase maxTokens.");
  }

  /**
   * Extracts content between XML-style tags from model output.
   * For <markdown>, anchors to end-of-string to avoid early termination
   * on code blocks that contain angle-bracket text.
   * @param {string} tag - The tag name to extract
   * @returns {string|null} The trimmed content inside the tag, or null if not found
   */
  const getTag = (tag) => {
    const pattern = tag === "markdown"
      ? new RegExp(`<markdown>([\\s\\S]*)<\\/markdown>\\s*$`, "i")
      : new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i");
    const match = text.match(pattern);
    return match ? match[1].trim() : null;
  };

  const parsed = {
    title: getTag("title"),
    slug: getTag("slug"),
    excerpt: getTag("excerpt"),
    tags: getTag("tags"),
    markdown: getTag("markdown"),
  };

  if (!parsed.title || !parsed.markdown) {
    throw new Error(`Model output missing required fields (title or markdown). Raw output:\n${text}`);
  }

  // Normalize tags: split, trim, lowercase, dedupe
  parsed.tags = [...new Set(
    (parsed.tags || "")
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)
  )].join(", ");

  // Validate and fix excerpt length
  if (!parsed.excerpt || parsed.excerpt.length > 200) {
    const firstParagraph = parsed.markdown.split("\n\n")[1] || "";
    if (!firstParagraph.trim()) {
      console.warn("[generatePost] Could not derive excerpt fallback; markdown structure unexpected.");
    }
    parsed.excerpt = firstParagraph.slice(0, 197).trim() + "...";
  }

  parsed.slug = slugify(parsed.slug || parsed.title);

  // Check for slug collision against existing slugs
  if (existingSlugs.includes(parsed.slug)) {
    let suffix = 2;
    while (existingSlugs.includes(`${parsed.slug}-${suffix}`)) suffix++;
    parsed.slug = `${parsed.slug}-${suffix}`;
    console.warn(`[generatePost] Slug collision resolved: appended -${suffix}`);
  }

  return parsed;
}
